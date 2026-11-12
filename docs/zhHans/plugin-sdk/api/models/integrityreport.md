> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# IntegrityReport

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Target` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Valid` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Issues` | [`ValidationIssue[]`](../models/validationissue.md) | Structured ValidationIssue value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Revision` | `Revision` | Opaque version token issued by the owner. Do not increment it or substitute another object’s revision. |

## Used directly by

- [Minecraft.Content.ReadIntegrity](../minecraft-content.md#readintegrity)
- [Minecraft.Worlds.ReadHealth](../minecraft-worlds.md#readhealth)
- [Backups.VerifyOffline](../backups.md#verifyoffline)
- [Downloads.Verify](../downloads.md#verify)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/models/integrityreport.md) · Apache-2.0.
