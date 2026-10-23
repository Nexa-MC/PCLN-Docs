# NTP/1 主题包开发

本教程对应 **NexaCL Firefly Alpha 12**。NTP/1 是外观包协议，不是旧版 PCL N 的插件格式。

主题可以提供颜色、字号、布局样式、有限动画、图片、字体和由启动器绘制的设置控件。主题不能替换 NXML 页面、添加业务命令、执行脚本或自行读取任意外部目录。

## 学习顺序

1. [制作第一个主题](quick-start)：目录、可用示例、打包和导入。
2. [清单与设置控件](manifest-and-options)：类型、开关、滑块、分段选择及实时应用。
3. [样式与资源](styles-and-resources)：NSS/1、亮暗模式、资源授权和适配边界。
4. [测试与发布](testing-and-publishing)：检查、恢复、可复现打包及分发清单。

## 三条边界

- NTP/1、NSS/1、styleApi 和启动器产品版本分别管理，不要把 Alpha 12 写成格式版本。
- 缺少必需能力会拒绝启用；可选能力必须提供已声明的回退方案。解析器认识某个属性，不等于所有系统都能呈现对应特效。
- 用户的减少动态效果、安全模式、硬件加速恢复及窗口生命周期策略优先。

示例源码位于 [examples/themes/twilight](https://github.com/Nexa-MC/PCLN-Docs/tree/main/examples/themes/twilight)。协议依据：[NTP/1](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/ntp-v1.md) 与 [主题包架构](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-package-architecture.md)。
