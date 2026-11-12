# PageRequest

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Cursor` | `string?` | Opaque continuation or observation cursor. Reuse only in the issuing query/scope; absence and invalidity are different. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Limit` | `long` | Requested bound on returned items. The Host may impose a smaller domain-specific limit. |

## Used directly by

- [Contracts.List](../contracts.md#list)
- [Definitions.ListRegistries](../definitions.md#listregistries)
- [Commands.List](../commands.md#list)
- [Workflows.ListRuns](../workflows.md#listruns)
- [Schedules.List](../schedules.md#list)
- [UI.ListExtensionTargets](../ui.md#listextensiontargets)
- [Diagnostics.ReadOwnReports](../diagnostics.md#readownreports)
- [Minecraft.Instances.ListRoots](../minecraft-instances.md#listroots)
- [Minecraft.Install.ListGameVersions](../minecraft-install.md#listgameversions)
- [Minecraft.Install.ListRecoveries](../minecraft-install.md#listrecoveries)
- [Minecraft.Java.List](../minecraft-java.md#list)
- [Minecraft.Java.ListDistributions](../minecraft-java.md#listdistributions)
- [Minecraft.Java.ListManagedDistributions](../minecraft-java.md#listmanageddistributions)
- [Minecraft.Processes.ListSessions](../minecraft-processes.md#listsessions)
- [Catalog.ListProviders](../catalog.md#listproviders)
- [Catalog.ListFavorites](../catalog.md#listfavorites)
- [Catalog.ListCollections](../catalog.md#listcollections)
- [Accounts.List](../accounts.md#list)
- [Settings.ListProfiles](../settings.md#listprofiles)
- [Themes.List](../themes.md#list)
- [Tasks.List](../tasks.md#list)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/pagerequest.md) · Apache-2.0.
