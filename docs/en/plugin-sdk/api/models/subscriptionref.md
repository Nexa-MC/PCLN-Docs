# SubscriptionRef

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Token` | `Guid` | Opaque Host-issued handle token. Keep it with its owner and resource type. |
| `LoadInstanceId` | `Guid` | Identity of the admitted load that owns this handle; it is not portable to a replacement load. |
| `Cursor` | `string?` | Opaque continuation or observation cursor. Reuse only in the issuing query/scope; absence and invalidity are different. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `ResyncRequired` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

## Used directly by

- [Contracts.WatchAvailability](../contracts.md#watchavailability)
- [Definitions.Watch](../definitions.md#watch)
- [Workflows.Watch](../workflows.md#watch)
- [Events.Subscribe](../events.md#subscribe)
- [Events.UnsubscribeSubscription](../events.md#unsubscribesubscription)
- [State.Watch](../state.md#watch)
- [UI.WatchViewLifecycle](../ui.md#watchviewlifecycle)
- [UI.SubscribeInput](../ui.md#subscribeinput)
- [Plugins.WatchAvailability](../plugins.md#watchavailability)
- [Resources.ReleaseSubscription](../resources.md#releasesubscription)
- [Minecraft.Instances.Watch](../minecraft-instances.md#watch)
- [Minecraft.Launch.WatchAttempt](../minecraft-launch.md#watchattempt)
- [Minecraft.Processes.WatchSession](../minecraft-processes.md#watchsession)
- [Minecraft.Processes.SubscribeLog](../minecraft-processes.md#subscribelog)
- [Minecraft.Content.Watch](../minecraft-content.md#watch)
- [Minecraft.Servers.DiscoverLan](../minecraft-servers.md#discoverlan)
- [Accounts.Watch](../accounts.md#watch)
- [Settings.Watch](../settings.md#watch)
- [Downloads.Watch](../downloads.md#watch)
- [Tasks.Watch](../tasks.md#watch)
- [Files.Watch](../files.md#watch)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/subscriptionref.md) · Apache-2.0.
