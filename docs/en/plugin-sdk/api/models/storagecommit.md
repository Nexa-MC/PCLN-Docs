# StorageCommit

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Transaction` | [`StorageTransaction`](../models/storagetransaction.md) | Structured StorageTransaction value; follow its linked field contract. |
| `Writes` | [`StorageWrite[]`](../models/storagewrite.md) | Structured StorageWrite value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |

## Used directly by

- [Storage.Commit](../storage.md#commit)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/storagecommit.md) · Apache-2.0.
