# Predicates

Declare and evaluate bounded conditions for workflows and other authorized consumers. A predicate computes a result; it must not smuggle a mutation into a query callback.

Contract: `nexa.predicates/100`. [API index](index.md).

## Typical sequence

Register the input schema and handler or supported expression, then evaluate with matching inputs. The runtime supports a closed expression grammar rather than arbitrary source evaluation.

## Behavior and limits

Treat an evaluation failure separately from false. A missing capability, bad schema or retired handler is not evidence that the business condition is false.

The recorded Host maps 3 of 3 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[Register](#register) · [Evaluate](#evaluate) · [Describe](#describe)

### Register

[`PredicateDefinition`](models/predicatedefinition.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Registration |
| Permission | `nexa.predicates.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Input` | [`SchemaRef`](models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `Handler` | `ulong?` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Expression` | `AbiValue` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Predicates_Register(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Predicates_Register_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Evaluate

[`PredicateRequest`](models/predicaterequest.md) → [`PredicateResult`](models/predicateresult.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Query |
| Permission | `nexa.predicates.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Inputs` | `AbiValue` | Typed input value encoded under the declared input schema. |
| `Consistency` | `Revision` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Predicates_Evaluate(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Predicates_Evaluate_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Describe

[`QualifiedRequest`](models/qualifiedrequest.md) → [`PredicateDefinition`](models/predicatedefinition.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Query |
| Permission | `nexa.predicates.read` |
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
nx_Predicates_Describe(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Predicates_Describe_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/predicates.md) · Apache-2.0.
