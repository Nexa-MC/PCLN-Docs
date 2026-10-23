# Theme cookbook and troubleshooting

## Accessible heading recipe

Goal: size 20–32, readable light/dark, keyboard-operable controls. Use Color/Range and finite title/focus styling; no Sidecar or page reconstruction is necessary.

Start with twilight, test size/fallback, then add:

```css
Button.capsule:focus-visible { Border: #315b92; BorderWidth: 2; }
@when mode = dark {
  Button.capsule:focus-visible { Border: #b5d2ff; }
}
```

Verify Tab, touch, palette switching, and retained input. Do not mutate enabled/visible semantics merely to make controls more prominent.

## User background and music

Use workshop File/Files/Directory options. Import with empty paths and disabled music, then grant through pickers. Verify Image authority cannot read Audio and revocation retires use.

The outcome is explicit user choice with bounded fallback and cleanup, not just successful playback on your workstation. Ship a packaged background, not private music paths, and include licenses/instructions.

## Responsive cards

Use the [grid recipe](./layout-and-motion), testing two columns before remapping explicit placement for one column. If Host keys change, document compatibility or adjust selectors rather than guessing.

Virtual catalogs require registered Item metrics, not generic row Height overrides. Preserving logical identity and anchors is part of acceptance.

## Diagnose by phase

| Symptom | Phase | Checks |
| --- | --- | --- |
| Immediate import rejection | Container/manifest | mimetype, roots, duplicates/unknown fields, JSON types/defaults |
| Missing capability | Negotiation | Exact name, actual provider, optional fallback |
| NSS rejection | Compilation | Selectors, types, IDs, protected declarations including inactive branches |
| Existing file rejected | Authority/resource | Canonical path, real package bytes, source/kind grant, links/budgets |
| Font wrapping mismatch | Native measurement | Glyphs/fallback/DPI/shared metrics |
| No effect, no error | Matching/cascade | Kind/Key/Class, later rules, protected virtual geometry |
| Directory edits ignored | Source/watch | Directory versus installed snapshot, watcher enablement |
| Slider release fails | Value/transaction | Last valid step, revision, grants; retain draft and retry |
| Only some icons change | Carrier | Native window/tray/Splash distinction, not installer metadata |
| Stale media after switching | Lifetime | Record source/generation and minimal reproduction; do not disable protection |

## Actionable report

Include launcher tag, theme version, OS/architecture, source kind, minimal manifest/styles, clean-start steps, expected/actual result, and failure phase. Remove private paths/media; use redistributable small resources.

Separate compilation, native execution, and installation evidence. Say “Linux tested” when only Linux was tested. Keep a minimal package without external paths for reproduction.


## Implementation references

- [docs/xsr/ntp-v1.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/ntp-v1.md)
- [docs/xsr/theme-live-options.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-live-options.md)
- [docs/xsr/theme-resource-security.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-resource-security.md)
