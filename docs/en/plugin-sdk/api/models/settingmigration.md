# SettingMigration

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Target` | [`ScopedTarget`](../models/scopedtarget.md) | Structured ScopedTarget value; follow its linked field contract. |
| `FromVersion` | `ulong` | Exact stored setting version to transform. A mismatch rejects migration before committing. |
| `ToVersion` | `ulong` | Currently registered positive setting version. Migrations must move forward. |
| `Handler` | `ulong` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. |

## Used directly by

- [Settings.Migrate](../settings.md#migrate)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/settingmigration.md) · Apache-2.0.
