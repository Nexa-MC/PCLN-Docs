# DefinitionSearch

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Registry` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Tags` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Page` | [`PageRequest`](../models/pagerequest.md) | Structured PageRequest value; follow its linked field contract. |

## Used directly by

- [Definitions.Query](../definitions.md#query)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/definitionsearch.md) · Apache-2.0.
