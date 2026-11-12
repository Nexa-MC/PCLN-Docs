# Migrating from the old SDK

## Repository replacement

`PCL-N-Plugin-SDK` is renamed to `NexaCL-Plugin-SDK`. Its old commits remain in Git,
but the current branch replaces the old PCL.N.Plugin.* projects, wiki, analyzers,
UI adapters and injection facade. This is a new authoring/runtime contract, not a
binary shim for historical PCL plugins. The new template is the starting point.

| Old approach | Nexa replacement |
| --- | --- |
| `PCL.N.Plugin.*` package family | `Nexa.Plugin.Bootstrap.V1` and `Nexa.Plugin.Sdk.Abi100` |
| Direct/indirect CLR injection | Isolated import-free Wasm executable profile |
| Host CLR objects and arbitrary view access | Bounded ABI values, opaque handles and public capabilities |
| In-process UI adapter | Verified NXML pages/components and Host-owned confirmation |
| Unscoped filesystem access | Explicit file grants and reviewed mutation plans |
| Implicit service access | Required/optional contract negotiation and granted permissions |

Port behavior deliberately: inventory Host interactions, select supported
capabilities, move presentation to package assets, replace direct calls with typed
operations and implement cancellation/cleanup. Rebuild and test the resulting ZIP.
Do not merely rename namespaces or reinterpret old numeric IDs as ABI 100 IDs.

## Extracting the current Nexa SDK

The alpha.9 to alpha.10 extraction preserves all existing Bootstrap signatures,
346 ABI operations, model fields and schema fingerprints. Only source ownership,
package metadata and distribution change. Existing Nexa ABI 100 callers can update
the package source and rebuild. Keep package, Bootstrap and ABI versions distinct.

The 22 earlier Nexa preview dispatch slots remain represented by the legacy
contract catalog. They are unrelated to the removed PCL.N.Plugin.* injection API.

## 简体中文

旧仓库改名并保留历史，当前分支直接替换旧 SDK。旧 PCL 插件需要移植，不能只改命名空间。
现有 Nexa ABI 100 从 alpha.9 升级到拆仓后的 alpha.10 保持契约兼容，主要变化是来源和分发。

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/migration.md) · Apache-2.0.
