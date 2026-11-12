# WorkflowNode

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `string` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Kind` | [`WorkflowNodeKind`](../models.md#workflownodekind) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Target` | `QualifiedId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Inputs` | `AbiValue` | Typed input value encoded under the declared input schema. |
| `Children` | [`WorkflowNode[]`](../models/workflownode.md) | Structured WorkflowNode value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `MaximumConcurrency` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `MaximumAttempts` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `BackoffMilliseconds` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Completion` | [`ParallelCompletion`](../models.md#parallelcompletion) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `RetryableErrors` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `InputSchema` | [`SchemaRef`](../models/schemaref.md) | Schema that the producer must use for the operation’s input value. |
| `OutputSchema` | [`SchemaRef`](../models/schemaref.md) | Schema the consumer uses to validate the successful output value. |

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/workflownode.md) · Apache-2.0.
