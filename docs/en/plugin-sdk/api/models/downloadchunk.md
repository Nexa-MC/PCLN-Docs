# DownloadChunk

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Offset` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Bytes` | `AbiValue` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `End` | `bool` | For a download chunk, true exactly when Offset plus returned byte count equals the plan’s declared size. |

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/downloadchunk.md) · Apache-2.0.
