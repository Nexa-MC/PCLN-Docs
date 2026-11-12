# RegistryDescriptor

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Schema` | [`SchemaRef`](../models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `EntryIdentity` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ReferenceTypes` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `MergePolicy` | [`MergePolicy`](../models.md#mergepolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `OrderingPolicy` | [`OrderingPolicy`](../models.md#orderingpolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Activation` | [`ActivationPolicy`](../models.md#activationpolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Ownership` | [`OwnershipPolicy`](../models.md#ownershippolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `SupportedOperations` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `ValidationRules` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Consumer` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Deletion` | [`DeletionPolicy`](../models.md#deletionpolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `MergeContract` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |

## Used directly by

- [Definitions.DescribeRegistry](../definitions.md#describeregistry)
- [Definitions.DefineRegistry](../definitions.md#defineregistry)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/registrydescriptor.md) · Apache-2.0.
