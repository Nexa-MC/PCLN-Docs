> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../index.md)。

# Actions

Expose a named, typed operation that the Host can invoke with the declared effects and confirmation policy. An action connects a descriptor to a callback; a registered callback alone is not a public action.

Contract: `nexa.actions/100`. [API index](index.md).

## Typical sequence

Register the descriptor during initialization. Call Invoke after activation with matching inputs and the required idempotency key. Inspect the returned operation through Tasks.

## Behavior and limits

Confirmation occurs before handler dispatch. Decline must not invoke the handler. Reusing a mutation key with changed inputs is a conflict; an unknown result must not be replayed with a new key.

The recorded Host maps 3 of 3 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[Register](#register) · [Describe](#describe) · [Invoke](#invoke)

### Register

[`ActionDescriptor`](models/actiondescriptor.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Registration |
| Permission | `nexa.actions.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Input` | [`SchemaRef`](models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `Output` | [`SchemaRef`](models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `RequiredCapabilities` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Scopes` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Idempotency` | [`IdempotencyMode`](models.md#idempotencymode) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Cancellable` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `SupportsPreview` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Confirmation` | [`ConfirmationRequirement`](models.md#confirmationrequirement) | Declared confirmation requirement. The Host owns the prompt and decision. |
| `Compensation` | `QualifiedId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Title` | [`LocalizedText`](models/localizedtext.md) | Structured LocalizedText value; follow its linked field contract. |
| `Handler` | `ulong?` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Actions_Register(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Actions_Register_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Describe

[`QualifiedRequest`](models/qualifiedrequest.md) → [`ActionDescriptor`](models/actiondescriptor.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Query |
| Permission | `nexa.actions.read` |
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
nx_Actions_Describe(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Actions_Describe_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Invoke

[`ActionRequest`](models/actionrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Operation |
| Permission | `nexa.actions.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

The Host can request user confirmation before dispatch. A declined or cancelled prompt must not run the handler. The OperationRef is for observing the action result, not proof of callback success.

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
nx_Actions_Invoke(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Actions_Invoke_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/zh-CN/api/actions.md) · Apache-2.0.
