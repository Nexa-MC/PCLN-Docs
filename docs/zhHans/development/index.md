# 第三方开发指南

这套指南面向希望为 NexaCL 增加外观、交互或独立功能的作者。基线是 **Firefly Alpha 12，`v2.0.0.alpha.12`**；例子引用该标签的真实实现，不把架构路线图当成现成 API。

默认你能阅读 C#、JSON、XML 和命令行。本指南不讲变量、循环、类或 JSON 的通用语法；**NTP、NSS、NXML、Sidecar 的专用语法与行为从头解释**。每条路线都包含完整文件、操作步骤、预期结果、失败处理和验证方法。

## 先选择能完成目标的扩展方式

| 用户目标 | 应选择 | 可以做什么 | 需要先知道的边界 |
| --- | --- | --- | --- |
| 调整颜色、间距、字体、窗口图标和动效 | NTP/1 主题 | NSS、参数控件、包内资源、用户授权媒体 | 不创建命令，不替换 NXML，不运行程序 |
| 维护独立业务状态，并在资源页展示有限交互表单 | Sidecar | 注册命令/查询/状态/事件/流与获准的 UI 模块 | 代码在独立进程；先通过签名和 Host 授权 |
| 学习或参与宿主页面、布局、绑定与动态列表的开发 | NXML | 宿主组件、局部动态片段、状态投影、交互语义 | 是宿主开发语言，不是 NTP 或 Sidecar 可随意注入的页面 |
| 给现有搜索提示改标题或观察已开放的资源搜索信号 | Sidecar 的有限扩展 | 标题补丁、Event/Intent、获准 Function Patch | 目标名与 ABI 由 Host 决定，不能任意选择宿主方法 |
| 开发旧 `.pnp` 插件 | 旧 SDK 文档 | 对应旧产品线的契约 | 不与 `.nsc`、NXML 或 NTP/1 混用 |

“我想做一个漂亮的状态面板”不足以选技术。先问：只改外观，还是拥有新状态？谁执行动作？当前 Host 是否提供目标槽位？这三个答案决定方案。

## 建议学习顺序

1. 阅读[按目标完成一个功能](./goal-first)，写出可观察的验收结果。
2. 阅读[XSR 架构与作者职责](./xsr-architecture)，区分命令、查询、状态、事件及进程边界。
3. 按目标进入[主题包](../theme-packs/)、[Sidecar](../sidecar/)或[NXML](../nxml/)路线。
4. 参考[综合案例设计](./walkthrough)，把异常、取消和退役纳入第一版实现。
5. 构建示例，在自己的目标平台验证，再发布包、兼容范围与测试记录。

不必先读完整帧协议才能改一个主题。反过来，也不能因为表单能显示就跳过状态所有权和会话生命周期。

## 当前可交付内容与外部边界

本仓库提供 Host、可移植的 `Nexa.Sidecar.Protocol` / `Nexa.Sidecar.Transport` 和受限 UI 契约。独立 Plugin SDK、执行器及其包格式冻结属于另一个工程。这里的项目引用示例是**源码级协议接入教程**，不声称存在一个可直接安装的通用 SDK NuGet 包。

正式启动器要求可信发布者签名；本地协议自测不需要生产密钥，但不构成正式安装授权。主题包不含可执行代码，使用另一套资源与格式准入。

## 示例怎样使用

[文档仓库 examples](https://github.com/Nexa-MC/PCLN-Docs/tree/main/examples)是完整可构建文件；正文中的局部片段会说明放置位置。优先运行完整示例，再一次只改一个契约。每次修改记录“输入 → 预期输出 → 验证命令 → 实际结果”。

运行通过、可在正式 Host 安装、获得某个扩展目标授权，是三件不同的事。发布说明需要分别说明，不能用“本地窗口正常”替代平台和生命周期测试。


## 实现依据

- [docs/xsr/nxml-renderer.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nxml-renderer.md)
- [docs/xsr/ntp-v1.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/ntp-v1.md)
- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
