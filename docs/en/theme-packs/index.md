# NTP/1 theme development

The goal is adjustable, recoverable appearance across light/dark modes without changing launcher behavior. NTP/1 combines a manifest, NSS/1, resources, and options in a `.ntp` ZIP or explicitly imported development directory.

## Select capabilities by outcome

| Outcome | Contract | Acceptance |
| --- | --- | --- |
| Adjustable heading color/size | Color/Range options and NSS token/option | Immediate application and persistence |
| Narrow-window layout | Viewport, grid, finite layout | No overflow; correct hit testing at both widths |
| Runtime/tray/Splash branding | Appearance resource slots | Mode/restore/startup behavior with fallback |
| User-selected background/music | File/Files/Directory and Host grants | No unauthorized reads or authority transfer |
| New commands/pages | Outside themes | Use an admitted Sidecar/Host extension |

Read the [goal and architecture guide](/en/development/). Themes contain no scripts; style/resource expressions cannot execute commands.

## Learning route

1. [First theme](./quick-start): complete files, packaging, import, three observable options.
2. [Manifest and values](./manifest-and-options): every field, nine types, defaults, versions.
3. [Control recipes](./options-recipes): switches, sliders, segmented choices, pickers, visibility, live application.
4. [NSS/1 language](./nss-language): selectors, cascade, tokens, conditions, responsive rules, rejection.
5. [Layout and motion](./layout-and-motion): property reference, grids, transforms, virtual metrics, keyframes.
6. [Resources](./styles-and-resources): assets, external grants, fonts, images, media.
7. [Appearance/capabilities](./appearance-and-capabilities): every appearance field, platforms, startup.
8. [Testing/publication](./testing-and-publishing): directory workflow, reproducible package, rollback, evidence.
9. [Cookbook/troubleshooting](./cookbook-and-troubleshooting): turn appearance goals into testable changes.

## Two continuing examples

`examples/themes/twilight` has no external resource dependency. `examples/themes/workshop` demonstrates all nine option kinds, major controls, conditional visibility, a packaged background, and authorized media selection. Media starts disabled; selecting a path is not automatic authority or playback.

Both use real `ThemePackageService` admission and the NSS compiler. Native image/font/audio output requires target-platform evidence; the portable lab does not claim native-window validation.

## Compatibility

This guide targets A12 style API 1. Theme versions are independent of `2.0.0.alpha.12`. Capability names are more stable than individual Host keys, but selectors still need validation against the target launcher. Missing required capabilities reject activation; optional capabilities require fallback.


## Implementation references

- [docs/xsr/ntp-v1.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/ntp-v1.md)
- [docs/xsr/theme-package-architecture.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-package-architecture.md)
