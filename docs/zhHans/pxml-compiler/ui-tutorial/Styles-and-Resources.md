# 样式、主题与资源

区分结构、样式、主题值、本地化和二进制资源，让各层分别验证。相似的资源语法不代表相同所有权。

**适用版本：**历史 PXML 1.0 及其匹配运行时。当前插件请使用 [ABI 100](/plugin-sdk/)。

PXML 把结构、视觉规则、主题值和二进制资源分开。这样相同 Blueprint 可以响应主题变化，而不在每个节点复制样式字符串。

## Class 与 PXSS

```xml
<Button Class="Primary Compact" Text="安装" />
```

```css
Button {
  background: $Control.Background;
  color: $Control.Foreground;
  corner-radius: 8;
}

Button:hover { background: $Control.BackgroundHover; }
Button:pressed { transform.scale: 0.97; }
Button:disabled { opacity: 0.45; }
.Primary { background: $Accent.Primary; }
```

Compiler 把 class 与 selector 预解析为 ID 和匹配计划。Release 不需要保留原始 class name。

PXML 1.0 selector 支持 Type、`.Class`、常用状态、`Type.Class`、父子和祖先关系；不支持 `:has()`、正则 selector、复杂 attribute selector 或 `:nth-child`。

## Theme Token

简单属性可以直接引用 token：

```xml
<Column
  Padding="{theme Spacing.Large}"
  Background="{theme Surface.Layer1}">
  <Text Foreground="{theme Text.Primary}" />
</Column>
```

Runtime 接收的是 `ThemeTokenId`。主题切换更新 token value 和受影响属性，不重新解析字符串。

## Resource

```xml
<Image Source="{res Images.Logo}" />
```

`.pxres`：

```json
{
  "Images.Logo": "Assets/logo.webp",
  "Images.DefaultAvatar": "Assets/avatar.webp"
}
```

资源名称会 canonicalize 为 `ResourceId`。不要在 PXML 中拼接磁盘绝对路径；打包器负责把资源放入 `.pxpkg` 或 Core asset table。

## Localization

```xml
<Text Text="{loc Download.Title}" />
<Button
  Text="{loc Common.Install}"
  AccessibleName="{loc Common.Install}" />
```

本地化 key 编译为 `LocalizationKeyId`。可见文本与 AccessibleName 应来自相同语义来源，但密码、token 等敏感值不得进入 semantic output。

## 组织建议

```text
Ui/
├ Pages/
├ Components/
├ Styles/
│  ├ Base.pxss
│  └ Components.pxss
├ Resources/App.pxres
└ Localization/
```

把间距、颜色和 motion 使用语义 token 表达；避免在大量页面复制 magic number。局部一次性尺寸仍可以 inline。

下一章：[动效、交互与无障碍](./Motion-Interaction-and-A11y)。

## 检查结果

除了默认样式，还要检查资源缺失和另一种语言。
