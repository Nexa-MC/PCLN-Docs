# LaunchIntent

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Instance` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Grant` | [`LaunchGrant`](../models/launchgrant.md) | Structured LaunchGrant value; follow its linked field contract. |
| `Profile` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Target` | [`LaunchTarget?`](../models/launchtarget.md) | Structured LaunchTarget value; follow its linked field contract. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

## Used directly by

- [Minecraft.Launch.Prepare](../minecraft-launch.md#prepare)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/launchintent.md) · Apache-2.0.
