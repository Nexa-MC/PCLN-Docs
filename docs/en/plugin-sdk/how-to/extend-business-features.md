# Extend launcher features through the Host

Use this guide after completing the [plugin tutorial](../quickstart.md).
It explains how the completed ABI 100 business routes fit together. The examples
assume that `api` is a negotiated `Abi100Context` and that each call receives fresh
invocation options with an operation ID, deadline and idempotency key where required.
Check every `AbiReply` before accessing `Value`.

A Host mapping is one part of the contract. Permission, stage, ownership and the
business operation’s preconditions still decide whether an invocation can run.
See the exact source snapshot in [Host support](../host-support.md).

## Register a provider and call its consumer

Register callbacks during PreInitialize and descriptors during Initialize. Use
`BusinessProviderCall` as the callback envelope. The provider’s `Kind` and method
names select a closed table; they do not introduce arbitrary Host methods.

| Registration | Kind | Method | Input → output | Consumer |
| --- | --- | --- | --- | --- |
| Diagnostics.RegisterRuleProvider | `nexa:diagnostics/rules` | Analyze | InstanceSummary → DiagnosticAnalysis | AnalyzeWithProvider |
| Content.RegisterFormatProvider | `nexa:content/format` | Inspect | ContentInspectionInput → ContentInspection | InspectWithProvider |
| Catalog.RegisterTranslationProvider | `nexa:catalog/translation` | Translate | CatalogTranslationInput → CatalogTranslation | ReadTranslatedProject |
| Accounts.RegisterProvider | `nexa:accounts/authentication` | ResolveSignIn | SignInRequest → AccountProviderConfiguration | BeginSignIn |
| Install.RegisterLoaderProvider | `nexa:install/loader-catalog` | ListVersions | LoaderVersionRequest → Page of LoaderVersion | ListLoaderVersions |
| Java.RegisterDistributionProvider | `nexa:java/distributions` | ListDistributions | PageRequest → Page of JavaDistribution | ListDistributions |
| Downloads.RegisterSourceResolver | `nexa:downloads/source-resolver` | Resolve | DownloadSource → DownloadSource | Resolve, Start |
| Downloads.RegisterTransferProvider | `nexa:downloads/transfer` | ReadChunk | DownloadChunkRequest → DownloadChunk | Start |

Minecraft-prefixed groups are shortened in this table. All of these descriptors
use `ContractVersion = 100`, `SchemaHash = Abi100Schemas.BusinessProviderCall.Digest`,
`Configuration = Abi100Schemas.Empty`, application scope and explicit selection.
The [provider guide](../business-providers.md) explains concurrency, failure policy,
query-only callbacks and retirement. A callback must return the output model itself,
inside one `AbiReply`; do not nest another transport reply in its payload.

A diagnostic provider sees public instance metadata. A format provider sees the
name and bytes of an explicitly granted file, capped at 64 KiB. An account provider
chooses a Yggdrasil/Nide8 HTTPS endpoint; the Host handles credentials. A loader
provider supplies version offers for supported loader families. These boundaries
are deliberate: registering one provider does not grant unrelated file, credential
or process authority.

## Download provider bytes without owning the target file

A source resolver can replace a source URI and select a transfer provider. It must
return an HTTP(S) URI without embedded credentials or a fragment. Resolution is one
step; the Host does not recursively follow a chain of resolvers.

A transfer provider handles `ReadChunk`. Its request contains a source URI, offset
and maximum length. Return bytes starting at exactly that offset. Set `End` only
when the returned bytes reach the plan’s declared size. The Host requests no more
than 64 KiB per call, verifies the complete size and SHA-256, and publishes from
staging only after verification. A malformed chunk cannot produce a completed
output file. The callback never receives the destination path.

This design also permits offline transfer from plugin-managed cached bytes. The
URI identifies the source; it does not force the callback to open a network
connection. The caller still needs a writable destination grant, and the plan still
needs the expected length and digest. Resume restarts the transfer from zero.

## Restore a backup to a new directory

First select a backup from `Backups.List` for an admitted instance. Obtain a new,
nonexistent output path through the Host’s file-selection flow. The writable
`FileRef` from that flow is the only input accepted by the destination admission
operation.

```csharp
InvocationOptions Options() => new(Guid.NewGuid(), TimeSpan.FromSeconds(10), default)
    { IdempotencyKey = Guid.NewGuid().ToString("N") };

var destinationReply = await api.Backups.PrepareRestoreDestination(outputFile, Options());
if (!destinationReply.Success) throw new InvalidOperationException(destinationReply.Error!.Code);
var previewReply = await api.Backups.PreviewRestore(
    new(backup.Id, destinationReply.Value, backup.Revision), Options());
if (!previewReply.Success) throw new InvalidOperationException(previewReply.Error!.Code);
// Display the preview; the Host owns confirmation at execution time.
var restoreReply = await api.Backups.Restore(
    new(previewReply.Value.Id, previewReply.Value.Revision, null), Options());
if (!restoreReply.Success) throw new InvalidOperationException(restoreReply.Error!.Code);
```

Read the returned operation through `Tasks.Read` until it reaches a terminal state.
`Completed` means the owner finished restoration. `Failed`, `Cancelled` and
`OutcomeUnknown` are distinct outcomes; none means an empty successful backup.
A consumed plan cannot be submitted again. Prepare a new plan after reconciling
the destination and current backup revision.

