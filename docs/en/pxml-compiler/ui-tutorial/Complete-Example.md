# Complete page example

Read the complete download-page example as a composition of the preceding PXML chapters. Its commands and NativeHost integration still require the corresponding runtime services.

**Version scope:** historical PXML 1.0 and its matching runtime. For current plugins, use [ABI 100](/en/plugin-sdk/).

This download page combines localization, commands, NativeHost, runtime structure, and virtualization.

```xml
<?pxml version="1.0" strict="true"?>
<Page xmlns="pcl://ui" xmlns:x="urn:pcl:pxml:x"
      xmlns:local="urn:sample" x:Name="DownloadPage">
  <Column Padding="{theme Spacing.Large}" Gap="{theme Spacing.Medium}">
    <Row Gap="12" Align="Center">
      <Text Class="PageTitle" Text="{loc Download.Title}" />
      <Spacer />
      <Button Text="{loc Common.Refresh}" Command="{cmd Versions.Refresh}"
              AccessibleName="{loc Common.Refresh}" />
    </Row>

    <NativeHost Kind="TextBox" Value="{bind Download.SearchText}"
      Placeholder="{loc Download.SearchPlaceholder}"
      AccessibleName="{loc Download.SearchLabel}" />

    <x:If Condition="{bind Download.IsLoading}">
      <Text Text="{loc Common.Loading}" />
      <x:Else>
        <VirtualList Items="{bind Download.VisibleVersions}"
          Key="{item.Id}" EstimatedItemHeight="56"
          OverscanBefore="2" OverscanAfter="3">
          <Template As="item">
            <local:VersionCard Version="{item}"
              Command="{cmd Download.Install}"
              CommandParameter="{item.Id}" />
          </Template>
        </VirtualList>
      </x:Else>
    </x:If>
  </Column>
</Page>
```

`VersionCard.pxml` is a registered compile-time component with typed Version, Command, and CommandParameter properties. Build it explicitly:

```bash
pxmlc --full DownloadPage.pxml -o DownloadPage.pxb \
  --component VersionCard.pxml \
  -D RELEASE --release --strict --warn-as-error
pxmlc inspect DownloadPage.pxb
pxmlc dump DownloadPage.pxb
```

The host registers the typed Download state schema, command IDs, localization table, theme tokens, component schema, and VirtualList source adapter. These are build/Runtime integration contracts, never objects discovered by reflection from a page.

You now have the complete path from source authoring and component reuse through reactive state, virtualization, and release PXB. Keep the [CLI reference](/en/pxml-compiler/CLI) and [pipeline guide](/en/pxml-compiler/Pipeline-and-PXB) nearby.

## Check your result

Compile the page, inspect the blueprint and verify each external binding against the matching runtime before claiming an interactive feature.
