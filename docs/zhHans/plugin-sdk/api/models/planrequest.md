> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# PlanRequest

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Plan` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |
| `ConfirmationToken` | `string?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

## Used directly by

- [Minecraft.Instances.CommitCreate](../minecraft-instances.md#commitcreate)
- [Minecraft.Instances.CommitClone](../minecraft-instances.md#commitclone)
- [Minecraft.Instances.CommitDelete](../minecraft-instances.md#commitdelete)
- [Minecraft.Install.ExecutePlan](../minecraft-install.md#executeplan)
- [Minecraft.Java.Install](../minecraft-java.md#install)
- [Minecraft.Launch.ValidatePlan](../minecraft-launch.md#validateplan)
- [Minecraft.Launch.Start](../minecraft-launch.md#start)
- [Minecraft.Content.Execute](../minecraft-content.md#execute)
- [Minecraft.Content.Rollback](../minecraft-content.md#rollback)
- [Minecraft.Content.ClearTrash](../minecraft-content.md#cleartrash)
- [Minecraft.Worlds.ApplyDataPackPlan](../minecraft-worlds.md#applydatapackplan)
- [Minecraft.Worlds.Restore](../minecraft-worlds.md#restore)
- [Catalog.ExecutePlan](../catalog.md#executeplan)
- [Settings.Apply](../settings.md#apply)
- [Themes.Preview](../themes.md#preview)
- [Themes.Commit](../themes.md#commit)
- [Backups.Capture](../backups.md#capture)
- [Backups.Restore](../backups.md#restore)
- [Backups.Prune](../backups.md#prune)
- [Files.Move](../files.md#move)
- [Files.Delete](../files.md#delete)
- [Minecraft.Diagnostics.ExecuteRepair](../minecraft-diagnostics.md#executerepair)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/zh-CN/api/models/planrequest.md) · Apache-2.0.
