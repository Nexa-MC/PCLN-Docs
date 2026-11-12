# InstallStep

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Action` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Inputs` | `AbiValue` | Typed input value encoded under the declared input schema. |
| `Effects` | [`LocalizedText[]`](../models/localizedtext.md) | Structured LocalizedText value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Reversible` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/models/installstep.md) · Apache-2.0.
