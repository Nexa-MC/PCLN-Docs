# ContentDependencyGraph

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Instance` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Nodes` | [`ContentItem[]`](../models/contentitem.md) | Structured ContentItem value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Edges` | [`ContentDependency[]`](../models/contentdependency.md) | Structured ContentDependency value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Revision` | `Revision` | Opaque version token issued by the owner. Do not increment it or substitute another object’s revision. |

## Used directly by

- [Minecraft.Content.ReadDependencyGraph](../minecraft-content.md#readdependencygraph)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/contentdependencygraph.md) · Apache-2.0.
