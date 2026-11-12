# UIComponent

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `EntryFile` | [`FileRef`](../models/fileref.md) | Structured FileRef value; follow its linked field contract. |
| `Parameters` | [`SchemaRef`](../models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |

## Used directly by

- [UI.RegisterComponent](../ui.md#registercomponent)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/models/uicomponent.md) · Apache-2.0.
