# InputSubscription

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Surface` | [`DrawingSurfaceRef`](../models/drawingsurfaceref.md) | Structured DrawingSurfaceRef value; follow its linked field contract. |
| `Events` | [`InputEventKind[]`](../models.md#inputeventkind) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Handler` | `ulong` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. |

## Used directly by

- [UI.SubscribeInput](../ui.md#subscribeinput)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/inputsubscription.md) · Apache-2.0.
