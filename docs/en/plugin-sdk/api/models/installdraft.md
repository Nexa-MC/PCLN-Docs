# InstallDraft

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Instance` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `GameVersion` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Loaders` | [`LoaderVersion[]`](../models/loaderversion.md) | Structured LoaderVersion value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `OptionalFiles` | [`ResourceVersionRef[]`](../models/resourceversionref.md) | Structured ResourceVersionRef value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Revision` | `Revision` | Opaque version token issued by the owner. Do not increment it or substitute another object’s revision. |

## Used directly by

- [Minecraft.Install.ReadDraft](../minecraft-install.md#readdraft)
- [Minecraft.Install.UpdateDraft](../minecraft-install.md#updatedraft)
- [Minecraft.Install.ValidateDraft](../minecraft-install.md#validatedraft)
- [Minecraft.Install.ResolvePlan](../minecraft-install.md#resolveplan)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/installdraft.md) · Apache-2.0.
