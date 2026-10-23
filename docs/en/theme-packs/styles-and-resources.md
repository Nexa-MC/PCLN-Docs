# Resources: assets, authority, lifetime

Every reference needs type, location, authority, lifetime, and failure behavior. A file existing on disk does not make it an admitted current-theme resource.

## Complete packaged-asset flow

```text
theme/
├── mimetype
├── theme.json
├── styles/main.nss
└── assets/background.svg
```

Add under `appearance.resources`:

```json
{"background":{"expression":"asset(assets/background.svg)","kind":"Image",
 "required":false,"fallback":"none"}}
```

asset resolves inside the admitted source: no traversal, roots, links, or URLs. Include actual bytes. No automatic workstation-resource discovery occurs.

An NSS `BackgroundImage: asset("assets/background.svg")` reference is independently required. An optional appearance slot falling back to none does not make an independent NSS reference optional.

## External authority

Host pickers create grants bound to source identity, canonical path, resource kind, and file/directory scope. file/folder expressions request access; they do not grant it.

Use File/Files/Directory options and Host projection. A selected File option can become an NSS resource value after Host canonicalization. Do not reinterpret Text as a path program or splice paths from another source.

folder requires the bounded-list route, not the single-resource route. Enumeration handles supported top-level files; it is not arbitrary recursion and cannot follow links out of its grant.

## Fonts and measurement

```css
Text#TitleMain { FontFamily: asset("fonts/Author.ttf"); FontSize: 26; }
```

Include licensed TTF/OTF bytes and declare fonts. Measurement, shaping, and drawing share the prepared font identity. Missing glyphs use system fallback, which can differ by OS. WOFF/TTC and theme-provided native font libraries are excluded.

Publish the license and test real Chinese/English/emoji text, DPI, wrapping, clipping, caret, and hit positions. Successful loading alone is insufficient.

## Images, SVG, media

Raster formats include PNG/JPEG/WebP/BMP/ICO/static GIF; animated GIF rejects. SVG supports finite geometry, fill/stroke, gradients, and group transforms. Scripts, URLs, image/use references, rendered text, CSS, filters, foreignObject, and nested viewports are excluded.

Tile fit reuses a prepared vector brush instead of building one tree per tile. Tiny viewBoxes and composed transforms remain bounded.

Audio/video use stable Host-owned leases and existing consumers. media capability does not promise an output device or arbitrary decoder. Required media undergoes bounded real decode preflight even when playback is disabled; output/playback availability is separate.

## Resource budgets

| Resource | Bound |
| --- | --- |
| Image/Icon/Font | 16 MiB each |
| Native SVG | 1 MiB, 4096 elements, at most 24 ancestors |
| SVG numbers/composed coefficients | Finite, absolute value ≤1,000,000 |
| SVG viewBox dimensions | 0.000001–8192 |
| SVG transform | 2048 characters, 32 operations |
| Prepared native resources | 256/64 MiB total; at most 32 fonts |
| Audio/Video | 128 MiB each |
| Directory playlist | 128 admitted top-level files, 256 MiB, 4096 enumerated entries |
| Per activation leases | 256/512 MiB |
| Active/candidate combined leases | 512/1 GiB |

Individual and aggregate limits both apply; actual expanded/read bytes are counted.

## Fallback and retirement

Required failures prevent commit. Optional primary failures retire their leases before preparing fallback; failed fallback preserves the last valid theme. none means safe empty/default, not an old theme's resource.

A→B→A still uses distinct monotonic generations. Stale completions cannot reattach old media/icons. Retired resources survive only existing scene borrows. Grant revocation, removal, and preview teardown retire owned resources/watchers.

Imported options on another machine require new picker grants. Renaming IDs or copying same-named packages never transfers authority.


## Implementation references

- [docs/xsr/theme-resource-security.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-resource-security.md)
- [Nexa.Services.Themes/ThemePackageService.Resources.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Services.Themes/ThemePackageService.Resources.cs)
- [Nexa.Desktop/Ui/DesktopThemeSession.Resources.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Desktop/Ui/DesktopThemeSession.Resources.cs)
