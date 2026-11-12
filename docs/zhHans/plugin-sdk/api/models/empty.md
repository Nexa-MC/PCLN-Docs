> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../../index.md)。

# Empty

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

This model has no fields. Send its encoded empty object, not an arbitrary Null value.

## Used directly by

- [Definitions.RemoveOwned](../definitions.md#removeowned)
- [Events.Publish](../events.md#publish)
- [Events.Unsubscribe](../events.md#unsubscribe)
- [Events.UnsubscribeSubscription](../events.md#unsubscribesubscription)
- [UI.CloseDialog](../ui.md#closedialog)
- [UI.Navigate](../ui.md#navigate)
- [UI.Notify](../ui.md#notify)
- [UI.SubmitDrawCommands](../ui.md#submitdrawcommands)
- [Plugins.ReleaseBinding](../plugins.md#releasebinding)
- [Plugins.ReadOwnLoadReport](../plugins.md#readownloadreport)
- [Diagnostics.Log](../diagnostics.md#log)
- [Diagnostics.Report](../diagnostics.md#report)
- [Resources.Release](../resources.md#release)
- [Resources.ReleaseSubscription](../resources.md#releasesubscription)
- [Minecraft.Instances.RemoveRoot](../minecraft-instances.md#removeroot)
- [Minecraft.Instances.OpenDirectory](../minecraft-instances.md#opendirectory)
- [Minecraft.Install.DiscardRecovery](../minecraft-install.md#discardrecovery)
- [Minecraft.Processes.RevealWindow](../minecraft-processes.md#revealwindow)
- [Minecraft.Servers.ListSaved](../minecraft-servers.md#listsaved)
- [Minecraft.Servers.DiscoverLan](../minecraft-servers.md#discoverlan)
- [Catalog.SetFavorite](../catalog.md#setfavorite)
- [Accounts.CancelSignIn](../accounts.md#cancelsignin)
- [Accounts.SignOut](../accounts.md#signout)
- [Accounts.Remove](../accounts.md#remove)
- [Settings.EndTemporaryOverlay](../settings.md#endtemporaryoverlay)
- [Themes.Revert](../themes.md#revert)
- [Themes.ReleaseResource](../themes.md#releaseresource)
- [Tasks.Report](../tasks.md#report)
- [Tasks.Complete](../tasks.md#complete)
- [Tasks.Fail](../tasks.md#fail)
- [Tasks.Dismiss](../tasks.md#dismiss)
- [Network.Cancel](../network.md#cancel)
- [Network.Send](../network.md#send)
- [Network.Close](../network.md#close)
- [Platform.Describe](../platform.md#describe)
- [Platform.OpenUri](../platform.md#openuri)
- [Platform.RevealFile](../platform.md#revealfile)
- [Platform.Notify](../platform.md#notify)
- [Platform.ReadClipboard](../platform.md#readclipboard)
- [Platform.WriteClipboard](../platform.md#writeclipboard)
- [Platform.QueryPower](../platform.md#querypower)
- [Platform.QueryDisplay](../platform.md#querydisplay)
- [Platform.QueryArchitecture](../platform.md#queryarchitecture)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/api/models/empty.md) · Apache-2.0.
