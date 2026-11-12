# SettingQuery

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Target` | [`ScopedTarget`](../models/scopedtarget.md) | Structured ScopedTarget value; follow its linked field contract. |

## Used directly by

- [Settings.Get](../settings.md#get)
- [Settings.GetEffective](../settings.md#geteffective)
- [Settings.Watch](../settings.md#watch)
- [Settings.Reset](../settings.md#reset)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/settingquery.md) · Apache-2.0.
