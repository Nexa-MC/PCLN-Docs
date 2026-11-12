> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# UIModelUpdate

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `View` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Schema` | [`SchemaRef`](../models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Value` | `AbiValue` | Payload interpreted using the accompanying or declared schema; Null is not a substitute for an error. |
| `ExpectedRevision` | `Revision?` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

## Used directly by

- [UI.PublishModel](../ui.md#publishmodel)
- [UI.UpdateModel](../ui.md#updatemodel)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/api/models/uimodelupdate.md) · Apache-2.0.
