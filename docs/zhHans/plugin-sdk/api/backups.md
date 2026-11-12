> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../index.md)。

# Backups

The catalog reserves explicit backup capture, verification, restoration and retention contracts. The recorded Desktop Host does not map this group yet.

Contract: `nexa.backups/100`. [API index](index.md).

## Typical sequence

Treat this capability as unavailable in that Host. Do not offer controls that imply a successful backup or silently return empty backup history from a failed call.

## Behavior and limits

Implementations must define target scope, plan confirmation, integrity and retention semantics before enabling these operations. Existing world backup features do not establish support for this separate API group.

The recorded Host maps 0 of 14 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[List](#list) · [Read](#read) · [Statistics](#statistics) · [PrepareCapture](#preparecapture) · [Capture](#capture) · [PreviewRestore](#previewrestore) · [Restore](#restore) · [VerifyOffline](#verifyoffline) · [Export](#export) · [Import](#import) · [PreviewPrune](#previewprune) · [Prune](#prune) · [ReadRetention](#readretention) · [SetRetention](#setretention)

### List

[`EntityRequest`](models/entityrequest.md) → `Page<BackupSummary>` ([wrapper](models.md#containers), [item](models/backupsummary.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Query |
| Permission | `nexa.backups.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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


---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/backups.md) · Apache-2.0.
