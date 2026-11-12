# ContentChangeRequest

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Instance` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Items` | `EntityId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Versions` | [`ResourceVersionRef[]`](../models/resourceversionref.md) | Structured ResourceVersionRef value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

## Used directly by

- [Minecraft.Content.PlanInstall](../minecraft-content.md#planinstall)
- [Minecraft.Content.PlanEnable](../minecraft-content.md#planenable)
- [Minecraft.Content.PlanDisable](../minecraft-content.md#plandisable)
- [Minecraft.Content.PlanRemove](../minecraft-content.md#planremove)
- [Minecraft.Content.PlanUpdate](../minecraft-content.md#planupdate)
- [Minecraft.Content.RestoreTrash](../minecraft-content.md#restoretrash)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/contentchangerequest.md) · Apache-2.0.
