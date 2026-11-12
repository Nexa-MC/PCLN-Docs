# ScheduleDefinition

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Workflow` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Trigger` | [`ScheduleTrigger`](../models.md#scheduletrigger) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `TimeZone` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `At` | `DateTimeOffset?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `IntervalMilliseconds` | `long?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Event` | `QualifiedId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Missed` | [`MissedSchedulePolicy`](../models.md#missedschedulepolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `ReplayLimit` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `DebounceMilliseconds` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

## Used directly by

- [Schedules.Register](../schedules.md#register)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/models/scheduledefinition.md) · Apache-2.0.
