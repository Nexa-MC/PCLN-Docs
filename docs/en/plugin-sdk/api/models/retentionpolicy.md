# RetentionPolicy

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `KeepCount` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `KeepDays` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `MaximumBytes` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

## Used directly by

- [Backups.ReadRetention](../backups.md#readretention)
- [Backups.SetRetention](../backups.md#setretention)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/models/retentionpolicy.md) · Apache-2.0.
