# SignInChallenge

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Flow` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `State` | [`SignInState`](../models.md#signinstate) | Current state from the enum or model below; do not infer successful completion from admission alone. |
| `Prompt` | [`LocalizedText`](../models/localizedtext.md) | Structured LocalizedText value; follow its linked field contract. |
| `VerificationUri` | `UriRef?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `UserCode` | `string?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

## Used directly by

- [Accounts.BeginSignIn](../accounts.md#beginsignin)
- [Accounts.ContinueSignIn](../accounts.md#continuesignin)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/signinchallenge.md) · Apache-2.0.
