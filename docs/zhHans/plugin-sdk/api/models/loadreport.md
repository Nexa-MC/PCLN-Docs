> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# LoadReport

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Plugin` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `LoadInstance` | `Guid` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `State` | `string` | Current state from the enum or model below; do not infer successful completion from admission alone. |
| `Findings` | [`ValidationIssue[]`](../models/validationissue.md) | Structured ValidationIssue value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `DependencyChain` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |

## Used directly by

- [Plugins.ReadOwnLoadReport](../plugins.md#readownloadreport)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/zh-CN/api/models/loadreport.md) · Apache-2.0.
