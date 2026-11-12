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

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/models/contentplan.md) · Apache-2.0.
