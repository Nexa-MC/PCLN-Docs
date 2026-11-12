> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# CatalogVersion

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Version` | [`ResourceVersionRef`](../models/resourceversionref.md) | Structured ResourceVersionRef value; follow its linked field contract. |
| `Name` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `GameVersions` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Loaders` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Files` | [`CatalogFile[]`](../models/catalogfile.md) | Structured CatalogFile value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |

## Used directly by

- [Catalog.ReadVersion](../catalog.md#readversion)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/api/models/catalogversion.md) · Apache-2.0.
