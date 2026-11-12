# FileStat

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `File` | [`FileRef`](../models/fileref.md) | Structured FileRef value; follow its linked field contract. |
| `Name` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `IsDirectory` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Size` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ModifiedAt` | `DateTimeOffset` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Revision` | `Revision` | Opaque version token issued by the owner. Do not increment it or substitute another object’s revision. |

## Used directly by

- [Files.Stat](../files.md#stat)
- [Files.WriteAtomic](../files.md#writeatomic)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/models/filestat.md) · Apache-2.0.
