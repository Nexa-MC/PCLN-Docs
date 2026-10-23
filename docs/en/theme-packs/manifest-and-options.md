# Manifest and controls

The strict manifest rejects unknown/duplicate fields and incompatible types. Required identity fields are `format: "NTP/1"`, `styleApi: 1`, `nss: "NSS/1"`, a stable id, a dotted theme version and a localized name. It also declares ordered styles, required/optional capabilities, optionsVersion, options and finite appearance fields. Use the complete checked example as a starting point.

| kind | Default type | Typical editor |
|---|---|---|
| Boolean | JSON boolean | Switch, CheckBox, Segmented |
| Number | number | Input; Slider with explicit valid bounds |
| Range | number, min/max/step | Slider or Input |
| Text / Color | string | text/color editor |
| Select | choice value string | Segmented; Slider with at least two choices |
| File / Directory | string | host picker |
| Files | string array | host multiple-file picker |

File-related options declare resourceKind Image, Icon, Font, Audio or Video. Labels, descriptions and choice labels may be localized; group organizes editors. visibleWhen uses the finite contract rather than executable expressions.

```json
{
  "id": "title-size", "kind": "Range", "control": "Slider",
  "default": 26, "min": 20, "max": 32, "step": 1,
  "label": {"zh-CN": "标题字号", "en-US": "Title size"}
}
```

Control defaults to Automatic. Switch/CheckBox require Boolean; Segmented accepts Boolean/Select; Input accepts Number/Range/Text/Color. A Select slider persists the choice value, never its index. Numeric sliders require finite increasing bounds and a positive valid step, bounds within ±1e12 and at most 1e9 increments. Range 0–10 with step 3 ends at 9.

Complete edits coalesce and apply after a quiet period. Slider drags retain pointer ownership until release. Incomplete numeric/color drafts keep the last valid appearance. Explicit save retries failed application. Values belong to source identity and optionsVersion; importing values does not import file-read grants.

[Live application contract](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-live-options.md).
