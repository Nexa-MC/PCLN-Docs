> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../index.md)。

# Resources

Register cleanup and release owned registrations or subscriptions. This group coordinates specific resource kinds; it is not a universal release API for every opaque value.

Contract: `nexa.resources/100`. [API index](index.md).

## Typical sequence

Retain each acquisition’s actual handle type. ReadSubscription consumes a bounded batch, so retain the same key while resolving an uncertain read. Release a subscription when it is no longer needed.

## Behavior and limits

A gap requires a new authoritative snapshot or domain-specific resynchronization. Stopped loads cannot reuse prior handles; do not cast blobs or files to RegistrationRef.

The recorded Host maps 4 of 4 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[RegisterCleanup](#registercleanup) · [Release](#release) · [ReadSubscription](#readsubscription) · [ReleaseSubscription](#releasesubscription)

### RegisterCleanup

[`CleanupRequest`](models/cleanuprequest.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Registration |
| Permission | `nexa.resources.write` |
| Legal phases | PreInitialize, Initialize, PostInitialize, Checkup, Finalize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Callback` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Resources_RegisterCleanup(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Resources_RegisterCleanup_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Release

[`RegistrationRequest`](models/registrationrequest.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Mutation |
| Permission | `nexa.resources.write` |
| Legal phases | PreInitialize, Initialize, PostInitialize, Checkup, Finalize, Active, Abort, Stop |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

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
nx_Resources_Release(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Resources_Release_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadSubscription

[`SubscriptionRead`](models/subscriptionread.md) → [`SubscriptionBatch`](models/subscriptionbatch.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Mutation |
| Permission | `nexa.resources.read` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

The current runtime consumes up to 256 queued items. Repeat an uncertain read with the same idempotency key to retrieve the corresponding batch; a new key is a new consumption request.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Subscription` | [`SubscriptionRef`](models/subscriptionref.md) | Structured SubscriptionRef value; follow its linked field contract. |
| `Limit` | `long` | Requested bound on returned items. The Host may impose a smaller domain-specific limit. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Resources_ReadSubscription(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Resources_ReadSubscription_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReleaseSubscription

[`SubscriptionRef`](models/subscriptionref.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Mutation |
| Permission | `nexa.resources.write` |
| Legal phases | Active, Stop |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

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
nx_Resources_ReleaseSubscription(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Resources_ReleaseSubscription_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/resources.md) · Apache-2.0.
