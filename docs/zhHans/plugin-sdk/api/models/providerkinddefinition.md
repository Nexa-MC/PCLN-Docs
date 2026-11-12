> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# ProviderKindDefinition

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Contract` | [`PublicContract`](../models/publiccontract.md) | Structured PublicContract value; follow its linked field contract. |
| `Selection` | [`SelectionPolicy`](../models.md#selectionpolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |

## Used directly by

- [Contracts.DefineProviderKind](../contracts.md#defineproviderkind)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/models/providerkinddefinition.md) · Apache-2.0.
