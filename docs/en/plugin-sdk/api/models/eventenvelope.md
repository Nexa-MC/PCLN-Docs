# EventEnvelope

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `EventId` | `Guid` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Event` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Schema` | [`SchemaRef`](../models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Entity` | `EntityId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Revision` | `Revision` | Opaque version token issued by the owner. Do not increment it or substitute another object’s revision. |
| `OccurredAt` | `DateTimeOffset` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `CorrelationId` | `Guid` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `CausationId` | `Guid?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Origin` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Scope` | [`ScopedTarget`](../models/scopedtarget.md) | Explicit target scope. The Host checks that the caller is authorized for it. |
| `Payload` | `AbiValue` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

## Used directly by

- [Events.Publish](../events.md#publish)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/eventenvelope.md) · Apache-2.0.
