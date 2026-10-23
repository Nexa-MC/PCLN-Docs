# Development, validation, recovery, publication

Deliver a verified appearance outcome, not just a compressible folder. Use the [goal-first workflow](/en/development/goal-first) to bound changes and evidence; do not rebuild unrelated systems for a theme.

## Directory versus package

Explicit directory watching revalidates manifest, NSS, and resources with about 300ms debounce, including replacement/rename saves. Bad candidates preserve the prior theme. Watchers retire with the source/session.

Imported `.ntp` content is its own admitted snapshot; source edits require repack/reimport. Preview is temporary and restores the committed selection on exit.

## Reproducible packaging

```sh
python NexaCL/eng/themes/pack.py PCLN-Docs/examples/themes/workshop --output workshop-1.0.0.ntp
python NexaCL/eng/themes/pack.py PCLN-Docs/examples/themes/workshop --output workshop-again.ntp
```

The packager writes uncompressed mimetype first, fixed timestamps, and sorted entries. Compare hashes with sha256sum/Get-FileHash. Keep output outside input.

| Input | Budget |
| --- | --- |
| Manifest | 64 KiB/depth 16 |
| Entries | 4096 |
| Compressed package or entry | 128 MiB |
| Actual expansion | 512 MiB |
| Styles | 64 files/1 MiB |
| Options/installed sources | 256/256 |

Reject roots, traversal, links, duplicate/case-colliding paths, device names, trailing dots/spaces, backslashes, drive/stream separators. Executables and replacement NXML pages are not theme content.

## Portable behavior lab

```sh
dotnet run --project PCLN-Docs/examples/authoring-lab/Authoring.Lab.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- /absolute/path/to/PCLN-Docs
```

This exercises real source/manifest admission, light/dark NSS compilation, retained projection, and rejected invalid cases. It does not open a native window or prove material/media/tray support.

For launcher coordination, run the corresponding build's `Nexa.Desktop --validate-themes` with isolated data. The source test program's `--native-theme-preview light|dark OUTPUT` checks native resources on the OS where it is built/executed.

## Acceptance matrix

| Scenario | Expected |
| --- | --- |
| Activate | Manifest/capabilities/resources/style accepted; durable selection agrees |
| Invalid input/resource | Explicit failure, last valid theme preserved |
| Modes/widths/DPI | Readable, no overflow, matching hit/caret/clip geometry |
| Switch during interaction | Focus, drafts, anchors retained |
| Rapid A→B→A | No stale resource attachment |
| Partial editor value | Draft retained, no invalid durable value |
| Revoked/imported grant | No unauthorized or cross-source reads |
| Reduced motion/safe mode | Host protection wins; recovery remains reachable |
| Restart/interruption | Only committed/last-known-good appearance |

## Distribution

Publish the `.ntp`, theme version, launcher/style API compatibility, required/optional capabilities, resource licenses, tested platforms, and reproduction steps. External resources require selection; do not ship private absolute paths or assume workstation fonts.

Unsigned theme support does not bypass executable/update signatures. NTP, `.nsc`, and launcher updates are separate admission formats.

## Recovery

Restore the previous theme or independent Host recovery entry. Safe mode bypasses third-party styles/media/watchers. Collect version, effective capability, failure phase, and a minimal reproduction rather than disabling protection or deleting all launcher data.


## Implementation references

- [eng/themes/pack.py](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/eng/themes/pack.py)
- [docs/xsr/theme-package-architecture.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-package-architecture.md)
- [docs/xsr/theme-resource-security.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-resource-security.md)
