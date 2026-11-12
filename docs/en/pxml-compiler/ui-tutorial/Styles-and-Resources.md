# Styles, themes, and resources

Separate structure, styles, theme values, localization and binary assets so each can be validated at its own boundary. Similar-looking resource syntax does not imply identical ownership.

**Version scope:** historical PXML 1.0 and its matching runtime. For current plugins, use [ABI 100](/en/plugin-sdk/).

PXML separates structure, visual rules, theme values, binary resources, and localization.

## Classes and PXSS

```xml
<Button Class="Primary Compact" Text="Install" />
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

The compiler lowers classes/selectors to IDs and match plans. PXML 1.0 supports type, class, common state, type+class, child, and ancestor selectors; it excludes `:has()`, regex, complex attributes, and nth-child selectors.

## Theme, resources, and localization

```xml
<Column Padding="{theme Spacing.Large}" Background="{theme Surface.Layer1}">
  <Image Source="{res Images.Logo}" />
  <Text Text="{loc Download.Title}" Foreground="{theme Text.Primary}" />
</Column>
```

Theme names become `ThemeTokenId`, resources become `ResourceId`, and localization keys become `LocalizationKeyId`. Runtime updates affected token properties without reparsing strings. Resource manifests map canonical names to packaged assets; never embed absolute filesystem paths in UI source.

Use semantic tokens for spacing, colors, and motion. Keep one-off local dimensions inline, and keep visible text plus accessible names consistently localized without exposing secrets in semantic output.

Next: [Motion, interaction, and accessibility](./Motion-Interaction-and-A11y).

## Check your result

Check a missing resource and an alternate locale as well as the default style.
