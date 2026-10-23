# NXML 完整组件与属性参考

本表按 A12 的外部组件与编译器整理。组件名不是 CLR 类型，Required 由组件定义指定。值类型通过有限编译器检查；并非任意属性都可以写在任意原语上。

## 全部内置组件
| Component | Recipe | Role | Children | Required |
| --- | --- | --- | --- | --- |
| Button | CommandInput | Button | true | — |
| CheckBox | CommandInput | CheckBox | false | — |
| ContentHost | Element | Content | true | — |
| Dialog | StackLayout | Dialog | true | — |
| Dynamic | DynamicSlot | None | false | Key |
| HorizontalPager | HorizontalPager | Content | true | — |
| Image | Image | Image | false | Source |
| Navigation | StackLayout | Navigation | true | — |
| NavigationItem | CommandInput | NavigationItem | false | Label,Command |
| Notification | StackLayout | Status | true | — |
| Page | Element | Page | true | — |
| Progress | Progress | ProgressBar | false | — |
| ProgressRing | Progress | ProgressBar | false | — |
| Shell | StackLayout | Page | true | — |
| Slider | RangeInput | Slider | false | — |
| StackPanel | StackLayout | None | true | — |
| Text | Text | Text | false | — |
| TextInput | TextInput | TextInput | false | Label |
| TitleBar | StackLayout | TitleBar | true | — |
| VerticalPager | VerticalPager | Content | true | — |

这些文件位于 Nexa.Xsr.Renderer/Components。自定义 StatusCard/Switch 属于作者显式注册，不在内置表中。Text/Image/Progress/TextInput/Slider 不接受孩子，Dynamic 必须初始为空。

## 身份与原语元数据

| 属性 | 说明 |
| --- | --- |
| Key | 1–128、无空白/控制字符、展开文档内唯一 |
| Class | 最多64个类，每项最多128，字母数字/下划线/连字符 |
| Kind | 原始样式身份，仅原语定义 |
| Recipe | Element1、StackLayout2、Text3、CommandInput4、Image5、VerticalPager6、TextInput7、Progress8、HorizontalPager9、DynamicSlot10、RangeInput11 |
| Role | None/Text/Button/Page/List/ListItem/Image/ProgressBar/Dialog/TitleBar/Navigation/NavigationItem/Content/TextInput/Status/Switch/CheckBox/RadioGroup/RadioButton/Slider |
| AcceptsChildren / Required | 是否可带孩子 / 必需属性名列表，仅原语元数据 |

不能在组件引用上改 primitive metadata；Host IR 枚举编号不是 Sidecar 插件 ABI。

## 尺寸、布局、内容

| 属性 | 值及适用范围 |
| --- | --- |
| Width/Height、MinWidth/MaxWidth、MinHeight/MaxHeight、Weight | 有限 double；尺寸/分配事实 |
| HorizontalAlignment/VerticalAlignment | Stretch/Start/Center/End |
| Margin/Padding | 一个数或左上右下四逗号值 |
| Orientation/Spacing/StretchLastChild | Stack 或 Dynamic 的有限排列 |
| Layout | 仅 Dynamic，Stack/Overlay/HorizontalPager/VerticalPager |
| Content | Text/CommandInput 文字，支持 string State/data 格式 |
| Label | 语义文字，支持 string State/data 格式 |
| Source / Icon | Image/CommandInput 的来源，不能授予文件读取权 |
| Localize | true/false，数据投影应考虑 literal |
| MaxLines/TrimOverflow | Text/CommandInput，0–4096行 / bool，0不设行数上限 |

## 输入、状态、运动

