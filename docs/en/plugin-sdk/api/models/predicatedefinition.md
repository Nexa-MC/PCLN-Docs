# PredicateDefinition

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Input` | [`SchemaRef`](../models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `Handler` | `ulong?` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Expression` | `AbiValue` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

## Used directly by

- [Predicates.Register](../predicates.md#register)
- [Predicates.Describe](../predicates.md#describe)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/predicatedefinition.md) · Apache-2.0.
