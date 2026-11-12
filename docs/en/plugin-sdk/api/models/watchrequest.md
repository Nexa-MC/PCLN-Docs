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

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/watchrequest.md) · Apache-2.0.
