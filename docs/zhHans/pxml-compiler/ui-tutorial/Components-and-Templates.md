# 组件、模板与 Slot

把重复结构提取为类型化的编译期组件和槽位。展开改变蓝图，不会引入任意运行时控件类。

**适用版本：**历史 PXML 1.0 及其匹配运行时。当前插件请使用 [ABI 100](/plugin-sdk/)。

PXML Component 是编译期宏：它提供强类型属性和内容插槽，但不会在 Runtime 创建一层 Component object。

## 定义 Component

`ActionCard.pxml`：

```xml
<?pxml version="1.0"?>
<x:Component xmlns:x="urn:pcl:pxml:x" x:Name="ActionCard">
  <x:Property Name="Text" Type="string" Required="true" />
  <x:Property Name="Command" Type="command?" Default="null" />

  <Column Class="action-card" Padding="12" Gap="8">
    <Text Text="{component.Text}" />
    <x:Content />
  </Column>
</x:Component>
```

页面中使用：

```xml
<local:ActionCard Text="编译">
  <Button Text="开始" Command="{cmd Compiler.Build}" />
</local:ActionCard>
```

展开器依次解析 Component、校验 property、填充 slot、替换 `{component.*}`、展开嵌套组件并执行常量折叠。

## 多个 Slot

组件声明 `Header` 和 `Content` 后，调用方可以显式指定内容目标：

```xml
<Card>
  <x:Into Slot="Header">
    <Text Text="标题" />
  </x:Into>
  <x:Into Slot="Content">
    <Text Text="正文" />
  </x:Into>
</Card>
```

必填 Slot 缺失、未知 Slot 或重复填充必须产生编译诊断。

## Template

Template 是可延迟实例化的静态 Blueprint：

```xml
<x:Template Name="VersionTemplate" Type="VersionModel" As="version">
  <Text Text="{version.Name}" />
</x:Template>

<Content
  Template="{template VersionTemplate}"
  Value="{bind SelectedVersion}" />
```

Template local (`version`) 是有类型的，不是 Runtime 字典。

## Import 与组件注册

PXML 不允许展开器隐式读取任意文件。构建系统必须显式注册：

```bash
pxmlc --full Page.pxml -o Page.pxb \
  --component Components/ActionCard.pxml \
  --import Shared/Templates.pxml
```

源码中的 `<x:Import Source="./Shared/Templates.pxml" />` 只能解析到已通过 `--import` 注册的文件。组件文件使用 `--component` 注册；两者的职责不要混用。

## 常量与构建条件

```xml
<x:Const Name="SidebarWidth" Value="256" />
<Column Width="{const SidebarWidth}" />

<x:IfBuild Condition="WINDOWS">
  <WindowsOnlyView />
  <x:Else><PortableView /></x:Else>
</x:IfBuild>
```

`x:Const` 和 `x:IfBuild` 在 Release Blueprint 中消失。运行时功能开关应使用 `{feature ...}` 或运行时 `x:If`。

下一章：[样式、主题与资源](./Styles-and-Resources)。

## 检查结果

用两组属性展开同一组件，检查生成节点和槽位内容。
