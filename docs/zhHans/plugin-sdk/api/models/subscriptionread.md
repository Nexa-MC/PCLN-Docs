> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# SubscriptionRead

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Subscription` | [`SubscriptionRef`](../models/subscriptionref.md) | Structured SubscriptionRef value; follow its linked field contract. |
| `Limit` | `long` | Requested bound on returned items. The Host may impose a smaller domain-specific limit. |

## Used directly by

- [Resources.ReadSubscription](../resources.md#readsubscription)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/zh-CN/api/models/subscriptionread.md) · Apache-2.0.
