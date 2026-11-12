# WorkflowStep

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `string` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `State` | [`OperationState`](../models.md#operationstate) | Current state from the enum or model below; do not infer successful completion from admission alone. |
| `SideEffects` | [`LocalizedText[]`](../models/localizedtext.md) | Structured LocalizedText value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Failure` | [`OperationFailure?`](../models/operationfailure.md) | Structured terminal failure, when present. Preserve its identity rather than reporting an empty successful result. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/workflowstep.md) · Apache-2.0.
