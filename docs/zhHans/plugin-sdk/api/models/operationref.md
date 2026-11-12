> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# OperationRef

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `State` | [`OperationState`](../models.md#operationstate) | Current state from the enum or model below; do not infer successful completion from admission alone. |

## Used directly by

- [Actions.Invoke](../actions.md#invoke)
- [Commands.Execute](../commands.md#execute)
- [Workflows.Start](../workflows.md#start)
- [Workflows.Cancel](../workflows.md#cancel)
- [Workflows.Resume](../workflows.md#resume)
- [Workflows.RetryStep](../workflows.md#retrystep)
- [Schedules.TriggerNow](../schedules.md#triggernow)
- [Plugins.CallService](../plugins.md#callservice)
- [Minecraft.Instances.Discover](../minecraft-instances.md#discover)
- [Minecraft.Instances.CommitCreate](../minecraft-instances.md#commitcreate)
- [Minecraft.Instances.CommitClone](../minecraft-instances.md#commitclone)
- [Minecraft.Instances.CommitDelete](../minecraft-instances.md#commitdelete)
- [Minecraft.Install.ExecutePlan](../minecraft-install.md#executeplan)
- [Minecraft.Install.Cancel](../minecraft-install.md#cancel)
- [Minecraft.Install.ResumeRecovery](../minecraft-install.md#resumerecovery)
- [Minecraft.Java.Discover](../minecraft-java.md#discover)
- [Minecraft.Java.Install](../minecraft-java.md#install)
- [Minecraft.Java.Remove](../minecraft-java.md#remove)
- [Minecraft.Launch.Start](../minecraft-launch.md#start)
- [Minecraft.Launch.Cancel](../minecraft-launch.md#cancel)
- [Minecraft.Processes.RequestClose](../minecraft-processes.md#requestclose)
- [Minecraft.Processes.Stop](../minecraft-processes.md#stop)
- [Minecraft.Content.Execute](../minecraft-content.md#execute)
- [Minecraft.Content.Rollback](../minecraft-content.md#rollback)
- [Minecraft.Content.Verify](../minecraft-content.md#verify)
- [Minecraft.Content.RestoreTrash](../minecraft-content.md#restoretrash)
- [Minecraft.Content.ClearTrash](../minecraft-content.md#cleartrash)
- [Minecraft.Content.Import](../minecraft-content.md#import)
- [Minecraft.Content.Export](../minecraft-content.md#export)
- [Minecraft.Worlds.Copy](../minecraft-worlds.md#copy)
- [Minecraft.Worlds.ApplyDataPackPlan](../minecraft-worlds.md#applydatapackplan)
- [Minecraft.Worlds.Backup](../minecraft-worlds.md#backup)
- [Minecraft.Worlds.Restore](../minecraft-worlds.md#restore)
- [Minecraft.Servers.Join](../minecraft-servers.md#join)
- [Catalog.ExecutePlan](../catalog.md#executeplan)
- [Accounts.Refresh](../accounts.md#refresh)
- [Accounts.UploadSkin](../accounts.md#uploadskin)
- [Accounts.SetCape](../accounts.md#setcape)
- [Settings.Apply](../settings.md#apply)
- [Settings.Migrate](../settings.md#migrate)
- [Themes.Commit](../themes.md#commit)
- [Themes.ImportOptions](../themes.md#importoptions)
- [Themes.ExportOptions](../themes.md#exportoptions)
- [Themes.MigrateOptions](../themes.md#migrateoptions)
- [Backups.Capture](../backups.md#capture)
- [Backups.Restore](../backups.md#restore)
- [Backups.Export](../backups.md#export)
- [Backups.Import](../backups.md#import)
- [Backups.Prune](../backups.md#prune)
- [Downloads.Start](../downloads.md#start)
- [Downloads.Pause](../downloads.md#pause)
- [Downloads.Resume](../downloads.md#resume)
- [Downloads.Cancel](../downloads.md#cancel)
- [Tasks.CreateOwned](../tasks.md#createowned)
- [Tasks.Cancel](../tasks.md#cancel)
- [Tasks.Retry](../tasks.md#retry)
- [Storage.Migrate](../storage.md#migrate)
- [Files.Move](../files.md#move)
- [Files.Delete](../files.md#delete)
- [Minecraft.Diagnostics.ExecuteRepair](../minecraft-diagnostics.md#executerepair)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/models/operationref.md) · Apache-2.0.
