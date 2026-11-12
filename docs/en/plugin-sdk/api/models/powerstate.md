# PowerState

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `OnBattery` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ChargePercent` | `double?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Saving` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

## Used directly by

- [Platform.QueryPower](../platform.md#querypower)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/models/powerstate.md) · Apache-2.0.
