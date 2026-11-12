# RegistrationRequest

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Registration` | [`RegistrationRef`](../models/registrationref.md) | Structured RegistrationRef value; follow its linked field contract. |

## Used directly by

- [Events.Unsubscribe](../events.md#unsubscribe)
- [Resources.Release](../resources.md#release)
- [Settings.EndTemporaryOverlay](../settings.md#endtemporaryoverlay)
- [Themes.Revert](../themes.md#revert)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/registrationrequest.md) · Apache-2.0.
