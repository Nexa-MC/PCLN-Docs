# CatalogProject

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Resource` | [`ResourceRef`](../models/resourceref.md) | Structured ResourceRef value; follow its linked field contract. |
| `Name` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Summary` | `string` | User-facing description of the proposed or observed result; it does not replace the bound target identity. |
| `Kind` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Categories` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |

## Used directly by

- [Catalog.ReadProject](../catalog.md#readproject)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/catalogproject.md) · Apache-2.0.
