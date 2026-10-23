# Option controls and live application

The goal is user-adjustable presentation, not executable editor code. Host owns keyboard/touch/accessibility, drafts, picker authority, and persistence; themes declare types, compatible controls, and consumers.

## Complete workshop

The [workshop theme](https://github.com/Nexa-MC/PCLN-Docs/tree/main/examples/themes/workshop) has 12 options covering all nine kinds. Font family changes the heading, density changes capsule padding, `background-path` uses the current external-background adapter, and audio file/directory options enter the media preparation chain. Music is disabled by default.

```sh
python NexaCL/eng/themes/pack.py PCLN-Docs/examples/themes/workshop --output workshop-1.0.0.ntp
```

## Compatibility matrix

| Control | Accepted kinds | Purpose |
| --- | --- | --- |
| Automatic/omitted | All nine | Boolean switch, Range slider, Select segments, otherwise kind-specific editor |
| Switch | Boolean | Immediate appearance toggle |
| CheckBox | Boolean | Checkbox choice |
| Slider | Range, explicitly bounded Number, Select with at least two choices | Stepped numeric/discrete value |
| Segmented | Boolean/Select | Mutually exclusive choices; long labels scroll internally |
| Input | Number/Range/Text/Color | Precise editing |

Incompatible hints reject admission. A File cannot use Input to bypass pickers. `control` never changes stored `kind`.

## Recipe 1: rounding switch

Add to `options`:

```json
{"id":"rounded","kind":"Boolean","control":"Switch","default":true,
 "label":{"zh-CN":"圆角按钮","en-US":"Rounded buttons"}}
```

Consume it in NSS:

```css
@when option(rounded) = true {
  Button.capsule { CornerRadius: 18; }
}
```

Only CornerRadius changes. Commands, enabled/visible state, and business behavior stay Host-owned. Without an active override, the button uses its base presentation; it is not removed.

## Recipe 2: discrete slider with stable values

```json
{"id":"density","kind":"Select","control":"Slider","default":"comfortable",
 "label":{"zh-CN":"密度","en-US":"Density"},
 "choices":[
   {"value":"compact","label":{"zh-CN":"紧凑","en-US":"Compact"}},
   {"value":"comfortable","label":{"zh-CN":"舒适","en-US":"Comfortable"}}
 ]}
```

Positions map to compact/comfortable strings, not persisted indices. Labels are localized. Reordering changes visual positions; changing values changes the saved-data contract.

## Recipe 3: conditional media settings

```json
{"id":"music.volume","kind":"Range","default":20,
 "min":0,"max":100,"step":1,"control":"Slider",
 "label":{"zh-CN":"音量","en-US":"Volume"},
 "visibleWhen":"option(music.enabled) && option(music.volume) != 0"}
```

This demonstrates legal self-reference, but hiding volume at zero makes recovery awkward. The complete workshop applies this condition to autoplay, while volume uses only `option(music.enabled)`. Valid grammar does not automatically produce good interaction.

visibleWhen supports Boolean literals, `option(id)`, `!`, `&&`, `||`, parentheses, and `==`/`!=`. Equality accepts quoted strings/finite numbers. Files cannot be condition values. No inequality ordering, general calls, or scripts. Limits: 4096 characters, depth 16, 512 bounded operations.

```text
option(music.enabled)
!option(rounded)
option(density) == "compact" && option(music.enabled)
```

**NSS uses a different grammar:** `@when`, `and`, `=`, etc. Do not put NSS `and` in visibleWhen or assume arbitrary operators work everywhere.

## Recipe 4: paths and grants

```json
{"id":"background-path","kind":"File","resourceKind":"Image","default":"",
 "label":{"zh-CN":"外部背景","en-US":"External background"}}
```

File obtains one path and a source-bound grant through a Host picker. Files stores an array; Directory declares a typed enumeration root. Editing exported JSON cannot grant read access. Path validity, authority, budgets, and decoding are independent checks.

`background-path` is a finite current Desktop convention for Image options, not a rule mapping every arbitrary name to a window property. Follow the [resource-slot reference](./appearance-and-capabilities).

## Complete live-save flow

```text
Draft → completeness/type validation → quiet-period coalescing
      → candidate/NSS/resource preparation → same-generation application → durable commit
```

Complete values apply automatically. Sliders retain gesture ownership until release. Partial numbers/colors retain drafts and prior appearance while other complete values can apply. Further typing during a save is not overwritten by an earlier snapshot; caret, selection, and IME survive.

Failures retain drafts and retry on another edit or explicit Save, not every frame. Navigation cancels pending work; stale source completions cannot apply to a replacement theme. Explicit directory watching is separate from option auto-save.

## Acceptance checks

Use mouse, keyboard, and touch. Test long labels, zero volume, final legal numeric step, partial color, edits during save, grant revocation, preview exit, and restart. Verify resulting values and presentation, not just editor construction.


## Implementation references

- [Nexa.Services.Themes.Contracts/ThemeOptionCondition.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Services.Themes.Contracts/ThemeOptionCondition.cs)
- [docs/xsr/theme-live-options.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-live-options.md)
- [Nexa.Desktop/Ui/DesktopThemeSession.Resources.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Desktop/Ui/DesktopThemeSession.Resources.cs)
