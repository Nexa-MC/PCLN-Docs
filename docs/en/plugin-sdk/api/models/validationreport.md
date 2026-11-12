# ValidationReport

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Valid` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Issues` | [`ValidationIssue[]`](../models/validationissue.md) | Structured ValidationIssue value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |

## Used directly by

- [Contracts.ValidateSchema](../contracts.md#validateschema)
- [Contracts.CheckCompatibility](../contracts.md#checkcompatibility)
- [Workflows.Validate](../workflows.md#validate)
- [Workflows.ExplainPlan](../workflows.md#explainplan)
- [Plugins.ProbeService](../plugins.md#probeservice)
- [Minecraft.Install.ValidateDraft](../minecraft-install.md#validatedraft)
- [Minecraft.Launch.ValidatePlan](../minecraft-launch.md#validateplan)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/validationreport.md) · Apache-2.0.
