# ActionRequest

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Action` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Target` | [`ScopedTarget`](../models/scopedtarget.md) | Structured ScopedTarget value; follow its linked field contract. |
| `Inputs` | `AbiValue` | Typed input value encoded under the declared input schema. |
| `ExpectedRevision` | `Revision?` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `IdempotencyKey` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

## Used directly by

- [Actions.Invoke](../actions.md#invoke)
- [Commands.Execute](../commands.md#execute)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/actionrequest.md) · Apache-2.0.
