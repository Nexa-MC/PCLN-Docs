# Components, templates, and slots

Extract repeated authoring structure into typed compile-time components and slots. Expansion changes the blueprint; it does not add arbitrary runtime control classes.

**Version scope:** historical PXML 1.0 and its matching runtime. For current plugins, use [ABI 100](/en/plugin-sdk/).

PXML components are compile-time macros with typed properties and content slots. They do not add runtime control objects.

## Define and use a component

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

```xml
<local:ActionCard Text="Compile">
  <Button Text="Start" Command="{cmd Compiler.Build}" />
</local:ActionCard>
```

Expansion resolves the component, validates properties, fills slots, substitutes `component.*`, expands nested components, and folds constants.

Named slots use `x:Into Slot="Header"` / `x:Into Slot="Content"`. Missing required slots, unknown slots, and duplicate fills are diagnostics.

## Templates

```xml
<x:Template Name="VersionTemplate" Type="VersionModel" As="version">
  <Text Text="{version.Name}" />
</x:Template>
<Content Template="{template VersionTemplate}" Value="{bind SelectedVersion}" />
```

Template locals are typed, not runtime dictionaries.

## Explicit inputs

```bash
pxmlc --full Page.pxml -o Page.pxb \
  --component Components/ActionCard.pxml \
  --import Shared/Templates.pxml
```

`x:Import Source` resolves only to a file explicitly registered with `--import`; components use `--component`. `x:Const` and `x:IfBuild` disappear from release blueprints after folding.

Next: [Styles, themes, and resources](./Styles-and-Resources).

## Check your result

Expand the same component with two property sets and inspect the resulting nodes and slot content.
