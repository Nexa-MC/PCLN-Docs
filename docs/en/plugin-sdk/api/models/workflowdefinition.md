# WorkflowDefinition

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Input` | [`SchemaRef`](../models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `Output` | [`SchemaRef`](../models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `Nodes` | [`WorkflowNode[]`](../models/workflownode.md) | Structured WorkflowNode value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `DefinitionDigest` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Persistent` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Concurrency` | [`ConcurrencyPolicy`](../models.md#concurrencypolicy) | Declared execution policy. A provider family may reject enum members whose semantics it does not implement. |
| `MaximumDepth` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `MaximumWork` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

## Used directly by

- [Workflows.Register](../workflows.md#register)
- [Workflows.Validate](../workflows.md#validate)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/workflowdefinition.md) · Apache-2.0.
