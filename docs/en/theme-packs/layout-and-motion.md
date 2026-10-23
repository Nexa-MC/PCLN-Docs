# Layout, paint, and motion reference

Improve appearance while keeping drawing, input, scrolling, and accessibility geometry consistent. NSS/1 does not own NXML structure, business facts, or lifetime.

## Property groups and bounds

| Properties | Values/meaning |
| --- | --- |
| Width/Height, min/max dimensions | Finite 0–100000, consistent bounds |
| Weight/Spacing/ColumnGap/RowGap | 0–100000; weight participates in allocation |
| Margin/Padding | One/two/four values; margin may be signed, padding nonnegative |
| HorizontalAlignment/VerticalAlignment | Finite Start/Center/End/Stretch-style enum, not browser flex values |
| Direction/Orientation | Horizontal/Vertical |
| Background/Foreground/Border/Hover | Finite colors |
| Surface | Host surface enum, not arbitrary OS material |
| Opacity/BackgroundImageOpacity | 0–1, unlike appearance percentages |
| CornerRadius/BorderWidth/BlurRadius | 0–4096 |
| FontSize/FontWeight/FontFamily | 1–512, 100–900, family or admitted font |
| TextAlignment/WrapText | Finite enum / Boolean |
| GridColumns/GridRows | Up to 64/256 auto, pixel, or positive fr tracks |
| GridColumn/GridRow | Zero-based 0–63/0–4095 |
| GridColumnSpan/GridRowSpan | 1–64/1–256, fitting actual parent tracks |
| Position | Flow/Absolute/Overlay without ownership changes |
| Left/Top/Right/Bottom | -100000–100000 |
| Order | Integer -32768–32767, visual order only |
| TranslateX/Y, Rotation | -100000–100000; rotate() separately ±36000 |
| ScaleX/Y | 0.01–100, no singular zero scale |
| Transform | At most one translate/scale/rotate each |
| Shadow/BackgroundGradient | Finite shadow/linear gradient |
| BackgroundImage/ImageSource/IconSource | Prepared resource expression |
| BackgroundImageFit | cover/contain/stretch/tile |
| ItemWidth/Height/Spacing/Columns | Registered Host virtual metrics, further restricted by owner |
| Animation | Named frames, bounded duration, finite modifiers |

Aliases normalize, including background-color→Background, color→Foreground, border-radius→CornerRadius, grid-template-columns→GridColumns, box-shadow→Shadow. This is not arbitrary CSS.

## Thickness order

```css
Button.capsule { Padding: 6 12; }
StackPanel#CardAccount { Margin: 8 16 12 16; }
```

Whitespace two-values mean vertical/horizontal; four-values mean top/right/bottom/left. Comma four-values retain left/top/right/bottom, e.g. `16,8,16,12`. Do not mix forms. Host base NSS is narrower; its examples use one or four comma values.

## Responsive two-column recipe

```css
@supports grid {
  StackPanel#LaunchHomeWorkspace { GridColumns: 1fr 1fr; ColumnGap: 24; RowGap: 16; }
  StackPanel#CardAccount { GridColumn: 0; GridRow: 0; }
  StackPanel#RightColumn { GridColumn: 1; GridRow: 0; }
  @viewport width <= 900 {
    StackPanel#LaunchHomeWorkspace { GridColumns: 1fr; GridRows: 1fr 1fr; }
    StackPanel#RightColumn { GridColumn: 0; GridRow: 1; }
  }
}
```

Move the explicit second-column placement when narrowing; an out-of-track placement rejects instead of clipping. Spans must fit. Test actual input at both widths as well as screenshots.

## Transform, shadow, gradient

```css
Text#TitleMain { Transform: translate(1,0) scale(1) rotate(0); }
StackPanel#CardAccount {
  Shadow: #10204030 0 3 10;
  BackgroundGradient: linear-gradient(45deg,#eef4ff 0%,#e2eaff 100%);
}
```

Shadow is color/X/Y/blur. Transform geometry is shared with inverse hit testing. Gradient angles use deg and stops use percentages; that does not grant percentage Width support.

## Virtual collection rules

Host owns viewport, spacers, row identity, and scroll anchors. A generic row-height override cannot bypass that geometry. Use dedicated Item metrics only on registered containers: linear catalogs have one column; screenshot waterfalls allow 1–12. The compiler's generic 64-column bound is not a product grant. Row paint and nested typography remain themeable.

## Finite breathing animation

```css
@keyframes title-breathe {
  0% { Opacity: 0.82; TranslateY: 0; }
  100% { Opacity: 1; TranslateY: 1; }
}
Text#TitleMain { Animation: title-breathe 2s infinite alternate; }
```

Only Opacity, TranslateX/Y, ScaleX/Y, Rotation, CornerRadius, and BlurRadius animate. Every property needs 0%/100% endpoints. At most 64 frames per group; duration 1–600000ms or 0.001–600s. Use supported infinite/alternate modifiers, not assumed browser easing/delay syntax.

Renderer advances clocks without reparsing each frame. Unchanged declarations retain clocks across palette switches; changed declarations create new tracks. User reduced-motion policy always wins.


## Implementation references

- [docs/xsr/nss-v1.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nss-v1.md)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeProgram.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeProgram.cs)
- [docs/xsr/ntp-v1.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/ntp-v1.md)
