# EventSubscriptionRegistration

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Registration` | [`RegistrationRef`](../models/registrationref.md) | Structured RegistrationRef value; follow its linked field contract. |
| `Subscription` | [`SubscriptionRef`](../models/subscriptionref.md) | Structured SubscriptionRef value; follow its linked field contract. |

## Used directly by

- [Events.RegisterSubscription](../events.md#registersubscription)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/eventsubscriptionregistration.md) · Apache-2.0.
