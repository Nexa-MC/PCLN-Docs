> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../index.md)。

# Minecraft.Servers

Manage the saved server list, query status, discover LAN announcements and request joining through the launcher. Discovery and status are observations, not launch authorization.

Contract: `nexa.minecraft.servers/100`. [API index](index.md).

## Typical sequence

Preserve the saved list’s revision when updating it. Read status through the Host resolver; consume LAN discovery as a subscription and handle disappearance or gaps.

## Behavior and limits

An unreachable status probe is not definitive proof a server never accepts clients. Joining still requires a compatible instance and account; do not convert a server address into arbitrary process arguments.

The recorded Host maps 5 of 5 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[ListSaved](#listsaved) · [SaveList](#savelist) · [ReadStatus](#readstatus) · [DiscoverLan](#discoverlan) · [Join](#join)

### ListSaved

[`Empty`](models/empty.md) → [`ServerList`](models/serverlist.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Query |
| Permission | `nexa.minecraft.servers.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

This model has no fields. Send its encoded empty object, not an arbitrary Null value.

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Servers_ListSaved(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Servers_ListSaved_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### SaveList

[`ServerList`](models/serverlist.md) → [`ServerList`](models/serverlist.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Mutation |
| Permission | `nexa.minecraft.servers.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Servers` | [`ServerRecord[]`](models/serverrecord.md) | Structured ServerRecord value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Revision` | `Revision` | Opaque version token issued by the owner. Do not increment it or substitute another object’s revision. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Servers_SaveList(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Servers_SaveList_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadStatus

[`EntityRequest`](models/entityrequest.md) → [`ServerStatus`](models/serverstatus.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Query |
| Permission | `nexa.minecraft.servers.read` |
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
nx_Minecraft_Servers_ReadStatus(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Servers_ReadStatus_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### DiscoverLan

[`Empty`](models/empty.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Subscription |
| Permission | `nexa.minecraft.servers.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

This model has no fields. Send its encoded empty object, not an arbitrary Null value.

**Successful result**

Retain the subscription identity, consume bounded batches or callbacks as specified, handle gaps, and release it when no longer needed.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Servers_DiscoverLan(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Servers_DiscoverLan_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Join

[`ServerJoinRequest`](models/serverjoinrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Operation |
| Permission | `nexa.minecraft.servers.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Server` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Intent` | [`LaunchIntent`](models/launchintent.md) | Structured LaunchIntent value; follow its linked field contract. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Servers_Join(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Servers_Join_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/minecraft-servers.md) · Apache-2.0.
