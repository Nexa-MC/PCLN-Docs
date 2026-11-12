> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# ContentPlan

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Plan` | [`MutationPlan`](../models/mutationplan.md) | Structured MutationPlan value; follow its linked field contract. |
| `Changes` | [`ContentItem[]`](../models/contentitem.md) | Structured ContentItem value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Issues` | [`ValidationIssue[]`](../models/validationissue.md) | Structured ValidationIssue value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |

## Used directly by

- [Minecraft.Content.PlanInstall](../minecraft-content.md#planinstall)
- [Minecraft.Content.PlanEnable](../minecraft-content.md#planenable)
- [Minecraft.Content.PlanDisable](../minecraft-content.md#plandisable)
- [Minecraft.Content.PlanRemove](../minecraft-content.md#planremove)
- [Minecraft.Content.PlanUpdate](../minecraft-content.md#planupdate)
- [Minecraft.Content.Preview](../minecraft-content.md#preview)
- [Catalog.PlanInstall](../catalog.md#planinstall)
- [Catalog.PlanUpdate](../catalog.md#planupdate)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/api/models/contentplan.md) · Apache-2.0.
