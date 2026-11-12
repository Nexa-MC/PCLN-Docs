# CapabilityDescription

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `string` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Version` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Availability` | [`CapabilityAvailability`](../models.md#capabilityavailability) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Scopes` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Quotas` | [`NamedValue[]`](../models/namedvalue.md) | Structured NamedValue value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/capabilitydescription.md) · Apache-2.0.
