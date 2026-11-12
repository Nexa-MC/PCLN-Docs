# StorageMigration

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Namespace` | [`StorageNamespace`](../models/storagenamespace.md) | Private storage namespace identity or handle. It remains subject to current-load ownership. |
| `FromVersion` | `ulong` | Exact stored setting version to transform. A mismatch rejects migration before committing. |
| `ToVersion` | `ulong` | Currently registered positive setting version. Migrations must move forward. |
| `Action` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |

## Used directly by

- [Storage.Migrate](../storage.md#migrate)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/storagemigration.md) · Apache-2.0.