`Backups.ImportInto` imports a thin manifest into an explicitly selected instance,
including an instance with no backups. The retained `Import` request uses an
existing backup as its instance-scope anchor. Thin manifests contain paths, sizes
and content hashes, not the referenced content objects. Always run `VerifyOffline`
before advertising that an imported backup can be restored without fetching data.

World snapshots have their own scope. Use `Worlds.ListBackups`, then
`Worlds.PrepareRestoreDestination` with the original world ID, a new safe world
name and its revision. Pass the returned destination and the snapshot’s revision
to `Worlds.PreviewRestore`. The restored copy is created under the same instance’s
`saves` directory; the original world remains intact.

## Clone or delete an instance

`Instances.PrepareClone` binds the source ID and revision, destination root and new
name. `CommitClone` asks for Host confirmation, checks both roots and running games,
then copies to staging. The manifest is renamed and the new instance is published
last. A clone is isolated from shared game data. Cross-root cloning also copies
runtime dependencies without replacing conflicting files. Links and unbounded
copies are rejected; see the [instance reference](../api/minecraft-instances.md)
for exact limits. Global launcher preferences are not a version-directory file
copy and are not duplicated by this operation.

Deletion has two explicit outcomes. `RetainUserData = true` moves the version
directory into `.recycle`; false permanently deletes that version directory. Shared
root data and runtime caches remain. World deletion uses content trash instead.
Permanent trash clearing requires `Content.PreviewClearTrash` followed by
`Content.ClearTrash`, and is bound to the previewed set of trash records.

## Migrate durable plugin settings

Use `Settings.RegisterSchema` for version 1, or `RegisterVersionedSchema` for a
positive explicit version. Register your own qualified setting ID, a known value
schema, a valid default and the supported `global`/`instance` scopes. The Host
persists the value under the plugin ID and canonical scope; load-local entity IDs
are never used as durable keys.

After upgrading the registration to version 2, an existing version-1 value cannot
be read as version 2. Register a migration callback, then call `Settings.Migrate`
with `FromVersion = 1`, `ToVersion = 2` and that callback handle. The callback reads
`SettingMigrationInput` and returns the new schema’s encoded value. It may query
permitted Host data but cannot mutate it. The Host confirms the operation and
commits with a storage revision comparison. A concurrent edit, changed schema,
invalid result or rejected confirmation leaves the previous value intact.

Keep migration functions deterministic where possible. Do not send network
requests merely to rewrite a local preference, and do not overwrite a new user
value after a revision conflict. Re-read and explain the conflict before retrying.
`Settings.RegisterPage` adds a verified NXML settings page through the existing
page renderer; registering a schema alone does not create UI controls.

## Contribute to one launch

Register a `LaunchContributionRegistration` with a callback and a nonempty subset
of `MemoryMiB`, `Width`, and `Height`. The callback receives and returns
`LaunchProfile`; all other fields must remain unchanged. Contributions are applied
in qualified-ID order. A field already claimed by an accepted contribution cannot
be claimed again. Required errors stop preparation; optional errors appear in
`ExplainContribution`.

A preflight uses the same registration model with no fields and returns a
`ValidationReport`. It runs after contributions at preparation time and again
before launch execution. A required invalid or fatal report blocks launch. At most
32 launch definitions are consumed, and each callback has a bounded query-only
execution scope. Unloading or changing a participating definition makes the plan
stale. The accepted values affect only this launch; they do not rewrite saved
profiles or global settings.

## Install from a template and recover interrupted work

An install template identifies an owned workflow. Declare that workflow with
`InstallTemplateInvocation` input and `Empty` output. When preparing creation,
pass the template ID to `Instances.PrepareCreate`. Only the template’s owning load
may execute this workflow through the template adapter.

The workflow receives both the registered template and the admitted creation
request. Its actions perform installation through authorized Host APIs, consume
the declared content list, handle failures and return `Empty` only when finished.
For a base game, an action can prepare and commit the built-in
`nexa:instance/java` template before installing additional content. Do not return
success immediately after starting a child operation: wait for its terminal state.
The Host verifies the resulting game version and required loader selections before
completing the outer operation. Content-specific checks remain the workflow’s
responsibility. Workflow persistence and uncertain-effect rules still apply.

`Install.ListRecoveries` exposes authenticated pending installer journals for
registered roots. `ResumeRecovery` resumes the selected journal after confirmation;
a rollback-requested record continues rollback. `DiscardRecovery` dismisses the
offer while retaining installed and staged files. Neither operation accepts a
filesystem path in place of the listed recovery ID. The recovery record’s native
operation correlation is not a `Tasks.Read` handle; the returned resume operation
is the plugin-visible task to observe.

## Test the boundaries before publishing

Exercise each provider from a separate consumer load. Test malformed output,
cancellation and provider retirement, not just a valid reply. For mutations, cover
rejected confirmation, a changed revision after preview, duplicate execution and
an existing destination. For migrations, load the old version, persist a value,
stop it, load the new version and verify both successful and failed migration.

The Host’s integration tests use these same scenarios. They establish current
behavior; they do not replace testing against the exact launcher Alpha you plan
to support. Pin the SDK bundle and record your tested Host version in the plugin’s
release notes.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/how-to/extend-business-features.md) · Apache-2.0.
