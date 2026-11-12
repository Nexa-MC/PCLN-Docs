> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# StorageWrite

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Namespace` | [`StorageNamespace`](../models/storagenamespace.md) | Private storage namespace identity or handle. It remains subject to current-load ownership. |
| `Key` | `string` | Key within this model’s owning namespace or record. It does not grant access outside that owner. |
| `Value` | `AbiValue` | Payload interpreted using the accompanying or declared schema; Null is not a substitute for an error. |
| `Schema` | [`SchemaRef`](../models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `ExpectedRevision` | `Revision?` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

## Used directly by

- [Storage.Write](../storage.md#write)
- [Storage.CompareExchange](../storage.md#compareexchange)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/models/storagewrite.md) · Apache-2.0.
