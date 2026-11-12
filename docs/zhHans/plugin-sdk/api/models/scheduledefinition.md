> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

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

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/models/scheduledefinition.md) · Apache-2.0.
