# Minecraft.Processes

Observe game sessions owned by the launcher and request session lifecycle actions. A session ID is not a raw operating-system PID.

Contract: `nexa.minecraft.processes/100`. [API index](index.md).

## Typical sequence

List sessions, read a selected session, and subscribe to bounded log or metric updates. Use RequestClose for the supported graceful path; Stop has separate termination semantics.

## Behavior and limits

Missing metrics are not measured zero. A log subscription can lose history; use the supported range read and gap handling. Closing a launcher view must not imply killing a game session.

The recorded Host maps 9 of 9 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[ListSessions](#listsessions) · [ReadSession](#readsession) · [WatchSession](#watchsession) · [SubscribeLog](#subscribelog) · [ReadLogRange](#readlogrange) · [RequestClose](#requestclose) · [Stop](#stop) · [RevealWindow](#revealwindow) · [ReadMetrics](#readmetrics)

### ListSessions

[`PageRequest`](models/pagerequest.md) → `Page<GameSession>` ([wrapper](models.md#containers), [item](models/gamesession.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Query |
| Permission | `nexa.minecraft.processes.read` |
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
nx_Minecraft_Processes_ListSessions(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Processes_ListSessions_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadSession

[`EntityRequest`](models/entityrequest.md) → [`GameSession`](models/gamesession.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Query |
| Permission | `nexa.minecraft.processes.read` |
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
nx_Minecraft_Processes_ReadSession(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Processes_ReadSession_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### WatchSession

[`WatchRequest`](models/watchrequest.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Subscription |
| Permission | `nexa.minecraft.processes.read` |
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
nx_Minecraft_Processes_WatchSession(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Processes_WatchSession_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### SubscribeLog

[`LogRangeRequest`](models/lograngerequest.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Subscription |
| Permission | `nexa.minecraft.processes.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Session` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Cursor` | `string?` | Opaque continuation or observation cursor. Reuse only in the issuing query/scope; absence and invalidity are different. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Limit` | `long` | Requested bound on returned items. The Host may impose a smaller domain-specific limit. |

**Successful result**

Retain the subscription identity, consume bounded batches or callbacks as specified, handle gaps, and release it when no longer needed.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Processes_SubscribeLog(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Processes_SubscribeLog_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadLogRange

[`LogRangeRequest`](models/lograngerequest.md) → [`LogChunk`](models/logchunk.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Query |
| Permission | `nexa.minecraft.processes.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Session` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Cursor` | `string?` | Opaque continuation or observation cursor. Reuse only in the issuing query/scope; absence and invalidity are different. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Limit` | `long` | Requested bound on returned items. The Host may impose a smaller domain-specific limit. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Processes_ReadLogRange(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Processes_ReadLogRange_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RequestClose

[`EntityRequest`](models/entityrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Operation |
| Permission | `nexa.minecraft.processes.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

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
nx_Minecraft_Processes_RequestClose(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Processes_RequestClose_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Stop

[`EntityRequest`](models/entityrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Operation |
| Permission | `nexa.minecraft.processes.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

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
nx_Minecraft_Processes_Stop(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Processes_Stop_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RevealWindow

[`EntityRequest`](models/entityrequest.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Mutation |
| Permission | `nexa.minecraft.processes.write` |
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
nx_Minecraft_Processes_RevealWindow(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Processes_RevealWindow_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadMetrics

[`EntityRequest`](models/entityrequest.md) → [`SessionMetrics`](models/sessionmetrics.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Query |
| Permission | `nexa.minecraft.processes.read` |
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
nx_Minecraft_Processes_ReadMetrics(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Processes_ReadMetrics_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/minecraft-processes.md) · Apache-2.0.
