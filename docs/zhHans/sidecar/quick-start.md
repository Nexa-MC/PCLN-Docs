# 构建第一个 Sidecar

## 获取与构建

准备 .NET 10 SDK，分别检出 NexaCL 的 `v2.0.0.alpha.12` 与本说明文档仓库。示例在 `examples/sidecar`：

- `Program.cs`：独立端点，注册一个 `example.echo` Int32 查询。
- `SmokeHost.cs`：仅用于测试的本地协议对端，不是生产 Host。
- `Example.Sidecar.csproj`：明确引用当前源码的两个可移植协议工程。

在文档仓库运行，把参数换成实际绝对路径：

```sh
dotnet run --project examples/sidecar/Example.Sidecar.csproj -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- --self-test
```

预期输出以 `PASS: native IPC bootstrap` 开头。自测启动真正子进程，经命名管道/Unix socket 完成挑战证明、握手、注册、空状态快照、Int32 查询、健康检查、注销和退出，不需要生产签名密钥。

## 理解示例

`example.echo` 在 Query 注册表内是第 1 项，因此当前会话 Query ContractId 是 1；不要把 semantic ID 的字符串哈希当作数字 ID，也不要跨会话保存这个数字。

示例声明输入和输出 codec 为 I32；收到 ACTIVE 状态下的 QueryRequest 后，验证数字 ID 和 codec，按原 correlation ID 返回 QueryResult。没有 State 声明仍需发送计数为 0 的完整初始快照。

完整源码：[Program.cs](https://github.com/Nexa-MC/PCLN-Docs/blob/main/examples/sidecar/Program.cs)。不要将示例的测试 Host 当成启动器安装入口。

## NativeAOT 发布

```sh
dotnet publish examples/sidecar/Example.Sidecar.csproj -c Release -r linux-x64 -p:PublishAot=true -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -o out/sidecar
# Linux 示例；Windows 对应重命名 Example.Sidecar.exe
mv out/sidecar/Example.Sidecar out/sidecar/example.nsc
chmod +x out/sidecar/example.nsc
```

为每个目标 RID 单独构建，在对应平台验证。生产发现要求有效的 PE/ELF/Mach-O、同级 `.nsc.asc` 签名及 Host 信任的发布者；**自行生成一个 GPG 密钥并不能让正式启动器信任它**。在完成签名准入前，通过自测或受控 Host 测试开展开发，不要关闭正式 Host 的校验。
