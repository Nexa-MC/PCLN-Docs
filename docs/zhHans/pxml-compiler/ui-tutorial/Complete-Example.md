# 完整页面示例

把完整下载页视为前面 PXML 章节的组合示例。其中命令与 NativeHost 接入仍需要对应运行时服务。

**适用版本：**历史 PXML 1.0 及其匹配运行时。当前插件请使用 [ABI 100](/plugin-sdk/)。

这个下载页面组合本地化、Command、NativeHost、运行时条件和 VirtualList。

## DownloadPage.pxml

```xml
<?pxml version="1.0" strict="true"?>
<Page
  xmlns="pcl://ui"
  xmlns:x="urn:pcl:pxml:x"
  xmlns:local="urn:sample"
  x:Name="DownloadPage">

  <Column
    Padding="{theme Spacing.Large}"
    Gap="{theme Spacing.Medium}">

    <Row Gap="12" Align="Center">
      <Text Class="PageTitle" Text="{loc Download.Title}" />
      <Spacer />
      <Button
        Text="{loc Common.Refresh}"
        Command="{cmd Versions.Refresh}"
        AccessibleName="{loc Common.Refresh}" />
    </Row>

    <NativeHost
      Kind="TextBox"
      Value="{bind Download.SearchText}"
      Placeholder="{loc Download.SearchPlaceholder}"
      AccessibleName="{loc Download.SearchLabel}" />

    <x:If Condition="{bind Download.IsLoading}">
      <Text Text="{loc Common.Loading}" />
      <x:Else>
        <VirtualList
          Items="{bind Download.VisibleVersions}"
          Key="{item.Id}"
          EstimatedItemHeight="56"
          OverscanBefore="2"
          OverscanAfter="3">
          <Template As="item">
            <local:VersionCard
              Version="{item}"
              Command="{cmd Download.Install}"
              CommandParameter="{item.Id}" />
          </Template>
        </VirtualList>
      </x:Else>
    </x:If>
  </Column>
</Page>
```

## VersionCard.pxml

```xml
<?pxml version="1.0"?>
<x:Component xmlns:x="urn:pcl:pxml:x" x:Name="VersionCard">
  <x:Property Name="Version" Type="VersionModel" Required="true" />
  <x:Property Name="Command" Type="command" Required="true" />
  <x:Property Name="CommandParameter" Type="string" Required="true" />

  <Row Class="version-card" Padding="12" Gap="8" Align="Center">
    <Column Gap="4">
      <Text Text="{component.Version.Name}" />
      <Text Text="{component.Version.ReleaseDate}" />
    </Column>
    <Spacer />
    <Button
      Text="{loc Common.Install}"
      Command="{component.Command}"
      CommandParameter="{component.CommandParameter}"
      AccessibleName="{loc Common.Install}" />
  </Row>
</x:Component>
```

## 构建

```bash
pxmlc --full DownloadPage.pxml -o DownloadPage.pxb \
  --component VersionCard.pxml \
  -D RELEASE --release --strict --warn-as-error

pxmlc inspect DownloadPage.pxb
pxmlc dump DownloadPage.pxb
```

Host 还需要注册强类型 Download state schema、Command ID、本地化表、Theme Token、VersionCard 的组件 schema，以及 VirtualList 的 `IUiVirtualItemSource` adapter。它们是构建/Runtime integration contract，不应通过反射从页面对象临时发现。

至此，你已经走完从 source authoring、复用组件、响应式状态、虚拟化到 Release PXB 的完整路径。继续查阅 [编译器 CLI](/pxml-compiler/CLI) 和 [编译阶段与 PXB](/pxml-compiler/Pipeline-and-PXB)。

## 检查结果

编译页面、检查蓝图，并在匹配运行时核对每个外部绑定后再认定交互功能完成。
