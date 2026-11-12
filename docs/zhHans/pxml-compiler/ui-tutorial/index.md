# PXML UI 教程

按历史 PXML 1.0 路线学习从源码到 PXB 的构建。使用匹配的编译器和 PCL.UI.Next 运行时，不要把其语法用于当前插件 NXML。

**适用版本：**历史 PXML 1.0 及其匹配运行时。当前插件请使用 [ABI 100](/plugin-sdk/)。

本教程面向使用 PXML 构建 PCL.UI.Next 界面的开发者。它从最小页面开始，逐步覆盖完整的 PXML 1.0 UI authoring contract，并始终保留一条可验证的构建链：

```text
PXML 源文件 → 检查 → 展开与优化 → PXB → PCL.UI.Next Runtime
```

## 学习路线

1. [创建第一个界面](./First-Page)：编写、检查、编译并查看第一个 PXB。
2. [语法、节点与属性](./Syntax-and-Properties)：掌握 namespace、Primitive、Component、literal 与 markup expression。
3. [布局与尺寸](./Layout-and-Sizing)：使用 Row、Column、Grid、Overlay、Absolute、Scroll 和长度约束。
4. [Binding、Command 与事件](./Binding-and-Commands)：建立纯函数状态读取和显式业务动作边界。
5. [条件、列表与虚拟化](./Structure-and-Lists)：选择 If、Switch、For 或 VirtualList，并维护稳定 Key。
6. [组件、模板与 Slot](./Components-and-Templates)：构建可复用的编译期组件，不引入运行时 Control object graph。
7. [样式、主题与资源](./Styles-and-Resources)：组织 PXSS、Theme Token、资源和本地化。
8. [动效、交互与无障碍](./Motion-Interaction-and-A11y)：声明 Transition、FLIP、Behavior、Focus 与 semantic contract。
9. [弹层、导航与 NativeHost](./Overlays-Navigation-and-NativeHost)：处理 Tooltip、Popup、Modal、页面生命周期和平台控件。
10. [构建、调试与发布](./Build-Debug-and-Release)：把 source、component、resource 和 build symbol 接入可重现流水线。
11. [完整页面示例](./Complete-Example)：把前面的概念组合为一个下载页面。

## 阅读约定

- XML 片段描述 PXML 1.0 语言语义；独立编译器与目标 Runtime profile 必须共同支持所用节点、属性和 ABI。
- `bind` 只读取状态并执行纯计算，业务副作用只能通过 `cmd`。
- Component、Template、PXSS selector 和资源名称在构建期解析；Runtime 不保留 XML DOM，也不依赖反射查找控件。
- 编译器只负责构建期转换。窗口、输入、布局、动画、渲染和平台 NativeHost 由 PCL.UI.Next Runtime 执行。

建议按顺序完成教程。只需要查语法时，可以直接使用左侧目录和站内搜索。

## 检查结果

先构建首个页面并检查产物，再继续绑定和复用组件。
