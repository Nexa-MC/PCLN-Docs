> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# OperationRecord

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `State` | [`OperationState`](../models.md#operationstate) | Current state from the enum or model below; do not infer successful completion from admission alone. |
| `Progress` | `double` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Stage` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ResultSchema` | [`SchemaRef`](../models/schemaref.md) | Schema for the operation result; inspect operation state before interpreting Result. |
| `Result` | `AbiValue` | Typed operation output. It is meaningful only when the operation state and result schema permit reading it. |
| `Failure` | [`OperationFailure?`](../models/operationfailure.md) | Structured terminal failure, when present. Preserve its identity rather than reporting an empty successful result. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Revision` | `Revision` | Opaque version token issued by the owner. Do not increment it or substitute another object’s revision. |

## Used directly by

- [Workflows.Read](../workflows.md#read)
- [Tasks.Read](../tasks.md#read)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/api/models/operationrecord.md) · Apache-2.0.
