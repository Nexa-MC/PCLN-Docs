> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# WorkflowStepRequest

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Run` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `StepId` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |
| `IdempotencyKey` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

## Used directly by

- [Workflows.RetryStep](../workflows.md#retrystep)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/api/models/workflowsteprequest.md) · Apache-2.0.
