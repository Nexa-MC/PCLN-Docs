# Layout, scroll, two NSS dialects

Make clear, scalable layout with consistent input geometry. NXML owns structure; choose the correct presentation dialect.

## Containers and sizing

Page/ContentHost wrap Element; StackPanel uses Orientation/Spacing; Shell is finite defaults. Pagers are supported primitives, not arbitrary DOM/Flex.

```xml
<Page Key="LayoutExample">
  <StackPanel Orientation="Horizontal" Spacing="16" Padding="24">
    <StackPanel Key="Left" Weight="1" MinWidth="200" MaxWidth="320">
      <Text Content="Account" />
    </StackPanel>
    <StackPanel Key="Right" Weight="2" MinWidth="280">
      <Text Content="Version" />
    </StackPanel>
  </StackPanel>
</Page>
```

Weight participates in allocation while Min/Max still constrain it. Alignments are Stretch/Start/Center/End. NXML thickness is one number or four comma values left/top/right/bottom, not CSS whitespace pairs.

## Host base NSS
```css
#TitleMain { FontSize: 26; Foreground: #23466c; }
.status-card { CornerRadius: 16; Background: #edf3fa; }
Text { FontSize: 15; }
Button { Height: 38; Padding: 12,6,12,6; }
```

NssStyleSheet supports simple type/class/key/* and selector lists, not compound Text#TitleMain, pseudo-classes, tokens, or conditions. It forms base values from component defaults → sheet → explicit markup.

```csharp
var styles = NssStyleSheet.Parse(baseStyleText);
var ir = NxmlCompiler.Compile(NxmlParser.Parse(pageText), components, styles);
```

## Theme NSS/1

| Aspect | Host base NSS | NTP NSS/1 |
| --- | --- | --- |
| Compiler | NssStyleSheet.Parse | NssThemeCompiler.Compile |
| Input | Host templates | Ordered styles/options/environment/resources |
| Selectors | Simple type/class/key/* | Compound/relations/finite attributes/state |
| Tokens/conditions/motion | No | Finite support |
| Thickness | One/four comma values | One/two/four, documented whitespace/comma order |
| Application | Base IR | Independent style-only generation |

Same suffix is not identical grammar. Theme activation preserves identity and does not reconstruct pages merely to recolor them.

## Scroll and indicators

```xml
<StackPanel Key="LogView" Scroll="true" ShowsVerticalIndicator="true"
            StickToEnd="true" ScrollGesture="true" Height="220">
  <Text Content="First log entry" />
  <Text Content="Second log entry" />
</StackPanel>
```

Host owns retained scrolling, not manually moved child Top values. Facts require Scroll and supported stack/Dynamic layouts. Expanding command capsules have a separate horizontal-only contract requiring authored HoverExpand/Scroll; only horizontal indicator and vertical-wheel routing are admitted there.

## Text/images/loading

Content supplies text; WrapText/MaxLines/TrimOverflow are finite. Image requires Source resolved by Host, not arbitrary IO authority.

```xml
<StackPanel HorizontalAlignment="Center" VerticalAlignment="Center" Spacing="12">
  <ProgressRing Label="Loading resources" Width="40" Height="40" />
  <Text Content="Loading resources…" />
</StackPanel>
```

ProgressRing wraps Progress with Ring/Indeterminate. Host selects empty loading versus retained append behavior.

## Virtual content

Host owns logical items, realized windows, spacers, and anchors. Dynamic is a container, not automatic infinite-list virtualization. Use stable retained fragments/Reload/Reorder instead of Clear/rebuild, with shared Host metrics when virtualized.

Continue with [state and intent](./state-and-input).


## Implementation references

- [Nexa.Xsr.Renderer.Nxml.Compiler/NssStyleSheet.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NssStyleSheet.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeCompiler.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeCompiler.cs)
- [docs/xsr/nxml-renderer.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nxml-renderer.md)
