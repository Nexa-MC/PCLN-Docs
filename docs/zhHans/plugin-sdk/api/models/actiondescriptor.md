> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# ActionDescriptor

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Input` | [`SchemaRef`](../models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `Output` | [`SchemaRef`](../models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `RequiredCapabilities` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Scopes` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Idempotency` | [`IdempotencyMode`](../models.md#idempotencymode) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Cancellable` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `SupportsPreview` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Confirmation` | [`ConfirmationRequirement`](../models.md#confirmationrequirement) | Declared confirmation requirement. The Host owns the prompt and decision. |
| `Compensation` | `QualifiedId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Title` | [`LocalizedText`](../models/localizedtext.md) | Structured LocalizedText value; follow its linked field contract. |
| `Handler` | `ulong?` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

## Used directly by

- [Actions.Register](../actions.md#register)
- [Actions.Describe](../actions.md#describe)
- [Commands.Describe](../commands.md#describe)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/api/models/actiondescriptor.md) · Apache-2.0.
