# StorageMigration

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Namespace` | [`StorageNamespace`](../models/storagenamespace.md) | Private storage namespace identity or handle. It remains subject to current-load ownership. |
| `FromVersion` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ToVersion` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Action` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |

## Used directly by

- [Storage.Migrate](../storage.md#migrate)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/storagemigration.md) · Apache-2.0.
