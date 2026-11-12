> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# EntityRequest

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

## Used directly by

- [Workflows.Read](../workflows.md#read)
- [Workflows.ReadRunTrace](../workflows.md#readruntrace)
- [UI.CloseDialog](../ui.md#closedialog)
- [Minecraft.Instances.Read](../minecraft-instances.md#read)
- [Minecraft.Instances.Select](../minecraft-instances.md#select)
- [Minecraft.Instances.ReadIdentity](../minecraft-instances.md#readidentity)
- [Minecraft.Instances.ReadEffectiveSettings](../minecraft-instances.md#readeffectivesettings)
- [Minecraft.Instances.OpenDirectory](../minecraft-instances.md#opendirectory)
- [Minecraft.Install.ReadDraft](../minecraft-install.md#readdraft)
- [Minecraft.Install.PreviewPlan](../minecraft-install.md#previewplan)
- [Minecraft.Install.ResumeRecovery](../minecraft-install.md#resumerecovery)
- [Minecraft.Install.DiscardRecovery](../minecraft-install.md#discardrecovery)
- [Minecraft.Java.ReadRequirements](../minecraft-java.md#readrequirements)
- [Minecraft.Java.Remove](../minecraft-java.md#remove)
- [Minecraft.Launch.ReadEffectiveProfile](../minecraft-launch.md#readeffectiveprofile)
- [Minecraft.Launch.ListProfiles](../minecraft-launch.md#listprofiles)
- [Minecraft.Launch.ReadPlan](../minecraft-launch.md#readplan)
- [Minecraft.Launch.ReadAttempt](../minecraft-launch.md#readattempt)
- [Minecraft.Launch.ExplainContribution](../minecraft-launch.md#explaincontribution)
- [Minecraft.Processes.ReadSession](../minecraft-processes.md#readsession)
- [Minecraft.Processes.RequestClose](../minecraft-processes.md#requestclose)
- [Minecraft.Processes.Stop](../minecraft-processes.md#stop)
- [Minecraft.Processes.RevealWindow](../minecraft-processes.md#revealwindow)
- [Minecraft.Processes.ReadMetrics](../minecraft-processes.md#readmetrics)
- [Minecraft.Content.Inspect](../minecraft-content.md#inspect)
- [Minecraft.Content.ReadDependencyGraph](../minecraft-content.md#readdependencygraph)
- [Minecraft.Content.Preview](../minecraft-content.md#preview)
- [Minecraft.Content.ListTransactions](../minecraft-content.md#listtransactions)
- [Minecraft.Content.ReadIntegrity](../minecraft-content.md#readintegrity)
- [Minecraft.Content.Verify](../minecraft-content.md#verify)
- [Minecraft.Content.ListTrash](../minecraft-content.md#listtrash)
- [Minecraft.Worlds.List](../minecraft-worlds.md#list)
- [Minecraft.Worlds.Read](../minecraft-worlds.md#read)
- [Minecraft.Worlds.ReadMetadata](../minecraft-worlds.md#readmetadata)
- [Minecraft.Worlds.PlanDelete](../minecraft-worlds.md#plandelete)
- [Minecraft.Worlds.ListDataPacks](../minecraft-worlds.md#listdatapacks)
- [Minecraft.Worlds.Backup](../minecraft-worlds.md#backup)
- [Minecraft.Worlds.ReadHealth](../minecraft-worlds.md#readhealth)
- [Minecraft.Servers.ReadStatus](../minecraft-servers.md#readstatus)
- [Accounts.ReadPublic](../accounts.md#readpublic)
- [Accounts.Select](../accounts.md#select)
- [Accounts.CancelSignIn](../accounts.md#cancelsignin)
- [Accounts.Refresh](../accounts.md#refresh)
- [Accounts.SignOut](../accounts.md#signout)
- [Accounts.Remove](../accounts.md#remove)
- [Accounts.ReadLaunchEligibility](../accounts.md#readlauncheligibility)
- [Accounts.ReadWardrobe](../accounts.md#readwardrobe)
- [Settings.SelectProfile](../settings.md#selectprofile)
- [Themes.Read](../themes.md#read)
- [Themes.Prepare](../themes.md#prepare)
- [Themes.ReadOptions](../themes.md#readoptions)
- [Themes.ResetOptions](../themes.md#resetoptions)
- [Themes.ListResources](../themes.md#listresources)
- [Backups.List](../backups.md#list)
- [Backups.Read](../backups.md#read)
- [Backups.Statistics](../backups.md#statistics)
- [Backups.VerifyOffline](../backups.md#verifyoffline)
- [Backups.ReadRetention](../backups.md#readretention)
- [Downloads.Read](../downloads.md#read)
- [Downloads.Verify](../downloads.md#verify)
- [Tasks.Read](../tasks.md#read)
- [Tasks.Dismiss](../tasks.md#dismiss)
- [Network.OpenResponseStream](../network.md#openresponsestream)
- [Minecraft.Diagnostics.Analyze](../minecraft-diagnostics.md#analyze)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/models/entityrequest.md) · Apache-2.0.
