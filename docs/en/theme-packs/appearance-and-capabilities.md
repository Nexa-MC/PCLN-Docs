# Host appearance and platform capabilities

NSS styles nodes; appearance declares finite Host resources/policy. Neither controls window lifetime, account/update trust, password semantics, or system authority.

## Root fields

| Field | Accepted value | Purpose |
| --- | --- | --- |
| accentColor | Literal `#RRGGBB`/`#RRGGBBAA` | Host accent, not an automatic same-name option binding |
| windowMaterial | none/solid/blur/acrylic/mica | Finite request, capability-dependent outcome |
| splashMotion | none/fade/breathe/draw | Bounded startup-mark motion |
| resources | Fixed slots below | Prepared icons/background/font/media |
| properties | Finite table below | Literal or known scalar `option(id)` |

draw is about 600ms; breathe varies opacity 0.88–1 over 1.8s. The first Splash uses built-in/bounded verified startup facts, without waiting for third-party ZIP/NSS/font/media scanning. Host owns topmost, startup stages, and lifetime.

## Every resource slot

| Slot | Kind | Consumer |
| --- | --- | --- |
| launcherIcon/windowIcon/trayIcon/splashIcon | Icon or Image | Runtime carriers, not installer metadata |
| logo/icon-light/icon-dark | Icon or Image | Finite brand/mode projection |
| background | Image | Background |
| font | Font | Prepared font |
| music | Audio | Music consumer |
| video | Video | Video consumer |

Entries are `{expression,kind,required,fallback}`. Optional entries require fallback; none means safe empty/default. Required primary resources must prepare successfully.

```json
{"windowIcon":{"expression":"asset(assets/icon.svg)","kind":"Icon",
 "required":false,"fallback":"none"}}
```

Place this under appearance.resources and package the real file. Test each native carrier; successful browser SVG display does not prove tray/window/Splash decoding.

## Every property

| Property | Value/unit |
| --- | --- |
| background-fit/video.fit | cover/contain/stretch |
| background-opacity | Number/Range, 0–100 |
| background-color | Color/Text/Select, auto or valid hex |
| window-opacity | Number/Range, 40–100 |
| window-blur | Boolean |
| video.enabled/video.auto-pause | Boolean |
| music.enabled/music.startup/music.autoplay/music.shuffle | Boolean |
| music.media-controls/music.auto-pause | Boolean |
| music.volume | Number/Range, 0–100 |
| animation-fps | Number/Range, 1–240 |
| resize-policy | auto/immediate/deferred/animated/instant |

```json
{"background-opacity":"option(opacity)","music.enabled":"option(music.enabled)",
 "music.volume":"option(music.volume)","resize-policy":"animated"}
```

These belong under appearance.properties. Options must exist and match scalar types. window-opacity 40 means percent, unlike NSS Opacity 0.4. File options, arbitrary expressions, and new window methods are excluded.

Resize auto/immediate/instant applies directly; deferred waits about 120ms quiet; animated uses one shared layout/paint/input viewport over about 180ms. Reduced motion applies directly.

## Exact capability registry

| Capabilities | Purpose |
| --- | --- |
| styles.basic, tokens, options, selectors | Basic presentation and parameters |
| conditions, viewport | Mode/platform/dimension conditions |
| grid, position, order | Finite layout |
| transform, transforms | Transform with consistent input geometry |
| virtual-metrics | Registered shared collection metrics |
| keyframes, animations | Finite motion |
| images, svg, fonts | Prepared providers |
| opacity, gradients, shadows, translucency | Paint/opacity, not a native-blur guarantee |
| runtime-icons, startup-appearance | Icons and bounded startup facts |
| media | Resource/consumer contract, not an output-device guarantee |
| window-acrylic | Actual native provider where supported |
| window-mica | Supported Windows 11 material |

Prefer canonical plural provider names. Require essentials; make enhancements optional, e.g. `{"name":"window-acrylic","fallback":"solid"}`. A declaration or successful compilation is not cross-platform execution evidence.

## Cross-platform acceptance

Make solid appearance readable first. Test light/dark, transparency disabled, reduced motion, DPI, narrow layout, tray restore, and safe mode. Record requested/actual capability, effective fallback, OS, and build; report unsupported enhancement honestly.


## Implementation references

- [Nexa.Services.Themes/ThemeManifestReader.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Services.Themes/ThemeManifestReader.cs)
- [docs/xsr/theme-capabilities.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-capabilities.md)
- [docs/xsr/theme-package-architecture.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-package-architecture.md)
