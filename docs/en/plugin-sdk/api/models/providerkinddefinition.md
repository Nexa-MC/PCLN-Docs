# ProviderKindDefinition

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Contract` | [`PublicContract`](../models/publiccontract.md) | Structured PublicContract value; follow its linked field contract. |
| `Selection` | [`SelectionPolicy`](../models.md#selectionpolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |

## Used directly by

- [Contracts.DefineProviderKind](../contracts.md#defineproviderkind)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/models/providerkinddefinition.md) · Apache-2.0.