| 属性 | 类型/约束 |
| --- | --- |
| IsVisible | bool 或 bool State |
| Enabled / Clickable | bool 或 bool State，仅支持的可交互原语 |
| Focusable | bool literal，非任意 State getter |
| Command | 语义 ID literal/data，不是方法名或脚本 |
| Selected | CommandInput 的选中事实，literal/data |
| Checked | CheckBox/Switch Role 的 CommandInput，literal/data |
| SelectionRequired | Stack/Dynamic Stack 的组策略，bool |
| SegmentThumb | Stack/Dynamic Stack 中同文档的唯一 transition-bearing thumb Key |
| SegmentWidth | CommandInput 的正有限展开宽度 |
| Placeholder | TextInput，literal/data，不支持 State |
| IsPassword / MaximumLength / PreserveTabs | TextInput 的固定输入契约，bool / 1–32768（默认2048）/ bool |
| Minimum/Maximum/Step/RangeValue | 仅 RangeInput，有限递增边界/正 step/区间内值 |
| Value | 仅 Progress，double 或 double State |
| Ring / Indeterminate | Progress 的 bool，Indeterminate 要求 Ring |
| TransitionKey | 文字或 string State |
| TransitionOffsetX/Y | 有限 double |
| TransitionMovesSelf | bool，要求 TransitionKey；兼容重载中不变 |

## 滚动与弹层

| 属性 | 约束 |
| --- | --- |
| Scroll | Stack/Dynamic；CommandInput 仅 Host 已声明 HoverExpand 的水平胶囊 |
| ShowsVerticalIndicator/StickToEnd/ScrollGesture | 需要 Scroll，Stack/Dynamic Stack；胶囊不允许 |
| ShowsHorizontalIndicator/UseVerticalWheelForHorizontalScroll | 支持的 Scroll 契约；胶囊可用 |
| StableContent | 有限 bool 展示标记，不替代稳定逻辑身份 |
| ModalLayer | Element 或 Overlay Dynamic |
| OverlayMotion | None/Notification/DialogScrim/Dialog |
| LiveSetting | Off/Polite/Assertive |
| DismissCommand | 明确语义 ID，关闭意图不在标记内执行 |
| Anchor / AnchorGap | 作用域内本地 Key / 非负 gap，不能自指/指后代 |

## 基础视觉字段

Background、Foreground、Border、Hover 为颜色；Opacity 0–1；CornerRadius、BorderWidth、BlurRadius、FontSize、FontWeight 为有限数字；TextAlignment 为 Start/Center/End；WrapText、HoverExpand、NavigationLayout 为 bool；Surface 为 None/Solid/Translucent/Glass。

这些基础字段与 NSS/1 扩展属性分开：GridColumns、Transform、FontFamily 等主题通道属性不能据此写成任意 NXML 属性。完整 NSS/1 参考见[布局与动效](../theme-packs/layout-and-motion)。

## 所有预算与结构限制

| 项目 | 上限 |
| --- | --- |
| NXML 文本 | 1 Mi 字符，源文件读取另有4 MiB字节边界 |
| 解析器 XML 节点/元素 | 65536 / 16384 |
| XML 深度/每元素属性 | 小于128 / 128 |
| 组件库 | 256定义，总文本8 Mi字符 |
| 展开后节点/深度 | 16384 / 小于128 |
| 动态参数 | 256，总值长度1 Mi字符，展开另计1 Mi字符 |
| 单混合格式参数占位符 | 256 |
| 基础 NSS | 1 Mi字符、4096规则、每块128声明 |

预算失败拒绝候选，不裁剪继续。Sidecar schema2 的64节点/32KiB预算是另一契约，不能用本表放大第三方 UI 权限。

## 错误类型与处理位置

NxmlParseException：语法、namespace、DTD、文本、binding 格式。NxmlCompileException：组件、属性、类型、结构或样式不合法。NxmlLoadException：未知状态、动态所有权、重载不相容或运行树契约。

先区分阶段，再修改所属声明或组合代码。不能把加载失败伪装成空页面成功，也不能将 Host 业务异常都当成 NXML 错误吞掉。


## 实现依据

- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlNodeSchema.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlNodeSchema.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlParser.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlParser.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlComponentLibrary.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlComponentLibrary.cs)
