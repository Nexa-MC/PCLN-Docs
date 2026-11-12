> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../index.md)。

# Commands

Discover and execute Host-exposed commands through typed action contracts. A command ID names a public operation, not an arbitrary shell command or executable.

Contract: `nexa.commands/100`. [API index](index.md).

## Typical sequence

List or describe the command, validate its input schema, then Execute with the same target and inputs the user reviewed. Execution returns an operation to observe.

## Behavior and limits

An unavailable command remains unavailable even if a similarly named UI control exists. Do not fall back to process execution or private UI access.

The recorded Host maps 3 of 3 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[List](#list) · [Describe](#describe) · [Execute](#execute)

### List

[`PageRequest`](models/pagerequest.md) → `Page<ActionDescriptor>` ([wrapper](models.md#containers), [item](models/actiondescriptor.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Query |
| Permission | `nexa.commands.read` |
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
nx_Commands_List(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Commands_List_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Describe

[`QualifiedRequest`](models/qualifiedrequest.md) → [`ActionDescriptor`](models/actiondescriptor.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Query |
| Permission | `nexa.commands.read` |
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
nx_Commands_Describe(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Commands_Describe_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Execute

[`ActionRequest`](models/actionrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Operation |
| Permission | `nexa.commands.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Action` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Target` | [`ScopedTarget`](models/scopedtarget.md) | Structured ScopedTarget value; follow its linked field contract. |
| `Inputs` | `AbiValue` | Typed input value encoded under the declared input schema. |
| `ExpectedRevision` | `Revision?` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `IdempotencyKey` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Commands_Execute(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Commands_Execute_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/api/commands.md) · Apache-2.0.
