# Syntax, nodes, and properties

Write the PXML prolog, namespaces and typed properties consistently. Strict validation helps locate a misspelled or unsupported property before runtime.

**Version scope:** historical PXML 1.0 and its matching runtime. For current plugins, use [ABI 100](/en/plugin-sdk/).

## Prolog and namespaces

Use PXML 1.0 strict mode for pages:

```xml
<?pxml version="1.0" strict="true"?>
<Page xmlns="pcl://ui" xmlns:x="urn:pcl:pxml:x">
  <!-- page content -->
</Page>
```

The default namespace provides UI nodes; the `x` namespace provides compile-time directives. Component namespaces must resolve from registered build inputs, such as `xmlns:local="urn:sample"`. PXML never downloads namespace contents over HTTP.

## Four element categories

| Category | Purpose | Examples |
|---|---|---|
| Primitive | Lowers directly to blueprint nodes/component data | `Text`, `Row`, `Column`, `Grid`, `Overlay`, `Scroll`, `VirtualList`, `NativeHost` |
| Component | Compile-time macro component | `Button`, `VersionCard` |
| Directive | Controls compilation or structure | `x:Const`, `x:IfBuild`, `x:If`, `x:For` |
| Template | Static blueprint instantiated later | `Template`, `x:Template` |

A component is not a runtime C# control. Its properties, slots, and nested components are expanded before Runtime sees the primitive data.

## Literals

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

- Lengths support fixed values, percentages, `auto`, and star weights (`1*`, `2*`).
- Thickness accepts one value for all sides, two for horizontal/vertical, or four for left/top/right/bottom.
- Colors use `#RRGGBB` or `#AARRGGBB`.
- Durations use `ms` or `s`.
- Invalid or unsupported literals produce diagnostics; they never silently fall back.

## Markup expressions

```xml
<Text Text="{bind User.Name}" Foreground="{theme Text.Primary}" />
<Button Text="{loc Common.Continue}" Command="{cmd Navigation.Continue}" />
<Image Source="{res Images.Logo}" />
```

Common forms include `bind`, `cmd`, `event`, `theme`, `res`, `loc`, `motion`, `feature`, `template`, and `ref`. They lower to typed IDs or programs rather than reflection-based string lookup.

## Identity and strict validation

Use `x:Name` only when a node is referenced and use stable `Key`/`x:Key` values for collections, templates, and structural reconciliation.

```xml
<Button x:Name="MoreButton" Text="More" />
<Popup Anchor="{ref MoreButton}" />
```

Validate each increment with `pxmlc check Page.pxml --strict`. Strict mode rejects unknown properties, malformed literals, incompatible markup kinds, missing UI namespaces, invalid scopes, and unresolved components.

Next: [Layout and sizing](./Layout-and-Sizing).

## Check your result

Compile in strict mode, deliberately misspell one property and verify the source diagnostic.
