# State

Expose a current, revisioned value and observe changes. State is useful for a view of current data; event history and private durable storage serve different purposes.

Contract: `nexa.state/100`. [API index](index.md).

## Typical sequence

Define the owned state and schema, then read a snapshot before a conditional update. Pass the exact returned revision to CompareExchangeOwned and reconcile conflicts.

## Behavior and limits

A watch can report a gap; recover with a fresh Read. Uninitialized state is explicit and must not be confused with a failed read or with a valid empty value.

The recorded Host maps 6 of 6 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[Describe](#describe) · [Read](#read) · [Watch](#watch) · [DefineOwned](#defineowned) · [UpdateOwned](#updateowned) · [CompareExchangeOwned](#compareexchangeowned)

### Describe

[`QualifiedRequest`](models/qualifiedrequest.md) → [`StateDescriptor`](models/statedescriptor.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Query |
| Permission | `nexa.state.read` |
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
nx_State_Describe(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_State_Describe_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Read

[`StateReadRequest`](models/statereadrequest.md) → [`StateSnapshot`](models/statesnapshot.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Query |
| Permission | `nexa.state.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Scope` | [`ScopedTarget`](models/scopedtarget.md) | Explicit target scope. The Host checks that the caller is authorized for it. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_State_Read(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_State_Read_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Watch

[`StateReadRequest`](models/statereadrequest.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Subscription |
| Permission | `nexa.state.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Scope` | [`ScopedTarget`](models/scopedtarget.md) | Explicit target scope. The Host checks that the caller is authorized for it. |

**Successful result**

Retain the subscription identity, consume bounded batches or callbacks as specified, handle gaps, and release it when no longer needed.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_State_Watch(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_State_Watch_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### DefineOwned

[`StateDescriptor`](models/statedescriptor.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Registration |
| Permission | `nexa.state.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Scope` | [`ScopedTarget`](models/scopedtarget.md) | Explicit target scope. The Host checks that the caller is authorized for it. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_State_DefineOwned(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_State_DefineOwned_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### UpdateOwned

[`StateUpdate`](models/stateupdate.md) → [`StateSnapshot`](models/statesnapshot.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Mutation |
| Permission | `nexa.state.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Scope` | [`ScopedTarget`](models/scopedtarget.md) | Explicit target scope. The Host checks that the caller is authorized for it. |
| `Value` | `AbiValue` | Payload interpreted using the accompanying or declared schema; Null is not a substitute for an error. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_State_UpdateOwned(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_State_UpdateOwned_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### CompareExchangeOwned

[`StateUpdate`](models/stateupdate.md) → [`StateSnapshot`](models/statesnapshot.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Mutation |
| Permission | `nexa.state.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Use the revision from the latest authoritative snapshot. On conflict, re-read and reconcile; do not increment or synthesize a revision token.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Scope` | [`ScopedTarget`](models/scopedtarget.md) | Explicit target scope. The Host checks that the caller is authorized for it. |
| `Value` | `AbiValue` | Payload interpreted using the accompanying or declared schema; Null is not a substitute for an error. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_State_CompareExchangeOwned(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_State_CompareExchangeOwned_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/state.md) · Apache-2.0.
