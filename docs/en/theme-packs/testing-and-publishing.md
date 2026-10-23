# Testing and publishing

Test archive import, preview, activation, restart, reset and uninstall. Exercise all editors, invalid drafts, drag/keyboard interaction, failed-save retry, light/dark mode, small windows, reduced motion and missing optional materials. Cancel/revoke external resource selections and reimport the package to check source-bound grants.

| Budget | Limit |
|---|---|
| Manifest | 64 KiB, depth 16 |
| Archive entries / options / NSS files | 4096 / 256 / 64 |
| Total NSS | 1 MiB |
| Compressed archive / individual entry | 128 MiB |
| Actual expanded content | 512 MiB |

Traversal, absolute paths, links, duplicates and ambiguous cross-platform names are rejected. Resources have additional type/decoder limits.

```sh
# In the NexaCL source checkout; output must be outside the input theme.
python eng/themes/pack.py ../PCLN-Docs/examples/themes/twilight --output ../twilight.ntp
# Development executable with its shipped resources, using an isolated NEXA_DATA_DIR:
Nexa.Desktop --validate-themes
```

Import failures usually involve root layout, mimetype, strict JSON or budgets. Option failures involve kind/default/control/choice/step mismatches. Missing visuals require checking selectors, style order, capabilities and resource grants.

Publish the `.ntp` with its version, supported host versions/platforms, required capabilities, license and resource attribution. NTP/1 appearance packages do not use the launcher's update signing key. Packaging is not runtime admission and never grants executable authority.
