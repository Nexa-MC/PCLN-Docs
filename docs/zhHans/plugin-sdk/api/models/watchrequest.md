> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# WatchRequest

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Target` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Cursor` | `string?` | Opaque continuation or observation cursor. Reuse only in the issuing query/scope; absence and invalidity are different. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Schema` | [`SchemaRef`](../models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |

## Used directly by

- [Workflows.Watch](../workflows.md#watch)
- [Minecraft.Instances.Watch](../minecraft-instances.md#watch)
- [Minecraft.Launch.WatchAttempt](../minecraft-launch.md#watchattempt)
- [Minecraft.Processes.WatchSession](../minecraft-processes.md#watchsession)
- [Minecraft.Content.Watch](../minecraft-content.md#watch)
- [Accounts.Watch](../accounts.md#watch)
- [Downloads.Watch](../downloads.md#watch)
- [Tasks.Watch](../tasks.md#watch)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/zh-CN/api/models/watchrequest.md) · Apache-2.0.
