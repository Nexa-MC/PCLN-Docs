# Backups

Inspect and maintain the selected instance’s durable backup history. The recorded Host maps 11 of 14 operations through the Setup owner, using a separate content-addressed store for each instance. Global backup history is not exposed.

Contract: `nexa.backups/100`. [API index](index.md).

## Typical sequence

Obtain an instance ID from Minecraft.Instances.List, then call Backups.List. Keep the returned page revision for prune and retention updates. Capture and prune require a single-use plan and Host confirmation. Observe the returned operation through Tasks until it reaches a terminal state, then refresh the history.

## Behavior and limits

Capture currently accepts only a null Target and empty Include/Exclude arrays. Retention supports 1–1,024 copies and 1–3,650 days, with MaximumBytes=0; it governs explicit prune previews, not automatic scheduling. Export writes a thin JSON manifest without file contents. PreviewRestore, Restore and Import remain unavailable: their original request models do not express the required new-directory or instance target safely.

The recorded Host maps 16 of 16 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[List](#list) · [Read](#read) · [Statistics](#statistics) · [PrepareCapture](#preparecapture) · [Capture](#capture) · [PreviewRestore](#previewrestore) · [Restore](#restore) · [VerifyOffline](#verifyoffline) · [Export](#export) · [Import](#import) · [PreviewPrune](#previewprune) · [Prune](#prune) · [ReadRetention](#readretention) · [SetRetention](#setretention) · [PrepareRestoreDestination](#preparerestoredestination) · [ImportInto](#importinto)

### List

[`EntityRequest`](models/entityrequest.md) → `Page<BackupSummary>` ([wrapper](models.md#containers), [item](models/backupsummary.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Query |
| Permission | `nexa.backups.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

Id is an admitted instance ID. The page contains that instance’s complete bounded history (at most 1,024 snapshots), no continuation cursor, and a scope revision covering manifests and retention. Use this page revision for BackupPrune.ExpectedRevision and BackupRetention.ExpectedRevision. Backup IDs belong to this plugin load; refresh them after reload.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

Read Items and continue with NextCursor while preserving the original query. An absent cursor ends the sequence; an invalid cursor is an error.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Backups_List(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_List_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Read

[`EntityRequest`](models/entityrequest.md) → [`BackupSummary`](models/backupsummary.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Query |
| Permission | `nexa.backups.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

Id is a backup ID returned by List, not an instance ID. A pruned backup returns NOT_FOUND; a fabricated or foreign-load ID returns HANDLE_INVALID. Size is the logical sum of referenced file sizes, not physical CAS storage.

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
nx_Backups_Read(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_Read_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Statistics

[`EntityRequest`](models/entityrequest.md) → [`BackupStatistics`](models/backupstatistics.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Query |
| Permission | `nexa.backups.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

Id is an instance ID. Count is its snapshot count; Bytes sums logical sizes across snapshots and therefore counts shared content more than once. This does not report the launcher-wide store or reclaimed disk space.

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
nx_Backups_Statistics(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_Statistics_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PrepareCapture

[`BackupCapture`](models/backupcapture.md) → [`MutationPlan`](models/mutationplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Query |
| Permission | `nexa.backups.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

Instance must be current. Set Target=null and Include/Exclude to empty arrays; other valid selections return CAPABILITY_UNAVAILABLE. The plan binds the instance and library revision, expires after ten minutes and requires Host confirmation. Only the instance directory is captured; shared assets, shared libraries, Java and account data are outside this snapshot. Capture bounds are 8,192 files, 512 MiB per file and 8 GiB in total; sources overlapping the backup store or containing unsupported links are rejected by the owner.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Instance` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Target` | [`FileRef?`](models/fileref.md) | Structured FileRef value; follow its linked field contract. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Include` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Exclude` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

Retain the exact plan ID and revision, review its bound inputs and confirmation requirement, then use the corresponding commit operation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Backups_PrepareCapture(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_PrepareCapture_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Capture

[`PlanRequest`](models/planrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Operation |
| Permission | `nexa.backups.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Consume the plan from PrepareCapture once, with its exact revision. Host confirmation and instance revision are checked before execution. The owner rejects non-idle capture and changing source files. A completed task has result schema Empty; refresh List to obtain backup IDs. An OperationRef only acknowledges admission, not successful capture.

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
nx_Backups_Capture(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_Capture_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PreviewRestore

[`BackupRestore`](models/backuprestore.md) → [`MutationPlan`](models/mutationplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Query |
| Permission | `nexa.backups.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

Bind an existing backup, its ExpectedRevision and a new destination admitted by PrepareRestoreDestination into a single-use restore plan. The Host preserves the source instance and never merges into an existing destination.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Backup` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Destination` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

Retain the exact plan ID and revision, review its bound inputs and confirmation requirement, then use the corresponding commit operation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Backups_PreviewRestore(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_PreviewRestore_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Restore

[`PlanRequest`](models/planrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Operation |
| Permission | `nexa.backups.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Confirm and execute a restore plan through the owning instance backup store. The destination grant is re-resolved under the file mutation gate; missing/corrupt objects, changed revisions or an existing destination fail. Empty is returned only after restore completes.

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
nx_Backups_Restore(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_Restore_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### VerifyOffline

[`EntityRequest`](models/entityrequest.md) → [`IntegrityReport`](models/integrityreport.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Query |
| Permission | `nexa.backups.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

Id is a listed backup ID. The owner verifies the referenced immutable objects and their hashes. Valid=false means missing or corrupt bytes; Issues lists up to 256 affected relative paths. A thin manifest alone can be listed but is not evidence of offline readiness. This checks snapshot bytes, not whether the game can launch offline with its Java, shared assets and libraries.

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
nx_Backups_VerifyOffline(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_VerifyOffline_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Export

[`BackupTransfer`](models/backuptransfer.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Operation |
| Permission | `nexa.backups.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Backup must be a listed backup ID and File a load-owned writable file grant. The Host confirms the destination, writes a staged thin JSON manifest and commits without overwriting an existing file. The completed task returns FileRef. No file contents are embedded: label this as a thin manifest, not a portable full backup, and explain that another store still needs every referenced object.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Backup` | `EntityId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `File` | [`FileRef`](models/fileref.md) | Structured FileRef value; follow its linked field contract. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Backups_Export(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_Export_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Import

[`BackupTransfer`](models/backuptransfer.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Operation |
| Permission | `nexa.backups.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Import a thin manifest into the instance scope identified by the non-null Backup anchor. Backup must be a backup already listed by this caller. For an empty scope, use ImportInto. The manifest carries metadata and hashes, not content objects; successful import is not proof of offline readiness. VerifyOffline checks that separately.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Backup` | `EntityId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `File` | [`FileRef`](models/fileref.md) | Structured FileRef value; follow its linked field contract. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Backups_Import(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_Import_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PreviewPrune

[`BackupPrune`](models/backupprune.md) → [`MutationPlan`](models/mutationplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `11` |
| Kind | Query |
| Permission | `nexa.backups.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

Use the scope revision from List. Retention.MaximumBytes must be zero; unsupported byte limits return CAPABILITY_UNAVAILABLE. The plan summarizes the number of manifests to remove and bytes to reclaim. The newest snapshot is always retained. Changing the history after preview invalidates the plan.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Instance` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Retention` | [`RetentionPolicy`](models/retentionpolicy.md) | Structured RetentionPolicy value; follow its linked field contract. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

Retain the exact plan ID and revision, review its bound inputs and confirmation requirement, then use the corresponding commit operation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Backups_PreviewPrune(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_PreviewPrune_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Prune

[`PlanRequest`](models/planrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `12` |
| Kind | Operation |
| Permission | `nexa.backups.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Consume the plan from PreviewPrune once. Confirmation, scope revision, idle state and the owner’s fresh prune revision must all still pass. Deletion affects only this instance’s store. The completed task returns Empty; refresh List and Statistics. A rejected or stale plan never authorizes deletion of a different scope.

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
nx_Backups_Prune(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_Prune_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadRetention

[`EntityRequest`](models/entityrequest.md) → [`RetentionPolicy`](models/retentionpolicy.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `13` |
| Kind | Query |
| Permission | `nexa.backups.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

Id is an instance ID. Returns the stored count/day policy with MaximumBytes=0. Defaults are 32 copies and 90 days. Read List as well to obtain the revision required by SetRetention. Reading this policy does not indicate that automatic scoped cleanup is enabled.

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
nx_Backups_ReadRetention(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_ReadRetention_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### SetRetention

[`BackupRetention`](models/backupretention.md) → [`RetentionPolicy`](models/retentionpolicy.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `14` |
| Kind | Mutation |
| Permission | `nexa.backups.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Use the exact revision returned by List, not a BackupSummary revision. The Host confirms the change and the owner compares the scope revision while holding its storage lease. Concurrent policy or history changes fail with CONFLICT rather than overwriting another update. Returns the committed policy; query List again before the next change.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Instance` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Policy` | [`RetentionPolicy`](models/retentionpolicy.md) | Structured RetentionPolicy value; follow its linked field contract. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Backups_SetRetention(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_SetRetention_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PrepareRestoreDestination

[`FileRef`](models/fileref.md) → `EntityId`

| Property | Contract |
| --- | --- |
| Local SDK method ID | `15` |
| Kind | Query |
| Permission | `nexa.backups.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

Admit an owned writable FileRef whose destination does not exist. Return a load-local destination EntityId for PreviewRestore. A raw path or an existing instance ID cannot replace this handle.

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
nx_Backups_PrepareRestoreDestination(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_PrepareRestoreDestination_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ImportInto

[`BackupImportRequest`](models/backupimportrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `16` |
| Kind | Operation |
| Permission | `nexa.backups.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Import a thin backup manifest from an owned readable FileRef into an explicitly admitted instance scope. This additive request works when that scope has no existing backup. The Host confirms import and uses the owner’s validated immutable manifest importer; duplicates and malformed records fail.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Instance` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `File` | [`FileRef`](models/fileref.md) | Structured FileRef value; follow its linked field contract. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Backups_ImportInto(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Backups_ImportInto_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/backups.md) · Apache-2.0.
