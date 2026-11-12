# LaunchPlan

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Plan` | [`MutationPlan`](../models/mutationplan.md) | Structured MutationPlan value; follow its linked field contract. |
| `Instance` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Profile` | [`LaunchProfile`](../models/launchprofile.md) | Structured LaunchProfile value; follow its linked field contract. |
| `ProviderVersions` | [`NamedValue[]`](../models/namedvalue.md) | Structured NamedValue value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Suppressed` | [`ValidationIssue[]`](../models/validationissue.md) | Structured ValidationIssue value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |

## Used directly by

- [Minecraft.Launch.Prepare](../minecraft-launch.md#prepare)
- [Minecraft.Launch.ReadPlan](../minecraft-launch.md#readplan)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/launchplan.md) · Apache-2.0.
