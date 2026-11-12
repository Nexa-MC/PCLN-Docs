# Tasks

Create and observe bounded records of work. A task communicates progress and terminal results; it is not permission to perform the underlying business action.

Contract: `nexa.tasks/100`. [API index](index.md).

## Typical sequence

For plugin-owned work, CreateOwned, Report progress, then Complete or Fail exactly as the result warrants. For Host work, read/watch the returned operation and request cancellation through its supported route.

## Behavior and limits

Dismiss terminal records when no longer needed. Retry is not mapped in the current Desktop snapshot; a generic retry button must not replay unknown effects with fresh keys.

The recorded Host maps 10 of 10 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[CreateOwned](#createowned) · [Report](#report) · [Complete](#complete) · [Fail](#fail) · [List](#list) · [Read](#read) · [Watch](#watch) · [Cancel](#cancel) · [Retry](#retry) · [Dismiss](#dismiss)

### CreateOwned

[`TaskCreate`](models/taskcreate.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Mutation |
| Permission | `nexa.tasks.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Title` | [`LocalizedText`](models/localizedtext.md) | Structured LocalizedText value; follow its linked field contract. |
| `Operation` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Cancellable` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Tasks_CreateOwned(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Tasks_CreateOwned_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Report

[`TaskProgress`](models/taskprogress.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Mutation |
| Permission | `nexa.tasks.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Task` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Stage` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Progress` | `double` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Tasks_Report(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Tasks_Report_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Complete

[`TaskCompletion`](models/taskcompletion.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Mutation |
| Permission | `nexa.tasks.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Task` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Result` | `AbiValue` | Typed operation output. It is meaningful only when the operation state and result schema permit reading it. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Tasks_Complete(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Tasks_Complete_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Fail

[`TaskFailure`](models/taskfailure.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Mutation |
| Permission | `nexa.tasks.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Task` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Error` | [`OperationFailure`](models/operationfailure.md) | Structured OperationFailure value; follow its linked field contract. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Tasks_Fail(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Tasks_Fail_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### List

[`PageRequest`](models/pagerequest.md) → `Page<OperationRecord>` ([wrapper](models.md#containers), [item](models/operationrecord.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Query |
| Permission | `nexa.tasks.read` |
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
nx_Tasks_List(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Tasks_List_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Read

[`EntityRequest`](models/entityrequest.md) → [`OperationRecord`](models/operationrecord.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Query |
| Permission | `nexa.tasks.read` |
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
nx_Tasks_Read(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Tasks_Read_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Watch

[`WatchRequest`](models/watchrequest.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Subscription |
| Permission | `nexa.tasks.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Target` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Cursor` | `string?` | Opaque continuation or observation cursor. Reuse only in the issuing query/scope; absence and invalidity are different. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |

**Successful result**

Retain the subscription identity, consume bounded batches or callbacks as specified, handle gaps, and release it when no longer needed.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Tasks_Watch(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Tasks_Watch_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Cancel

[`OperationRequest`](models/operationrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Mutation |
| Permission | `nexa.tasks.write` |
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
nx_Tasks_Cancel(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Tasks_Cancel_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Retry

[`OperationRequest`](models/operationrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Mutation |
| Permission | `nexa.tasks.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Retry an owned failed/cancelled task where the owner defines replay semantics. Plugin-created tasks reset to Pending under the same ID and a new revision; the plugin must perform and report the work again. Failed workflows use the workflow journal and its recovery rules. Running/completed tasks, foreign tasks and unknown outcomes are rejected. Arbitrary Host file/network/game operations are not implicitly replayed; prepare a new domain plan instead.

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
nx_Tasks_Retry(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Tasks_Retry_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Dismiss

[`EntityRequest`](models/entityrequest.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Mutation |
| Permission | `nexa.tasks.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

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
nx_Tasks_Dismiss(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Tasks_Dismiss_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/tasks.md) · Apache-2.0.
