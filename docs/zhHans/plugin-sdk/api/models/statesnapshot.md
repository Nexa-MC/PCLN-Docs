> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# StateSnapshot

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Value` | `AbiValue` | Payload interpreted using the accompanying or declared schema; Null is not a substitute for an error. |
| `Schema` | [`SchemaRef`](../models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Revision` | `Revision` | Opaque version token issued by the owner. Do not increment it or substitute another object’s revision. |
| `ObservedAt` | `DateTimeOffset` | Observation timestamp supplied with the snapshot; it does not make a cached value current. |
| `Cursor` | `string?` | Opaque continuation or observation cursor. Reuse only in the issuing query/scope; absence and invalidity are different. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

## Used directly by

- [State.Read](../state.md#read)
- [State.UpdateOwned](../state.md#updateowned)
- [State.CompareExchangeOwned](../state.md#compareexchangeowned)
- [UI.PublishModel](../ui.md#publishmodel)
- [UI.UpdateModel](../ui.md#updatemodel)
- [Settings.Get](../settings.md#get)
- [Settings.Reset](../settings.md#reset)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/zh-CN/api/models/statesnapshot.md) · Apache-2.0.
