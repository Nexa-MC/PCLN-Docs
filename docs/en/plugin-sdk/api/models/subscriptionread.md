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

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/subscriptionread.md) · Apache-2.0.
