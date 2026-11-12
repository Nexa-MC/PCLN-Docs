# Network

Perform authorized network operations with explicit request/connection identities, bounded payloads and cancellation. This capability is not unrestricted socket access.

Contract: `nexa.network/100`. [API index](index.md).

## Typical sequence

Use the Host’s approved request or connection route, read bounded responses, and close owned connections when finished. Receiving consumes external state and is restricted to Active.

## Behavior and limits

Timeout can leave an external mutation outcome unknown. A redirect or resolved address remains subject to Host policy; do not retry through another transport to bypass a denied destination.

The recorded Host maps 8 of 8 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[Request](#request) · [OpenResponseStream](#openresponsestream) · [Cancel](#cancel) · [OpenConnection](#openconnection) · [Listen](#listen) · [Send](#send) · [Receive](#receive) · [Close](#close)

### Request

[`NetworkRequest`](models/networkrequest.md) → [`NetworkResponse`](models/networkresponse.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Operation |
| Permission | `nexa.network.write` |
| Legal phases | Active |
| Idempotency | OutcomeMayBeUnknown |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Uri` | `UriRef` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Method` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Headers` | [`NamedValue[]`](models/namedvalue.md) | Structured NamedValue value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Body` | [`BlobRef?`](models/blobref.md) | Structured BlobRef value; follow its linked field contract. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Credential` | [`CredentialRef?`](models/credentialref.md) | Structured CredentialRef value; follow its linked field contract. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. An interrupted external effect can have an unknown outcome; reconcile before issuing another effect. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Network_Request(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Network_Request_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### OpenResponseStream

[`EntityRequest`](models/entityrequest.md) → [`BlobRef`](models/blobref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Operation |
| Permission | `nexa.network.write` |
| Legal phases | Active |
| Idempotency | OutcomeMayBeUnknown |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

The Host retains bytes under an opaque, owned blob handle. It is not the bytes themselves and is not portable across loads.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. An interrupted external effect can have an unknown outcome; reconcile before issuing another effect. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Network_OpenResponseStream(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Network_OpenResponseStream_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Cancel

[`OperationRequest`](models/operationrequest.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Mutation |
| Permission | `nexa.network.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Operation` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Network_Cancel(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Network_Cancel_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### OpenConnection

[`NetworkConnectionRequest`](models/networkconnectionrequest.md) → [`NetworkConnection`](models/networkconnection.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Operation |
| Permission | `nexa.network.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Protocol` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Address` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Port` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Scope` | `string` | Explicit target scope. The Host checks that the caller is authorized for it. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Network_OpenConnection(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Network_OpenConnection_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Listen

[`NetworkConnectionRequest`](models/networkconnectionrequest.md) → [`NetworkConnection`](models/networkconnection.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Operation |
| Permission | `nexa.network.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Protocol` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Address` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Port` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Scope` | `string` | Explicit target scope. The Host checks that the caller is authorized for it. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Network_Listen(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Network_Listen_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Send

[`NetworkSend`](models/networksend.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Mutation |
| Permission | `nexa.network.write` |
| Legal phases | Active |
| Idempotency | OutcomeMayBeUnknown |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Connection` | [`NetworkConnection`](models/networkconnection.md) | Structured NetworkConnection value; follow its linked field contract. |
| `Data` | [`BlobRef`](models/blobref.md) | Structured BlobRef value; follow its linked field contract. |
| `Destination` | `string?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. An interrupted external effect can have an unknown outcome; reconcile before issuing another effect. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Network_Send(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Network_Send_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Receive

[`NetworkReceive`](models/networkreceive.md) → [`NetworkPacket`](models/networkpacket.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Operation |
| Permission | `nexa.network.write` |
| Legal phases | Active |
| Idempotency | OutcomeMayBeUnknown |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Connection` | [`NetworkConnection`](models/networkconnection.md) | Structured NetworkConnection value; follow its linked field contract. |
| `MaximumBytes` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. An interrupted external effect can have an unknown outcome; reconcile before issuing another effect. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Network_Receive(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Network_Receive_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Close

[`NetworkConnection`](models/networkconnection.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Mutation |
| Permission | `nexa.network.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Protocol` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Scope` | `string` | Explicit target scope. The Host checks that the caller is authorized for it. |
| `LoadInstanceId` | `Guid` | Identity of the admitted load that owns this handle; it is not portable to a replacement load. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Network_Close(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Network_Close_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/network.md) · Apache-2.0.
