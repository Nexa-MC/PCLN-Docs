> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../index.md)。

# Files

Access verified package assets and Host-granted user files. Paths and opaque FileRef values have different meanings; a displayed path is not an access grant.

Contract: `nexa.files/100`. [API index](index.md).

## Typical sequence

Open a package asset by its declared relative path or request a user picker grant. Read bounded data, use atomic replacement for writes, and prepare move/delete plans before execution.

## Behavior and limits

Do not expand a grant to siblings or symlink targets outside its scope. Payload integrity and filesystem authority are checked separately. Cancellation from a picker is not a selected empty file.

The recorded Host maps 11 of 11 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[Pick](#pick) · [List](#list) · [Stat](#stat) · [Read](#read) · [WriteAtomic](#writeatomic) · [Watch](#watch) · [PrepareMove](#preparemove) · [Move](#move) · [PrepareDelete](#preparedelete) · [Delete](#delete) · [OpenPackageFile](#openpackagefile)

### Pick

[`FilePick`](models/filepick.md) → [`FileRef`](models/fileref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Operation |
| Permission | `nexa.files.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Title` | [`LocalizedText`](models/localizedtext.md) | Structured LocalizedText value; follow its linked field contract. |
| `Kind` | [`FilePickKind`](models.md#filepickkind) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Extensions` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

An opaque file reference within the granted or package scope. It does not grant access to neighboring files.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Files_Pick(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Files_Pick_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### List

[`FileQuery`](models/filequery.md) → `Page<FileStat>` ([wrapper](models.md#containers), [item](models/filestat.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Query |
| Permission | `nexa.files.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Directory` | [`FileRef`](models/fileref.md) | Structured FileRef value; follow its linked field contract. |
| `Page` | [`PageRequest`](models/pagerequest.md) | Structured PageRequest value; follow its linked field contract. |

**Successful result**

Read Items and continue with NextCursor while preserving the original query. An absent cursor ends the sequence; an invalid cursor is an error.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Files_List(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Files_List_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Stat

[`FileRef`](models/fileref.md) → [`FileStat`](models/filestat.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Query |
| Permission | `nexa.files.read` |
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
nx_Files_Stat(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Files_Stat_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Read

[`FileRead`](models/fileread.md) → [`BlobRef`](models/blobref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Query |
| Permission | `nexa.files.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `File` | [`FileRef`](models/fileref.md) | Structured FileRef value; follow its linked field contract. |
| `Offset` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Length` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

The Host retains bytes under an opaque, owned blob handle. It is not the bytes themselves and is not portable across loads.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Files_Read(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Files_Read_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### WriteAtomic

[`FileWrite`](models/filewrite.md) → [`FileStat`](models/filestat.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Mutation |
| Permission | `nexa.files.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `File` | [`FileRef`](models/fileref.md) | Structured FileRef value; follow its linked field contract. |
| `Data` | [`BlobRef`](models/blobref.md) | Structured BlobRef value; follow its linked field contract. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Files_WriteAtomic(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Files_WriteAtomic_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Watch

[`FileRef`](models/fileref.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Subscription |
| Permission | `nexa.files.read` |
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

Retain the subscription identity, consume bounded batches or callbacks as specified, handle gaps, and release it when no longer needed.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Files_Watch(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Files_Watch_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PrepareMove

[`FileMove`](models/filemove.md) → [`MutationPlan`](models/mutationplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Query |
| Permission | `nexa.files.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `File` | [`FileRef`](models/fileref.md) | Structured FileRef value; follow its linked field contract. |
| `Destination` | [`FileRef`](models/fileref.md) | Structured FileRef value; follow its linked field contract. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

Retain the exact plan ID and revision, review its bound inputs and confirmation requirement, then use the corresponding commit operation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Files_PrepareMove(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Files_PrepareMove_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Move

[`PlanRequest`](models/planrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Operation |
| Permission | `nexa.files.write` |
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
nx_Files_Move(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Files_Move_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PrepareDelete

[`FileDelete`](models/filedelete.md) → [`MutationPlan`](models/mutationplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Query |
| Permission | `nexa.files.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `File` | [`FileRef`](models/fileref.md) | Structured FileRef value; follow its linked field contract. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |
| `Recursive` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Retain the exact plan ID and revision, review its bound inputs and confirmation requirement, then use the corresponding commit operation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Files_PrepareDelete(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Files_PrepareDelete_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Delete

[`PlanRequest`](models/planrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Operation |
| Permission | `nexa.files.write` |
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
nx_Files_Delete(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Files_Delete_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### OpenPackageFile

[`PackageFileRequest`](models/packagefilerequest.md) → [`FileRef`](models/fileref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `11` |
| Kind | Query |
| Permission | `nexa.files.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

Path is a normalized relative payload path, such as page.nxml. It must identify an admitted package asset. The returned FileRef can be passed to UI registration; it does not grant access to the surrounding installation directory.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Path` | `string` | Normalized relative path of an admitted package payload, for example page.nxml. |

**Successful result**

An opaque file reference within the granted or package scope. It does not grant access to neighboring files.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Files_OpenPackageFile(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Files_OpenPackageFile_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/files.md) · Apache-2.0.
