# ExtensionPointDefinition

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Input` | [`SchemaRef`](../models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `Output` | [`SchemaRef`](../models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `Mode` | [`ExtensionMode`](../models.md#extensionmode) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `DeadlineMilliseconds` | `long` | Requested deadline in milliseconds; queue time consumes this budget and caller deadlines can shorten it. |
| `MergePolicy` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Ordering` | [`OrderingPolicy`](../models.md#orderingpolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Reentry` | [`ReentryPolicy`](../models.md#reentrypolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `AllowedFields` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `FailurePolicy` | [`ProviderFailurePolicy`](../models.md#providerfailurepolicy) | How this provider family reports callback failures; it does not automatically make retries safe. |

## Used directly by

- [Contracts.DefineExtensionPoint](../contracts.md#defineextensionpoint)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/extensionpointdefinition.md) · Apache-2.0.
