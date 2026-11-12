> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# DrawCommand

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Kind` | [`DrawCommandKind`](../models.md#drawcommandkind) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Coordinates` | `double[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Color` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Text` | `string?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Image` | [`BlobRef?`](../models/blobref.md) | Structured BlobRef value; follow its linked field contract. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/models/drawcommand.md) · Apache-2.0.
