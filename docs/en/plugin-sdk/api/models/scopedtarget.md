# ScopedTarget

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Kind` | `QualifiedId` | Qualified scope kind accepted by the target service. |
| `Entity` | `EntityId?` | Optional entity within that scope; absent is not permission to choose any entity. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Scope` | `string` | Explicit target scope. The Host checks that the caller is authorized for it. |

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/scopedtarget.md) · Apache-2.0.
