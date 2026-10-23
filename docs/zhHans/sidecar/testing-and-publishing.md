# 测试与分发

## 先运行受控测试

文档示例 `--self-test` 使用真实双进程本地 IPC，但不等于通过生产 Host 的签名准入，也不替代跨平台真机验收。

开发更完整的 Sidecar 时至少覆盖：无效挑战、版本不匹配、重复声明、错误 codec、空/完整快照、READY 前请求、同 correlation 的取消、超时后的晚到结果、断线重启、事件有界队列与流 credit、停用后旧 UI 点击、按顺序注销退出。

可在 NexaCL 源码运行已有协议与 Host 用例：

```sh
dotnet run --project tests/Nexa.Sidecar.Tests -c Release
dotnet run --project tests/Nexa.Xsr.Runtime.Tests -c Release
```

默认注册上限 4096 项、semantic ID 256 字符、注册帧总载荷 32 MiB，初始快照另有 32 MiB 预算；各阶段默认 30 秒。Host 可以收紧这些限制，Sidecar 不能自行提高。单值、在途请求、队列和流还有独立预算，详见 Host API。

## 生产分发

1. 为各 RID 发布匹配架构的原生可执行文件，改扩展名为 `.nsc`；保留 Unix 可执行权限。
2. 使用生产 Host 已信任的发布者签名生成同名 `.nsc.asc`，放在同一目录。不要把任何发布私钥放进 Sidecar、文档、仓库或日志。
3. A12 只在 `AppContext.BaseDirectory` 顶层发现包；包身份是去掉 `.nsc` 的文件名，不是任意路径。跟随源码/文档中的信任契约，不提供自签名自动授权的承诺。
4. 分发前测试真实 Host 的发现、验签、引导、注册、激活、停用和重启，附协议要求、系统架构、版本及许可。

## 常见失败

| 现象 | 排查 |
|---|---|
| 没有发现包 | 顶层目录、`.nsc` 后缀、文件权限和目标架构 |
| 验签失败 | `.nsc.asc`、文件是否改动、实际可信发布者；不是任意 GPG 密钥 |
| 引导超时 | 读取原始 stdin 32 字节、回显到 IPC、endpoint 参数 |
| 注册失败 | 计数、重复 ID、codec、hash、快照覆盖与大小预算 |
| UI 不出现 | Host 槽位授权、模块 schema、依赖资源与当前会话 |
| 请求悬挂 | correlation、ACTIVE 状态、CANCEL、timeout、队列上限 |

Sidecar 崩溃不得终止 Host；也不要在 Sidecar 中吞掉协议错误，伪造一个成功结果继续运行。
