# WorldMetadata

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `World` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Format` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Fields` | [`NamedValue[]`](../models/namedvalue.md) | Structured NamedValue value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |

## Used directly by

- [Minecraft.Worlds.ReadMetadata](../minecraft-worlds.md#readmetadata)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/models/worldmetadata.md) · Apache-2.0.
