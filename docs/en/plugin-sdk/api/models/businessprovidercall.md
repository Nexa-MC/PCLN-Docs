# BusinessProviderCall

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Provider` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Kind` | `QualifiedId` | Provider family whose method is being dispatched. |
| `Method` | `string` | Exact method name from the supported provider family, such as Search. |
| `InputSchema` | [`SchemaRef`](../models/schemaref.md) | Schema that the producer must use for the operation’s input value. |
| `OutputSchema` | [`SchemaRef`](../models/schemaref.md) | Schema the consumer uses to validate the successful output value. |
| `Inputs` | `AbiValue` | Typed input value encoded under the declared input schema. |

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/models/businessprovidercall.md) · Apache-2.0.
