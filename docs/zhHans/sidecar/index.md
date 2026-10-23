# Sidecar 编写指南

本套文档对应 **NexaCL Firefly Alpha 12 的 Host 与独立协议库**。当前线协议版本为 1，协议消息和注册编号按追加方式演进；这不等于独立 Plugin SDK 已冻结。

Sidecar 是独立进程，通过有界异步本地 IPC 注册能力和交换数据。它不是把 DLL 加载到启动器内部，也不是把旧 `.pnp` 改名为 `.nsc`。

## 学习路线

1. [构建第一个 Sidecar](quick-start)：可编译源码和真实双进程 IPC 自测。
2. [协议与生命周期](protocol-and-lifecycle)：引导证明、握手、注册、快照、激活和退出。
3. [数据与 Host API](host-api)：数字分派、值编码、命令/查询、流和错误。
4. [UI 与扩展](ui-and-extensions)：宿主授予的卡片、交互文档、标题补丁与信号。
5. [测试与分发](testing-and-publishing)：超时、预算、取消、签名及平台检查。

## 与旧版文档的区别

本教程不承诺旧插件 SDK 的生命周期、包清单或 AXAML 页面在 NexaCL Sidecar 中可直接使用。独立执行器与 SDK 不在当前源码仓库的 Host 交付范围；不要假定存在可安装的稳定 Nexa.Plugin NuGet 包。

示例只引用 `Nexa.Sidecar.Protocol` 与 `Nexa.Sidecar.Transport` 的实际工程，既不引用 Desktop/Avalonia，也不引入 Runtime 的私有实现。[权威 Host 参考](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)。
