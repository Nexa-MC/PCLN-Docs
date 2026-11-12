> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# MutationPlan

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Revision` | `Revision` | Opaque version token issued by the owner. Do not increment it or substitute another object’s revision. |
| `InputsHash` | `string` | Digest binding a plan to its prepared inputs. Do not replace inputs after review. |
| `Summary` | [`LocalizedText`](../models/localizedtext.md) | User-facing description of the proposed or observed result; it does not replace the bound target identity. |
| `Confirmation` | [`ConfirmationRequirement`](../models.md#confirmationrequirement) | Declared confirmation requirement. The Host owns the prompt and decision. |
| `Constraints` | [`NamedValue[]`](../models/namedvalue.md) | Structured NamedValue value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |

## Used directly by

- [Definitions.PreviewOverlay](../definitions.md#previewoverlay)
- [Workflows.Preview](../workflows.md#preview)
- [Minecraft.Instances.PrepareCreate](../minecraft-instances.md#preparecreate)
- [Minecraft.Instances.PrepareClone](../minecraft-instances.md#prepareclone)
- [Minecraft.Instances.PrepareDelete](../minecraft-instances.md#preparedelete)
- [Minecraft.Java.PrepareInstall](../minecraft-java.md#prepareinstall)
- [Minecraft.Java.PrepareManagedInstall](../minecraft-java.md#preparemanagedinstall)
- [Minecraft.Worlds.PlanDelete](../minecraft-worlds.md#plandelete)
- [Minecraft.Worlds.PlanSetDataPack](../minecraft-worlds.md#plansetdatapack)
- [Minecraft.Worlds.PreviewRestore](../minecraft-worlds.md#previewrestore)
- [Settings.PreviewChange](../settings.md#previewchange)
- [Backups.PrepareCapture](../backups.md#preparecapture)
- [Backups.PreviewRestore](../backups.md#previewrestore)
- [Backups.PreviewPrune](../backups.md#previewprune)
- [Files.PrepareMove](../files.md#preparemove)
- [Files.PrepareDelete](../files.md#preparedelete)
- [Minecraft.Diagnostics.PreviewRepair](../minecraft-diagnostics.md#previewrepair)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/models/mutationplan.md) · Apache-2.0.
