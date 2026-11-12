# LoadReport

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Plugin` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `LoadInstance` | `Guid` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `State` | `string` | Current state from the enum or model below; do not infer successful completion from admission alone. |
| `Findings` | [`ValidationIssue[]`](../models/validationissue.md) | Structured ValidationIssue value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `DependencyChain` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |

## Used directly by

- [Plugins.ReadOwnLoadReport](../plugins.md#readownloadreport)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/loadreport.md) · Apache-2.0.
