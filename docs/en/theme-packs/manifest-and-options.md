# Manifest reference: identity, values, versions

The manifest is an input contract. Field names are case-sensitive. Unknown/duplicate fields, mismatched JSON types, and invalid defaults reject admission; behavior fields are not silently ignored.

## Every root field

| Field | Required | Meaning/limits |
| --- | --- | --- |
| `format` | Yes | Exactly `NTP/1` |
| `id` | Yes | 1–128 ASCII characters, starts alphanumeric, then alphanumeric/`.`/`_`/`-` |
| `version` | Yes | Independent dotted theme version, e.g. `1.0.0`; optional dotted prerelease suffix, not arbitrary hyphen SemVer |
| `name` | Yes | Nonempty localized object, at most 64 keys of length 1–64 |
| `styleApi` | Yes | Integer `1` |
| `nss` | Yes | Exactly `NSS/1` |
| `styles` | Yes | 1–64 ordered relative `.nss` paths, unique ignoring case |
| `requiredCapabilities` | No | Up to 128 exact names; every required capability must exist |
| `optionalCapabilities` | No | Up to 128 `{name,fallback}` objects; no duplicates across both lists |
| `optionsVersion` | No | 1–65535, default 1; option schema, not content revision |
| `options` | No | Up to 256 unique definitions |
| `appearance` | No | Finite [appearance fields](./appearance-and-capabilities) |

Manifest budget: 64 KiB, JSON depth 16. General text is limited to 4096 characters and excludes NUL. Relative paths reject roots, traversal, links, and platform-ambiguous names. See [package budgets](./testing-and-publishing).

## Common option fields

```json
{
  "id": "title-size", "kind": "Range", "control": "Slider",
  "default": 26, "min": 20, "max": 32, "step": 1,
  "label": {"zh-CN":"标题字号", "en-US":"Title size"},
  "description": {"zh-CN":"释放滑块后应用。", "en-US":"Applies after release."},
  "group": "style"
}
```

| Field | Contract |
| --- | --- |
| `id` | Stable unique ID, same character grammar as root ID; renaming creates a new option |
| `kind` | Persisted type, independent of editor |
| `default` | Must satisfy type, bounds, step, choices, and color grammar |
| `label` | Required nonempty localized object; provide zh-CN/en-US for both languages |
| `description` | Optional localized explanation, not executable content |
| `group` | Optional group label, not a layout/editor factory |
| `visibleWhen` | Editor visibility only; [syntax](./options-recipes) |
| `control` | Automatic/Switch/CheckBox/Slider/Segmented/Input, compatible kinds only |
| `min`, `max`, `step` | Finite Number/Range validation |
| `choices` | Up to 256 unique `value` plus localized `label` pairs |
| `resourceKind` | Required for file kinds: Image/Icon/Font/Audio/Video |

## All nine kinds

| Kind | JSON default | Stored value | Use/constraint |
| --- | --- | --- | --- |
| Boolean | `true` | Boolean | Toggles; not the string `"true"` |
| Number | `26` | Finite number | Size, etc.; Slider needs explicit bounds |
| Range | `25` | Finite number | One stepped value, not an endpoint array |
| Text | `"sans-serif"` | String | Font family/declarative text, not automatically page content |
| Color | `"#68a5ff"` | Color string | `#RRGGBB`/`#RRGGBBAA`; no CSS names in an option default |
| Select | `"compact"` | Choice `value` | Never localized label/index |
| File | `""` | Single path string | Requires source-bound authorization when selected |
| Files | `[]` | String array | Up to 256 entries, not joined paths |
| Directory | `""` | Directory string | Bounded enumeration, not arbitrary recursive access |

File kinds require `resourceKind`; extensions do not infer permission. See complete valid definitions in [workshop/theme.json](https://github.com/Nexa-MC/PCLN-Docs/blob/main/examples/themes/workshop/theme.json).

## Stepping is part of validity

A number must satisfy bounds and an integral `(value - min) / step`; Number uses zero as the step origin without min. Range defaults to 0–100, but explicit limits are clearer.

Range/numeric Slider require increasing bounds, positive step within the span, absolute bounds at most `1e12`, and at most `1e9` increments. Do not use inferred defaults instead of designing a range.

For min 0, max 10, step 3, valid values are 0/3/6/9. Right edge, End, and increment stop at 9. A default of 10 rejects admission rather than being silently snapped and persisted.

## Source identity and schema versions

`version` identifies a content release; `optionsVersion` identifies option schema. A color fix need not bump the schema. Type, choice-value, and step changes require thinking about previously saved values and testing the new source.

Options are keyed by source identity and schema. Another package with the same theme ID inherits no external grants. Export/import carries values, not read authority. Missing grants stay missing; NTP does not execute migration scripts.

## Rejection examples

| Input | Problem | Correction |
| --- | --- | --- |
| Boolean default `"false"` | Wrong JSON type | `false` |
| Default 10 with min 0/step 3 | Off step | 9 or a genuinely different step |
| File without resourceKind | Unknown resource authority | Declare Image/Font/etc. |
| Select default is translated label | Not a choice value | Persist stable value |
| `appearance.script` | Unknown behavior field | Keep themes declarative; use an admitted extension |


## Implementation references

- [Nexa.Services.Themes/ThemeManifestReader.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Services.Themes/ThemeManifestReader.cs)
- [Nexa.Services.Themes.Contracts/ThemeContracts.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Services.Themes.Contracts/ThemeContracts.cs)
- [docs/xsr/theme-live-options.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-live-options.md)
