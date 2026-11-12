# NetworkConnection

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Protocol` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Scope` | `string` | Explicit target scope. The Host checks that the caller is authorized for it. |
| `LoadInstanceId` | `Guid` | Identity of the admitted load that owns this handle; it is not portable to a replacement load. |

## Used directly by

- [Network.OpenConnection](../network.md#openconnection)
- [Network.Listen](../network.md#listen)
- [Network.Close](../network.md#close)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/networkconnection.md) · Apache-2.0.
