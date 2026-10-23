# 原生文件、发现、签名与监督

目标是把经过验证的独立能力交付给正确的 Host，并说明安装前提，而不是简单改一个扩展名让它“看起来像插件”。本页针对当前 A12 原生 .nsc 路线，不定义独立 Plugin SDK 的包格式。

## .nsc 到底是什么

它是重命名的标准本机可执行文件：Windows PE、Linux ELF、macOS thin Mach-O。没有自定义 NSC 魔数、加密壳、内存加载或临时解压执行步骤。当前 OS/架构必须匹配；managed DLL、脚本和 ZIP 不能靠改名变成原生文件。

入门例使用 NativeAOT 发布，再将 Example.Sidecar（Windows 的 .exe）重命名为 example.nsc。Unix 保留执行位；macOS 按每个 RID 提供 thin 文件，不假设 universal/fat Mach-O 被接受。

```sh
dotnet publish examples/sidecar/Example.Sidecar.csproj -c Release -r linux-x64 -p:PublishAot=true -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -o out/sidecar
mv out/sidecar/Example.Sidecar out/sidecar/example.nsc
chmod +x out/sidecar/example.nsc
out/sidecar/example.nsc --self-test
```

先验证最终待签文件，再签名；修改字节后签名失效。开发时不要将未经生产准入的程序放进真实安装目录期待自动运行。

## 发现目录与包身份

Host 只扫描 AppContext.BaseDirectory 的**顶层** .nsc，不递归任意用户游戏目录。PackageName 是文件名去掉 .nsc，如 example；控制 API 使用该身份，不是文件路径。最多 64 候选，空/歧义身份各自拒绝。

同级必须有 example.nsc.asc。原生文件最大 512 MiB，detached signature 最大 64 KiB。Host 先验证文件格式和固定发布者签名，再通过 OS loader 启动；签名、发现和激活是不同阶段。

## 签名怎样生成与怎样才被信任

如果你拥有该发布流程认可的签名身份，可以对最终字节做 detached ASCII signature：

```sh
gpg --armor --detach-sign --local-user YOUR_AUTHORIZED_FINGERPRINT --output example.nsc.asc example.nsc
gpg --verify example.nsc.asc example.nsc
```

第二条只验证该 key 对这些字节的签名，不证明正式 Host 信任这个 key。**当前正式 Host 使用内置固定发布密钥；自己生成密钥不会自动获得生产准入。** 第三方发布应遵循维护者实际提供的审阅/发行授权流程，本教程不承诺自助加入信任库。

没有生产签名时仍可运行 --self-test、--recipes 和受控 HostFixture，验证协议/业务而不修改正式验签策略。私钥不放源码、命令参数、日志或发行包，签名不替代具体扩展目标的授权。

## Host 启动参数与一次性证明

```text
example.nsc --nexa-sidecar --endpoint <random-endpoint>
```

Host 在启动前绑定随机当前用户 IPC；32 字节随机证明通过重定向 stdin 交给子进程。peer 调用 Bootstrap.ConnectAsync(endpoint, Console.OpenStandardInput(), token)，先在 IPC 回送证明，再接收 HELLO。

不要把证明放在参数、环境日志或 UI 中。Windows pipe 仅当前用户；Unix 使用生成的 0700 目录与 0600 socket。使用 listener.Endpoint，逻辑 pipe 名不是可删除的文件路径。

## 进程与会话的职责

一个会话失败不停止其他包。Supervisor 记录目录状态、启动/退出与恢复次数；默认有限自动恢复，最多三次后 Quarantined。人工 Stop 关闭恢复，Restart 重新验证；Reload 只重扫原目录。

退役完成要等待 ShutdownAsync/DisposeAsync，不能将同步 Dispose 当作所有子进程已经退出。Host 只尽力终止当前进程树，不保证杀掉已孤立或故意脱离的子孙进程。peer 自己创建的任务、原生库与子进程需要明确拥有和清理。

## 发布清单

每个 RID 提供正确原生文件、detached signature、版本/架构、协议功能需求、已开放目标、资源许可、测试步骤和限制。记录哪些经过真实 OS 执行，哪些仅经过便携模拟。

不要宣传 NativeAOT 是安全沙箱、签名可解锁全部 API，或进程隔离能保护任意同用户文件。扩展能力仍由 Host grant 和服务端/OS 的各自授权决定。


## 实现依据

- [docs/xsr/nsc-and-regional-policy.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nsc-and-regional-policy.md)
- [Nexa.Sidecar.Transport/SidecarExecutable.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Transport/SidecarExecutable.cs)
- [Nexa.Xsr.Runtime/Sidecar/SidecarSupervisor.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Runtime/Sidecar/SidecarSupervisor.cs)
