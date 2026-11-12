# ServerStatus

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Server` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Reachable` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Description` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `PlayersOnline` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `PlayersMaximum` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Protocol` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

## Used directly by

- [Minecraft.Servers.ReadStatus](../minecraft-servers.md#readstatus)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/serverstatus.md) · Apache-2.0.
