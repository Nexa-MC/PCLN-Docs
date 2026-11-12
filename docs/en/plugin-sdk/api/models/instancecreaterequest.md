# InstanceCreateRequest

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Template` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Name` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Root` | [`RootRef`](../models/rootref.md) | Structured RootRef value; follow its linked field contract. |
| `GameVersion` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Loader` | `QualifiedId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

## Used directly by

- [Minecraft.Instances.PrepareCreate](../minecraft-instances.md#preparecreate)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/instancecreaterequest.md) · Apache-2.0.
