# NetworkRequest

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Uri` | `UriRef` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Method` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Headers` | [`NamedValue[]`](../models/namedvalue.md) | Structured NamedValue value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Body` | [`BlobRef?`](../models/blobref.md) | Structured BlobRef value; follow its linked field contract. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Credential` | [`CredentialRef?`](../models/credentialref.md) | Structured CredentialRef value; follow its linked field contract. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

## Used directly by

- [Network.Request](../network.md#request)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/networkrequest.md) · Apache-2.0.
