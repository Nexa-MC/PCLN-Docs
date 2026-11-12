# InstanceDetails

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Summary` | [`InstanceSummary`](../models/instancesummary.md) | User-facing description of the proposed or observed result; it does not replace the bound target identity. |
| `Directory` | [`FileRef`](../models/fileref.md) | Structured FileRef value; follow its linked field contract. |
| `Running` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Tags` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |

## Used directly by

- [Minecraft.Instances.Read](../minecraft-instances.md#read)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/instancedetails.md) · Apache-2.0.
