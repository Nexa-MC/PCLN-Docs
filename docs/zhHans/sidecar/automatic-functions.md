# NFP3 与自动函数目录

自动函数目录只用于宿主公开的目标和参数契约。NFP3 是经过协商的有限函数补丁格式，不能被解释为任意方法拦截。

**适用版本：**本章源码级示例固定于 `v2.0.0.alpha.14`。当前 Wasm 插件开发请阅读[插件 SDK](/plugin-sdk/)。

Alpha 14 不再只有少数手工注册的函数站点。产品程序集在 C# lowering 后、裁剪／NativeAOT 前插桩，生成对应程序集的 `.nfp` 目录。Sidecar 仍提交有限程序，不加载 CLR 程序集、不改写运行时 IL、不在函数执行中同步 IPC。

## 从目标倒推操作

先确定希望改变哪个具体参数或结果，再读取**目标构建**的目录，核对 Instrumented 状态、阶段、参数／结果形状，协商 `AutomaticFunctions=32`。抽象、runtime-provided 和插桩基础设施条目不表示有可执行正文。不能把某版本目录的 ID 当作永远不变的 API。

目录是 Brotli 压缩的 `NPC1` 二进制，含 ID、规范签名、结果形状／traits、状态、槽和参数。ID 为 `function.auto.` 加 assembly-name 与规范签名组合的 SHA-256 前 16 字节小写 hex。使用完整 canonical signature，不自行猜测重载或省略修饰符。

NFP3 头为 ASCII NFP3、ABI=1、phase 字节、u16 指令数。阶段 Head=1、Args=2、Tail=3、Return=4、Replace=5。所有数值按小端编码。

| 操作码 | 操数 | 行为 |
|---|---|---|
| 1 | u16 参数索引 | 读取类型化参数 |
| 2 | 无 | 读取成功返回值 |
| 3 | kind/u16 长度/内容 | 有界原始常量 |
| 4 | 无 | 同类型 checked 加法或有界字符串连接 |
| 5 | u16 参数索引 | Args 阶段写回同类型参数 |
| 6 | 无 | 写回完全匹配的结果 |
| 7 | 无 | Head/Replace 跳过原实现；非 void 先提供结果 |
| 8 | 无 | 最后一条 End，栈为空且无尾部字节 |
| 9 | u16 参数索引 | 读取类型化参数引用 |
| 10 | 无 | 读取类型化 default 标记 |
| 11 | 无 | 比较同类型已知原始值，产生 Bool |

常量 String=0、Bool=1、I32=2、I64=3、Double=4、Byte=8、SByte=9、I16=10、U16=11、U32=12、U64=13、Single=14、Char=15；浮点必须 finite。没有跳转、循环、调用、I/O、对象反序列化、任意地址读写或转换指令。

## 示例：给 Int64 成功结果加一

仅适用于目录证明结果为 Int64 且允许 Return 的目标，不可替换为任意方法名。

```csharp
using var bytes = new MemoryStream();
using (var writer = new BinaryWriter(bytes, System.Text.Encoding.UTF8, leaveOpen: true))
{
    writer.Write("NFP3"u8); writer.Write((byte)1); writer.Write((byte)4);
    writer.Write((ushort)5);
    writer.Write((byte)2);                         // current result
    writer.Write((byte)3); writer.Write((byte)3); // constant, Int64
    writer.Write((ushort)8); writer.Write(1L);
    writer.Write((byte)4); writer.Write((byte)6); writer.Write((byte)8);
}
byte[] program = bytes.ToArray();
```

以 FunctionPatch 注册，Payload=program、ContentHash=完整 SHA-256、TargetSemanticId=目录中的确切目标。编码不授予信任；签名、协商和完整 shape 校验仍在 READY 前执行。旧 NFP1/NFP2 配方继续兼容其显式站点，不能直接拿来描述自动目录。

## 预算与失败语义

载荷最多 16 KiB、128 指令、栈 16、常量 4 KiB、连接结果 4096 字符；每会话 256 程序、每会话每目标 32 程序、每目标 64 个活动／待定 hook、全局 4096 hook。

opaque 托管值只在 Host 内以完全相同类型转发，不跨 IPC。byref-like、指针和引用返回使用编译器的类型化引用标记，不能伪造地址。构造函数保留 CLR 必要初始化；async kickoff 与 MoveNext 是不同条目，Task 不是虚构的 await 结果。

激活以原子批次标志发布；停用先撤销标志再释放。程序退役前正在执行的改动若未提交则丢弃。非致命程序异常回滚该程序并在本次激活禁用它；原方法异常和取消保持原语义，成功返回阶段不会在异常路径执行。

验证必须包含目标目录一致性、正确／错误 shape、异常、取消、停用竞争、无程序分配成本和真实 NativeAOT。不能仅凭一个字节编码示例宣称能改变任意业务。

完整源码契约：[automatic-function-instrumentation.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.14/docs/xsr/automatic-function-instrumentation.md)。

## 检查结果

核对目标发现、参数与结果类型、冲突拒绝。未知目标或版本不兼容必须在替换发生前失败。
