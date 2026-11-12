> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# EventSubscribeRequest

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Event` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Schema` | [`SchemaRef`](../models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Cursor` | `string?` | Opaque continuation or observation cursor. Reuse only in the issuing query/scope; absence and invalidity are different. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Handler` | `ulong` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. |
| `IgnoreSelf` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Deduplicate` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Scope` | [`ScopedTarget`](../models/scopedtarget.md) | Explicit target scope. The Host checks that the caller is authorized for it. |
| `Lifetime` | [`SubscriptionLifetime`](../models.md#subscriptionlifetime) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Reentry` | [`ReentryPolicy`](../models.md#reentrypolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `QueueLimit` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

## Used directly by

- [Events.Subscribe](../events.md#subscribe)
- [Events.RegisterSubscription](../events.md#registersubscription)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/models/eventsubscriberequest.md) · Apache-2.0.
