# Schedules

Trigger an owned workflow at a declared time, interval or event. Scheduling determines when work is requested; the workflow still performs normal authority checks.

Contract: `nexa.schedules/100`. [API index](index.md).

## Typical sequence

Register the schedule with a valid timezone and trigger definition. Enable or disable it explicitly, inspect ReadNextRun, and use TriggerNow for an intentional manual run.

## Behavior and limits

Missed-trigger policies govern backlog, not exactly-once effects. Disabling or stopping fences future dispatch; it does not undo effects already completed by a run.

The recorded Host maps 6 of 6 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[Register](#register) · [List](#list) · [Enable](#enable) · [Disable](#disable) · [TriggerNow](#triggernow) · [ReadNextRun](#readnextrun)

### Register

[`ScheduleDefinition`](models/scheduledefinition.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Registration |
| Permission | `nexa.schedules.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Workflow` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Trigger` | [`ScheduleTrigger`](models.md#scheduletrigger) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `TimeZone` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `At` | `DateTimeOffset?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `IntervalMilliseconds` | `long?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Event` | `QualifiedId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Missed` | [`MissedSchedulePolicy`](models.md#missedschedulepolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `ReplayLimit` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `DebounceMilliseconds` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Schedules_Register(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Schedules_Register_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### List

[`PageRequest`](models/pagerequest.md) → `Page<ScheduleState>` ([wrapper](models.md#containers), [item](models/schedulestate.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Query |
| Permission | `nexa.schedules.read` |
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
nx_Schedules_List(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Schedules_List_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Enable

[`QualifiedRequest`](models/qualifiedrequest.md) → [`ScheduleState`](models/schedulestate.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Mutation |
| Permission | `nexa.schedules.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Schedules_Enable(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Schedules_Enable_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Disable

[`QualifiedRequest`](models/qualifiedrequest.md) → [`ScheduleState`](models/schedulestate.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Mutation |
| Permission | `nexa.schedules.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Schedules_Disable(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Schedules_Disable_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### TriggerNow

[`QualifiedRequest`](models/qualifiedrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Operation |
| Permission | `nexa.schedules.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Schedules_TriggerNow(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Schedules_TriggerNow_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadNextRun

[`QualifiedRequest`](models/qualifiedrequest.md) → [`ScheduleState`](models/schedulestate.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Query |
| Permission | `nexa.schedules.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Schedules_ReadNextRun(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Schedules_ReadNextRun_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/schedules.md) · Apache-2.0.
