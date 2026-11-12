# NamespaceRequest

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Namespace` | `QualifiedId` | Private storage namespace identity or handle. It remains subject to current-load ownership. |
| `SchemaVersion` | `ulong` | Version of the declared data schema; independent of SDK and ABI versions. |

## Used directly by

- [Storage.OpenNamespace](../storage.md#opennamespace)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/namespacerequest.md) · Apache-2.0.
