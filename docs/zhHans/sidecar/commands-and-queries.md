# 命令、查询、值编码与错误处理

本章从“提交便签”和“回显一个整数”两个目标解释数据面。示例使用 `Nexa.Sidecar.Protocol`；Host 组合侧调用方式在[Host API](./host-api)，独立 peer 不引用 Desktop 或服务实现。

## 选择 Command 还是 Query

Command 请求改变私有业务状态；Query 请求一次结果。不要让 Query 暗中触发安装、删除或其他未说明的副作用，也不要用查询替代持续显示的当前 State。

Host 命令路由区分 `Acceptance` 与 `Completion`。接受表示路由准入，不表示便签已保存。业务若还会继续执行，应发布 Running/完成状态；一次 CommandResult 也不能代表未来后台任务永远成功。

## 全部七个值 codec

| ID / 常量 | 线值 | 验证与应用 |
| --- | --- | --- |
| 0 Utf8String | 严格 UTF-8 | 非法 UTF-8/UTF-16 被拒绝；长度看编码后字节 |
| 1 Bool | 恰好 1 字节，0/1 | 2 不是 true；Toggle 使用这一类型 |
| 2 I32 | 4 字节小端有符号整数 | 传 int，不是任意数字对象 |
| 3 I64 | 8 字节小端有符号整数 | 修订、计数等，传 long |
| 4 F64 | 8 字节 IEEE double | 线 codec 验证形状；需要有限值时业务自行拒绝 NaN/Infinity |
| 5 Bytes | 明确拥有的字节 | 格式由业务约定，不自动反序列化 CLR |
| 6 GeneratedDto | 契约定义的 DTO 字节 | 自己声明字段/版本；名称不代表已有通用代码生成器 |

单值最大 65535 字节。Function Patch 的 Float64 ABI 额外要求 finite，不能误解成所有 wire F64 自动拒绝 NaN。NSS 和主题数字又有自己的有限规则。

```csharp
var number = new SidecarBinaryValue(SidecarWireCodecs.I32,
    SidecarWireCodecs.Encode(SidecarWireCodecs.I32, 42));
int roundTrip = (int)SidecarWireCodecs.Decode(number.CodecId, number.Span);
```

SidecarBinaryValue 会复制输入；Span 是只读视图，ToArray 返回副本。不要在发送后修改共享缓冲区并假设对端会同步看到变化。

## 请求与结果的一次往返

```csharp
byte[] payload = SidecarDataMessages.EncodeBinaryRequest(1, number);
var correlation = SidecarCorrelationId.Create();
var frame = new SidecarFrame(SidecarProtocol.Version,
    SidecarMessageType.QueryRequest, SidecarFrameTraits.None, correlation, payload);
```

上例是 Host 发给 peer 的消息构造片段，不是 peer 用来任意查询 Host 服务的 RPC。peer 检查 Kind 表、ID、参数 codec、激活状态，回复 QueryResult，保留同一个 correlation：

```csharp
var request = SidecarDataMessages.DecodeBinaryRequest(frame.Payload.Span);
byte[] result = SidecarDataMessages.EncodeBinaryResult(true, request.Value, null);
// 发送 QueryResult，使用 frame.CorrelationId 和适当的 CancellationToken。
```

完整收发见 [Program.cs](https://github.com/Nexa-MC/PCLN-Docs/blob/main/examples/sidecar/Program.cs)。结果必须符合 ResultCodecId。CodecId=I32 不会自动把默认 Utf8String 结果改为整数，需要显式声明 ResultCodecId=I32。

## 兼容文本与二进制表示

Encode/DecodeRequest、Result、Event 保留文本表示；EncodeBinary/DecodeBinary 系列明确携带 codec 与字节，需要协商 BinaryPayloads。DecodeBinary*Details 额外返回 IsBinary，用于区分表示。不要混合两套字段。

未知 codec、长度不符、混合表示或错误结果消息种类不能完成已登记交换。字符串可转 UTF-8 不代表可以忽略二进制功能协商。

## 实战：可演进 DTO

ContractRecipes.cs 中的 NoteCodec 实现 ISidecarBinaryCodec&lt;Note&gt;，定义：

| Field | Tag | 含义 |
| --- | --- | --- |
| 1 | U32 | schema=1 |
| 2 | I64 | 非负 Revision |
| 3 | Str | Text，业务最多 120 字符 |

```csharp
using var writer = new SidecarPayloadWriter();
writer.WriteUInt32(1, 1);
writer.WriteInt64(2, 42);
writer.WriteString(3, "Ready");
byte[] dtoBytes = writer.ToArray();
```

用 SidecarPayloadReader.ReadNext 读取，对已知 ID 调用对应 Read 方法；未知字段按长度跳过。最后检查 schema、必需字段、范围和业务长度。新增可选字段可以兼容，改变旧字段含义应升契约版本。

适配器提供 CodecId、Encode(T)、Decode(ReadOnlySpan&lt;byte&gt;)，使用显式泛型调用，不反射字段。完整实现包含边界检查，可用 --recipes 运行。

## 取消与并发

Host 用 correlation 关联待定交换；peer 用它管理任务与取消源。CANCEL 的载荷包含被取消请求的 GUID 和原因，不是取消整个会话。

维护唯一接收循环，将请求交给有界 worker；Health、Cancel、Deactivate 仍及时处理。取消后释放资源，迟到结果不能完成新交换。不要让多个 worker 争抢同一连接的 ReceiveAsync。

超时保留 xsr.timed_out 结果，CANCEL 有独立最佳努力预算；取消通知失败不能把已确定超时改成随机传输错误。

## 稳定错误与重试决定

| 错误 | 含义 | 处理 |
| --- | --- | --- |
| xsr.cancelled | 调用/生命周期取消 | 清理，不显示成功 |
| xsr.timed_out | 截止时间耗尽 | 报超时，副作用状态另行确认 |
| xsr.backpressure | 有界额度已满 | 有界退让/用户重试，不无限创建任务 |
| xsr.feature_unavailable | 缺少协商功能 | 明确兼容分支或不支持 |
| xsr.route_not_found / xsr.target_not_found | 路由/目标不存在 | 检查 ID、kind、包身份和版本 |
| xsr.contract_mismatch | 类型或 codec 不匹配 | 修复声明，不重复相同错误 |
| xsr.unavailable | 包或运行时不接受操作 | 观察状态、等待或重启 |
| xsr.handler_faulted | 处理异常/错误格式非法 | 保留诊断关联，不传 CLR 异常 |

预期拒绝用稳定业务码，如 example.invalid_note；不是成功空字符串。结构化 Error 可结束一个交换，Crash 则终止会话。

## 幂等不是 correlation

correlation 关联一次交换，不去重副作用。写文件或重复提交需要 operation ID、去重、事务或明确幂等语义。超时不证明未写入；换一个 correlation 盲重试可能执行两次。


## 实现依据

- [Nexa.Sidecar.Protocol/SidecarBinaryValue.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarBinaryValue.cs)
- [Nexa.Sidecar.Protocol/SidecarDataMessages.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarDataMessages.cs)
- [Nexa.Sidecar.Protocol/SidecarControlMessages.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarControlMessages.cs)
- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
