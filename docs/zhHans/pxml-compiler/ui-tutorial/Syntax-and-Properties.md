# 语法、节点与属性

一致地编写 PXML 声明、命名空间和类型化属性。严格验证可以在运行前定位拼写错误或不支持的属性。

**适用版本：**历史 PXML 1.0 及其匹配运行时。当前插件请使用 [ABI 100](/plugin-sdk/)。

## 文件头与 namespace

推荐为页面启用 1.0 严格模式：

```xml
<?pxml version="1.0" strict="true"?>
<Page xmlns="pcl://ui" xmlns:x="urn:pcl:pxml:x">
  <!-- 页面内容 -->
</Page>
```

默认 namespace 提供 UI 节点；`x` namespace 提供编译期指令。组件 namespace 必须在构建期可解析，例如 `xmlns:local="urn:sample"` 或指向已注册的本地组件目录。PXML 不会通过 HTTP 下载 namespace 内容。

## 四类 Element

| 类别 | 作用 | 例子 |
|---|---|---|
| Primitive | 直接 Lower 为 Blueprint node/component data | `Text`、`Row`、`Column`、`Grid`、`Overlay`、`Scroll`、`VirtualList`、`NativeHost` |
| Component | 在构建期展开的宏组件 | `Button`、`VersionCard` |
| Directive | 控制编译或结构 | `x:Const`、`x:IfBuild`、`x:If`、`x:For` |
| Template | 描述延迟实例化的静态蓝图 | `Template`、`x:Template` |

Component 不是运行时 C# Control。编译后，Component 的 property substitution、slot 和嵌套组件已经展开，Runtime 只看到 Primitive 对应的紧凑数据。

## Literal

```xml
<Node
  Visible="true"
  Opacity="0.8"
  ZIndex="100"
  Width="50%"
  MinWidth="120"
  Padding="16,12"
  Background="#FF2288" />
```

常用规则：

- 长度支持固定值、百分比、`auto` 和 Star（`1*`、`2*`）。
- Thickness 的一个值表示四边，两个值表示水平/垂直，四个值依次为左、上、右、下。
- Color 使用 `#RRGGBB` 或 `#AARRGGBB`。
- Duration 使用 `ms` 或 `s`，例如 `250ms`、`0.2s`。
- 不合法或当前属性不支持的 literal 必须产生诊断，不能静默退化。

## Markup expression

动态或符号值统一放在 `{...}` 中：

```xml
<Text
  Text="{bind User.Name}"
  Foreground="{theme Text.Primary}" />

<Button
  Text="{loc Common.Continue}"
  Command="{cmd Navigation.Continue}" />

<Image Source="{res Images.Logo}" />
```

常见前缀包括 `bind`、`cmd`、`event`、`theme`、`res`、`loc`、`motion`、`feature`、`template` 和 `ref`。它们会 Lower 成强类型 ID 或程序，不会在 Runtime 中按字符串反射查找。

## Identity 与引用

只有需要引用的节点才声明 `x:Name`：

```xml
<Button x:Name="MoreButton" Text="更多" />
<Popup Anchor="{ref MoreButton}" />
```

集合、Template 和结构 reconcile 使用稳定 `Key`/`x:Key`。不要把数组位置或每次刷新都变化的随机值作为 Key。

## 严格模式检查什么

严格模式至少应拒绝未知属性、不合法 literal、错误的 markup kind、缺失的 `xmlns="pcl://ui"`、非法 scope 和无法解析的组件。完成一小段 PXML 后立即运行：

```bash
pxmlc check Page.pxml --strict
```

下一章：[布局与尺寸](./Layout-and-Sizing)。

## 检查结果

以严格模式编译，故意拼错一个属性并核对源码诊断。
