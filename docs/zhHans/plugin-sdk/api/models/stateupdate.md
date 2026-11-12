> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# StateUpdate

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Scope` | [`ScopedTarget`](../models/scopedtarget.md) | Explicit target scope. The Host checks that the caller is authorized for it. |
| `Value` | `AbiValue` | Payload interpreted using the accompanying or declared schema; Null is not a substitute for an error. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

## Used directly by

- [State.UpdateOwned](../state.md#updateowned)
- [State.CompareExchangeOwned](../state.md#compareexchangeowned)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/api/models/stateupdate.md) · Apache-2.0.
