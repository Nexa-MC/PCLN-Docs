# Events

Publish typed events and subscribe with explicit delivery and resumption behavior. Event payloads describe observations; the Host supplies trusted origin and invocation identity.

Contract: `nexa.events/100`. [API index](index.md).

## Typical sequence

Define the event contract, subscribe during the permitted registration stage, and publish only with the declared schema and scope. Keep the returned subscription identity for cleanup.

## Behavior and limits

Callbacks may repeat under at-least-once delivery. Handle resynchronization after gaps and retention loss. Use the matching subscription-based unsubscribe operation instead of reinterpreting a subscription as a registration.

The recorded Host maps 7 of 7 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[Describe](#describe) · [Subscribe](#subscribe) · [Define](#define) · [Publish](#publish) · [Unsubscribe](#unsubscribe) · [UnsubscribeSubscription](#unsubscribesubscription) · [RegisterSubscription](#registersubscription)

### Describe

[`QualifiedRequest`](models/qualifiedrequest.md) → [`EventDescriptor`](models/eventdescriptor.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Query |
| Permission | `nexa.events.read` |
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
nx_Events_Describe(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Events_Describe_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Subscribe

[`EventSubscribeRequest`](models/eventsubscriberequest.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Registration |
| Permission | `nexa.events.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Event` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Cursor` | `string?` | Opaque continuation or observation cursor. Reuse only in the issuing query/scope; absence and invalidity are different. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Handler` | `ulong` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. |
| `IgnoreSelf` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Deduplicate` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Scope` | [`ScopedTarget`](models/scopedtarget.md) | Explicit target scope. The Host checks that the caller is authorized for it. |
| `Lifetime` | [`SubscriptionLifetime`](models.md#subscriptionlifetime) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Reentry` | [`ReentryPolicy`](models.md#reentrypolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `QueueLimit` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Retain the subscription identity, consume bounded batches or callbacks as specified, handle gaps, and release it when no longer needed.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Events_Subscribe(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Events_Subscribe_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Define

[`EventDescriptor`](models/eventdescriptor.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Registration |
| Permission | `nexa.events.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `OrderingPartition` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Delivery` | [`DeliveryGuarantee`](models.md#deliveryguarantee) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Durable` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `QueueLimit` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Events_Define(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Events_Define_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Publish

[`EventEnvelope`](models/eventenvelope.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Mutation |
| Permission | `nexa.events.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `EventId` | `Guid` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Event` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Entity` | `EntityId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Revision` | `Revision` | Opaque version token issued by the owner. Do not increment it or substitute another object’s revision. |
| `OccurredAt` | `DateTimeOffset` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `CorrelationId` | `Guid` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `CausationId` | `Guid?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Origin` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Scope` | [`ScopedTarget`](models/scopedtarget.md) | Explicit target scope. The Host checks that the caller is authorized for it. |
| `Payload` | `AbiValue` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Events_Publish(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Events_Publish_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Unsubscribe

[`RegistrationRequest`](models/registrationrequest.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Mutation |
| Permission | `nexa.events.write` |
| Legal phases | Active, Stop |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

This historical current-catalog method accepts RegistrationRequest, not SubscriptionRef. Use UnsubscribeSubscription for a handle returned by Subscribe, or RegisterSubscription when both identities are needed. Never reinterpret one handle as the other.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Registration` | [`RegistrationRef`](models/registrationref.md) | Structured RegistrationRef value; follow its linked field contract. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Events_Unsubscribe(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Events_Unsubscribe_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### UnsubscribeSubscription

[`SubscriptionRef`](models/subscriptionref.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `11` |
| Kind | Mutation |
| Permission | `nexa.events.write` |
| Legal phases | Active, Stop |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Accepts the actual SubscriptionRef returned by Subscribe. This additive operation resolves the historical mismatch between Subscribe and Unsubscribe.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Token` | `Guid` | Opaque Host-issued handle token. Keep it with its owner and resource type. |
| `LoadInstanceId` | `Guid` | Identity of the admitted load that owns this handle; it is not portable to a replacement load. |
| `Cursor` | `string?` | Opaque continuation or observation cursor. Reuse only in the issuing query/scope; absence and invalidity are different. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `ResyncRequired` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Events_UnsubscribeSubscription(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Events_UnsubscribeSubscription_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterSubscription

[`EventSubscribeRequest`](models/eventsubscriberequest.md) → [`EventSubscriptionRegistration`](models/eventsubscriptionregistration.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `12` |
| Kind | Registration |
| Permission | `nexa.events.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Returns EventSubscriptionRegistration, carrying the subscription and registration identities explicitly. Retain the correct member for each cleanup API.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Event` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Cursor` | `string?` | Opaque continuation or observation cursor. Reuse only in the issuing query/scope; absence and invalidity are different. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Handler` | `ulong` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. |
| `IgnoreSelf` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Deduplicate` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Scope` | [`ScopedTarget`](models/scopedtarget.md) | Explicit target scope. The Host checks that the caller is authorized for it. |
| `Lifetime` | [`SubscriptionLifetime`](models.md#subscriptionlifetime) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Reentry` | [`ReentryPolicy`](models.md#reentrypolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `QueueLimit` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Events_RegisterSubscription(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Events_RegisterSubscription_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/events.md) · Apache-2.0.
