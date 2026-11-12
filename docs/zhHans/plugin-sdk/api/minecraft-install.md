> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../index.md)。

# Minecraft.Install

Resolve an installation draft into an explicit plan and execute it through the launcher’s installer. Draft edits, plan validation and execution are separate steps.

Contract: `nexa.minecraft.install/100`. [API index](index.md).

## Typical sequence

List compatible game/loader versions, update and validate the draft, resolve its plan, review it, then execute that plan. Monitor the returned operation for actual completion.

## Behavior and limits

An accepted execution request does not prove all files installed. Recovery and custom loader/template registration remain unavailable where marked; do not fabricate recovery records.

The recorded Host maps 10 of 15 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[ListGameVersions](#listgameversions) · [ListLoaderVersions](#listloaderversions) · [InspectLocalInstaller](#inspectlocalinstaller) · [ReadDraft](#readdraft) · [UpdateDraft](#updatedraft) · [ValidateDraft](#validatedraft) · [ResolvePlan](#resolveplan) · [PreviewPlan](#previewplan) · [ExecutePlan](#executeplan) · [Cancel](#cancel) · [ListRecoveries](#listrecoveries) · [ResumeRecovery](#resumerecovery) · [DiscardRecovery](#discardrecovery) · [RegisterTemplate](#registertemplate) · [RegisterLoaderProvider](#registerloaderprovider)

### ListGameVersions

[`PageRequest`](models/pagerequest.md) → `Page<GameVersion>` ([wrapper](models.md#containers), [item](models/gameversion.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Query |
| Permission | `nexa.minecraft.install.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Cursor` | `string?` | Opaque continuation or observation cursor. Reuse only in the issuing query/scope; absence and invalidity are different. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Limit` | `long` | Requested bound on returned items. The Host may impose a smaller domain-specific limit. |

**Successful result**

Read Items and continue with NextCursor while preserving the original query. An absent cursor ends the sequence; an invalid cursor is an error.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_ListGameVersions(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_ListGameVersions_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ListLoaderVersions

[`LoaderVersionRequest`](models/loaderversionrequest.md) → `Page<LoaderVersion>` ([wrapper](models.md#containers), [item](models/loaderversion.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Query |
| Permission | `nexa.minecraft.install.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Loader` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `GameVersion` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Page` | [`PageRequest`](models/pagerequest.md) | Structured PageRequest value; follow its linked field contract. |

**Successful result**

Read Items and continue with NextCursor while preserving the original query. An absent cursor ends the sequence; an invalid cursor is an error.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_ListLoaderVersions(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_ListLoaderVersions_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### InspectLocalInstaller

[`FileRef`](models/fileref.md) → [`InstallerInspection`](models/installerinspection.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Query |
| Permission | `nexa.minecraft.install.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Token` | `Guid` | Opaque Host-issued handle token. Keep it with its owner and resource type. |
| `LoadInstanceId` | `Guid` | Identity of the admitted load that owns this handle; it is not portable to a replacement load. |
| `Scope` | `string` | Explicit target scope. The Host checks that the caller is authorized for it. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_InspectLocalInstaller(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_InspectLocalInstaller_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadDraft

[`EntityRequest`](models/entityrequest.md) → [`InstallDraft`](models/installdraft.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Query |
| Permission | `nexa.minecraft.install.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_ReadDraft(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_ReadDraft_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### UpdateDraft

[`InstallDraftUpdate`](models/installdraftupdate.md) → [`InstallDraft`](models/installdraft.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Mutation |
| Permission | `nexa.minecraft.install.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Draft` | [`InstallDraft`](models/installdraft.md) | Structured InstallDraft value; follow its linked field contract. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_UpdateDraft(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_UpdateDraft_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ValidateDraft

[`InstallDraft`](models/installdraft.md) → [`ValidationReport`](models/validationreport.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Query |
| Permission | `nexa.minecraft.install.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Instance` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `GameVersion` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Loaders` | [`LoaderVersion[]`](models/loaderversion.md) | Structured LoaderVersion value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `OptionalFiles` | [`ResourceVersionRef[]`](models/resourceversionref.md) | Structured ResourceVersionRef value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Revision` | `Revision` | Opaque version token issued by the owner. Do not increment it or substitute another object’s revision. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_ValidateDraft(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_ValidateDraft_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ResolvePlan

[`InstallDraft`](models/installdraft.md) → [`InstallPlan`](models/installplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Query |
| Permission | `nexa.minecraft.install.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Instance` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `GameVersion` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Loaders` | [`LoaderVersion[]`](models/loaderversion.md) | Structured LoaderVersion value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `OptionalFiles` | [`ResourceVersionRef[]`](models/resourceversionref.md) | Structured ResourceVersionRef value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Revision` | `Revision` | Opaque version token issued by the owner. Do not increment it or substitute another object’s revision. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_ResolvePlan(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_ResolvePlan_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PreviewPlan

[`EntityRequest`](models/entityrequest.md) → [`InstallPlan`](models/installplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Query |
| Permission | `nexa.minecraft.install.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_PreviewPlan(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_PreviewPlan_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ExecutePlan

[`PlanRequest`](models/planrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Operation |
| Permission | `nexa.minecraft.install.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Plan` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |
| `ConfirmationToken` | `string?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_ExecutePlan(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_ExecutePlan_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Cancel

[`OperationRequest`](models/operationrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Mutation |
| Permission | `nexa.minecraft.install.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Operation` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_Cancel(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_Cancel_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ListRecoveries

[`PageRequest`](models/pagerequest.md) → `Page<RecoveryRecord>` ([wrapper](models.md#containers), [item](models/recoveryrecord.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `11` |
| Kind | Query |
| Permission | `nexa.minecraft.install.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Cursor` | `string?` | Opaque continuation or observation cursor. Reuse only in the issuing query/scope; absence and invalidity are different. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Limit` | `long` | Requested bound on returned items. The Host may impose a smaller domain-specific limit. |

**Successful result**

Read Items and continue with NextCursor while preserving the original query. An absent cursor ends the sequence; an invalid cursor is an error.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_ListRecoveries(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_ListRecoveries_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ResumeRecovery

[`EntityRequest`](models/entityrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `12` |
| Kind | Operation |
| Permission | `nexa.minecraft.install.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_ResumeRecovery(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_ResumeRecovery_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### DiscardRecovery

[`EntityRequest`](models/entityrequest.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `13` |
| Kind | Mutation |
| Permission | `nexa.minecraft.install.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_DiscardRecovery(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_DiscardRecovery_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterTemplate

[`InstallTemplate`](models/installtemplate.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `14` |
| Kind | Registration |
| Permission | `nexa.minecraft.install.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `GameVersion` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Loaders` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Content` | [`ResourceVersionRef[]`](models/resourceversionref.md) | Structured ResourceVersionRef value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Workflow` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_RegisterTemplate(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_RegisterTemplate_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterLoaderProvider

[`ProviderDescriptor`](models/providerdescriptor.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `15` |
| Kind | Registration |
| Permission | `nexa.minecraft.install.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Kind` | `QualifiedId` | Host-supported provider family. Registration succeeds only for a mapped family. |
| `ContractVersion` | `ulong` | Provider contract version; current catalog read-provider callbacks use 100. |
| `SchemaHash` | `string` | Digest of the provider callback envelope schema; current catalog read providers use BusinessProviderCall. |
| `DisplayName` | [`LocalizedText`](models/localizedtext.md) | User-facing localized label; it is not an authority-bearing identity. |
| `Capabilities` | `string[]` | Exact capabilities advertised or required by this descriptor, subject to the Host’s accepted table. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `SupportedScopes` | `string[]` | Scopes the provider declares it can handle; declaration does not authorize every target. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Selection` | [`SelectionPolicy`](models.md#selectionpolicy) | Selection rule; the current catalog callback boundary supports ExplicitRequest. |
| `Concurrency` | [`ConcurrencyPolicy`](models.md#concurrencypolicy) | Declared execution policy. A provider family may reject enum members whose semantics it does not implement. |
| `DeadlineMilliseconds` | `long` | Requested deadline in milliseconds; queue time consumes this budget and caller deadlines can shorten it. |
| `FailurePolicy` | [`ProviderFailurePolicy`](models.md#providerfailurepolicy) | How this provider family reports callback failures; it does not automatically make retries safe. |
| `Configuration` | [`SchemaRef`](models/schemaref.md) | Schema for provider configuration, not arbitrary executable Host configuration. |
| `Handler` | `ulong` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Install_RegisterLoaderProvider(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Install_RegisterLoaderProvider_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/minecraft-install.md) · Apache-2.0.
