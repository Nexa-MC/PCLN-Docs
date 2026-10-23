# Sidecar 编写：以独立能力完成目标

Sidecar 是独立执行进程。Host 负责信任、会话、注册表、本地状态镜像、权限与有限展示；Sidecar 负责自己的业务代码、私有状态与依赖。设计目标是“注册一次 → 按数字契约执行 → 通过状态观察 → 在 Host 本地渲染”。

## 先判断是否需要 Sidecar

只改外观用[主题包](../theme-packs/)。需要新行为或私有数据时，先读[目标与 XSR 设计](../development/)，再选择已开放目标。不要为了一个颜色或文字样式创建进程，也不要为了新增业务绕过 Host 的授权边界。

| 想实现的结果 | A12 中的路线 |
| --- | --- |
| 调用独立计算、返回一个结果 | 注册 Command / Query，声明参数和结果 codec |
| 持续显示当前状态 | 注册 State，完整初始快照，再发 StateDelta |
| 通知一次变化或连续输出 | Event 或有 credit 的 Stream |
| 资源页有限表单 | 授权 `ui.resources.extension-card.v1`，schema 2 节点 |
| 搜索标签、搜索信号、展示字段补丁 | 精确开放目标与有限 ABI，不是任意页面注入 |

## 这套教程交付什么

本文锁定 `v2.0.0.alpha.12` 的 Host 和可移植 Protocol/Transport 库。协议 version=1，但仍处于独立 SDK 冻结前的演进阶段；不要把源码示例当作已发布的 SDK 稳定包承诺。

独立 `Nexa.Plugin.Sidecar` 执行器、插件 SDK 与包/UI-IR 冻结位于独立工程。这些页面教你当前可验证的协议接入、业务拆分和 Host 合作方式；不会编造未发布的 `[Plugin]`、NuGet 包、manifest 字段或安装按钮。

## 完整阅读路线

1. [第一个 Sidecar](./quick-start)：运行真正的子进程回显示例，建立可工作的起点。
2. [生命周期与线格式](./protocol-and-lifecycle)：握手、特性、注册、快照、数字 ID、预算和退役。
3. [命令、查询与编码](./commands-and-queries)：所有值 codec、DTO、相关 ID、取消、错误与幂等。
4. [状态、事件和流](./state-events-streams)：当前事实、瞬时通知、credit 与有界消费。
5. [UI 与扩展](./ui-and-extensions)：每种节点、引用校验、图像、草稿与 exposure。
6. [信号与补丁](./signals-and-patches)：精确目标、二进制格式、函数 ABI 和执行边界。
7. [Host API](./host-api)：全部 14 条 Host 组合路由、直接方法和常见结果语义。
8. [打包、发现与签名](./packaging-and-discovery)：原生 `.nsc`、启动参数、信任与监督恢复。
9. [测试与发布](./testing-and-publishing)：代码、自测、AOT、正式准入和分层证据。
10. [综合案例与排错](./cookbook-and-troubleshooting)：从目标拆到契约，定位各阶段失败。

## 示例的证据边界

`examples/sidecar --self-test` 使用真实命名管道/Unix socket、32 字节启动证明和子进程，完成注册、查询及退出。`--recipes` 是可运行编码实例，覆盖 DTO、State/Event、Stream、有限 UI 和错误值。

编码实例不等于 Host 授权；本地自测不等于正式签名安装；Linux AOT 不证明 Windows/macOS 执行。每一章会说明片段属于哪一侧及需要哪些已声明前提。


## 实现依据

- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
- [docs/xsr/nxml-renderer.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nxml-renderer.md)
