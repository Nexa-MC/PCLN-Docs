# RootRegistration

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Root` | [`RootRef`](../models/rootref.md) | Structured RootRef value; follow its linked field contract. |
| `DisplayName` | `string` | User-facing localized label; it is not an authority-bearing identity. |

## Used directly by

- [Minecraft.Instances.AddRoot](../minecraft-instances.md#addroot)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/rootregistration.md) · Apache-2.0.
