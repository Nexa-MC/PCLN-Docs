# NTP/1 主题包开发

目标：在不改变启动器业务行为的前提下，提供可调节、可恢复、跨亮暗模式的外观。NTP/1 将清单、NSS/1、资源和设置选项组成一个 `.ntp` ZIP，也允许显式导入开发目录。

## 从目标选择能力

| 目标 | 使用的契约 | 完成标准 |
| --- | --- | --- |
| 标题颜色和字号可调 | Color/Range option + NSS token/option | 调节后立即生效，重启保留 |
| 适应窄窗口 | viewport、grid 与有限布局属性 | 窄宽两种窗口没有溢出，命中位置正确 |
| 换窗口、托盘或 Splash 图标 | appearance resource slot | 亮暗、恢复窗口和启动期均有合理回退 |
| 用户选择背景/音乐 | File/Files/Directory + Host grant | 无授权不读取，撤销和换来源后不复用旧权限 |
| 改按钮执行逻辑或新增页面 | 不属于主题能力 | 改走获准 Sidecar/Host 扩展流程 |

先阅读[目标与架构指南](/development/)。主题没有脚本，不能在 CSS 里拼接命令，也不能通过资源表达式执行代码。

## 教程路线

1. [第一个主题](./quick-start)：复制完整文件、打包、导入并观察三个设置。
2. [清单与值类型](./manifest-and-options)：逐字段解释 NTP、九种值、默认值与版本。
3. [设置控件实战](./options-recipes)：开关、滑块、分段、文件选择、条件显示与实时应用。
4. [NSS/1 语言](./nss-language)：选择器、优先级、token、条件、响应式及失败规则。
5. [布局与动效](./layout-and-motion)：完整属性参考、网格、变换、虚拟列表和关键帧。
6. [样式与资源](./styles-and-resources)：包内资源、外部授权、字体、图片与媒体。
7. [外观与能力](./appearance-and-capabilities)：所有 appearance 字段、平台能力与启动期行为。
8. [测试与发布](./testing-and-publishing)：开发目录、可复现打包、回退与平台证据。
9. [综合案例与排错](./cookbook-and-troubleshooting)：把外观目标拆成可验证的改动。

## 贯穿教程的两个示例

`examples/themes/twilight` 是没有外部资源依赖的入门包；`examples/themes/workshop` 覆盖九种参数值类型、四种主要控件、条件显示、包内背景和媒体授权选择。媒体默认关闭，文件选择不会凭空生成授权或开始播放。

这两个目录都经过真实 `ThemePackageService` 清单/来源准入和 NSS 编译。原生图片、字体或音频输出需要另外在目标平台验证；便携实验项目不会冒充原生窗口测试。

## 兼容性约定

本文对应 A12 的 style API 1。主题版本是自己的版本，与 `2.0.0.alpha.12` 无关。公开能力名称比某个具体宿主 Key 更稳定，但选择器仍需针对目标启动器版本验证。未支持的必需能力阻止激活，可选能力必须声明 fallback。


## 实现依据

- [docs/xsr/ntp-v1.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/ntp-v1.md)
- [docs/xsr/theme-package-architecture.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-package-architecture.md)
