> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](index.md)。

# Host implementation snapshot

Use this page to distinguish a declared SDK operation from an implemented launcher
route. The recorded development Host maps **297/346** ABI 100 operations.
Source revision: `195083d163f6569e8e6e9d4389a285e5e7749921`.

NexaCL development main integration; no new launcher Alpha is implied.

## What the count means

A mapping still requires permission, legal phase, ownership, supported platform and
business preconditions. It does not promise complete provider families or every
option in a request. The SDK deliberately describes the complete catalog so
compatible Hosts can implement more routes. Older released Alphas can map fewer.

The current custom catalog provider supports seven read methods. Custom catalog
installation and favorites are not implied. Managed Java offers use the additive
multi-file distribution path; the older distribution routes below remain absent.
Production Market delivery is a separate unfinished integration boundary.

## Before requiring a capability

Check the actual Host's negotiated capabilities, then handle per-call unavailability.
Make a nonessential feature optional and explain why its UI is unavailable. Do not
replace a failed operation with a successful empty result or a private implementation
that bypasses Host ownership. Source mappings are recorded in
`contracts/host-support.json`; update them only from implementation evidence.

## Unmapped operations

- `Minecraft.Instances.PrepareClone`
- `Minecraft.Instances.CommitClone`
- `Minecraft.Instances.PrepareDelete`
- `Minecraft.Instances.CommitDelete`
- `Minecraft.Install.ListRecoveries`
- `Minecraft.Install.ResumeRecovery`
- `Minecraft.Install.DiscardRecovery`
- `Minecraft.Install.RegisterTemplate`
- `Minecraft.Install.RegisterLoaderProvider`
- `Minecraft.Java.ListDistributions`
- `Minecraft.Java.PrepareInstall`
- `Minecraft.Java.RegisterDistributionProvider`
- `Minecraft.Launch.RegisterContribution`
- `Minecraft.Launch.RegisterPreflight`
- `Minecraft.Launch.ExplainContribution`
- `Minecraft.Content.ClearTrash`
- `Minecraft.Content.RegisterFormatProvider`
- `Minecraft.Worlds.PlanDelete`
- `Minecraft.Worlds.PreviewRestore`
- `Minecraft.Worlds.Restore`
- `Catalog.RegisterCollection`
- `Catalog.RegisterTranslationProvider`
- `Accounts.SignOut`
- `Accounts.RegisterProvider`
- `Settings.RegisterSchema`
- `Settings.RegisterPage`
- `Settings.Migrate`
- `Themes.MigrateOptions`
- `Themes.ListResources`
- `Themes.ReadResource`
- `Themes.ReleaseResource`
- `Backups.List`
- `Backups.Read`
- `Backups.Statistics`
- `Backups.PrepareCapture`
- `Backups.Capture`
- `Backups.PreviewRestore`
- `Backups.Restore`
- `Backups.VerifyOffline`
- `Backups.Export`
- `Backups.Import`
- `Backups.PreviewPrune`
- `Backups.Prune`
- `Backups.ReadRetention`
- `Backups.SetRetention`
- `Downloads.RegisterSourceResolver`
- `Downloads.RegisterTransferProvider`
- `Tasks.Retry`
- `Minecraft.Diagnostics.RegisterRuleProvider`

[API reference](api/index.md) · [Migration](migration.md)

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/host-support.md) · Apache-2.0.
