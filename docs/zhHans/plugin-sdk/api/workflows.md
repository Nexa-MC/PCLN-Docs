> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../index.md)。

# Workflows

Compose registered actions and predicates into bounded, observable work. Workflow definitions describe ordering, branches, retries and recovery; they do not bypass each node’s permissions.

Contract: `nexa.workflows/100`. [API index](index.md).

## Typical sequence

Register and validate the definition before activation. Start with typed inputs, then read or watch the operation. Persistent recovery requires the saved revision, unchanged definition and compatible inputs.

## Behavior and limits

Resume known progress only. OUTCOME_UNKNOWN records an effect whose result cannot be established; it is not a failed step that is automatically safe to retry.

The recorded Host maps 12 of 12 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[Register](#register) · [Validate](#validate) · [Preview](#preview) · [Start](#start) · [Read](#read) · [Watch](#watch) · [Cancel](#cancel) · [ListRuns](#listruns) · [Resume](#resume) · [RetryStep](#retrystep) · [ExplainPlan](#explainplan) · [ReadRunTrace](#readruntrace)

### Register

[`WorkflowDefinition`](models/workflowdefinition.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Registration |
| Permission | `nexa.workflows.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Input` | [`SchemaRef`](models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `Output` | [`SchemaRef`](models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `Nodes` | [`WorkflowNode[]`](models/workflownode.md) | Structured WorkflowNode value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `DefinitionDigest` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Persistent` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Concurrency` | [`ConcurrencyPolicy`](models.md#concurrencypolicy) | Declared execution policy. A provider family may reject enum members whose semantics it does not implement. |
| `MaximumDepth` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `MaximumWork` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Workflows_Register(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Workflows_Register_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Validate

[`WorkflowDefinition`](models/workflowdefinition.md) → [`ValidationReport`](models/validationreport.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Query |
| Permission | `nexa.workflows.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Input` | [`SchemaRef`](models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `Output` | [`SchemaRef`](models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `Nodes` | [`WorkflowNode[]`](models/workflownode.md) | Structured WorkflowNode value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `DefinitionDigest` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Persistent` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Concurrency` | [`ConcurrencyPolicy`](models.md#concurrencypolicy) | Declared execution policy. A provider family may reject enum members whose semantics it does not implement. |
| `MaximumDepth` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `MaximumWork` | `long` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Workflows_Validate(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Workflows_Validate_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Preview

[`WorkflowRequest`](models/workflowrequest.md) → [`MutationPlan`](models/mutationplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Query |
| Permission | `nexa.workflows.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Workflow` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Inputs` | `AbiValue` | Typed input value encoded under the declared input schema. |
| `DefinitionDigest` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Retain the exact plan ID and revision, review its bound inputs and confirmation requirement, then use the corresponding commit operation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Workflows_Preview(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Workflows_Preview_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Start

[`WorkflowRequest`](models/workflowrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Operation |
| Permission | `nexa.workflows.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Workflow` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Inputs` | `AbiValue` | Typed input value encoded under the declared input schema. |
| `DefinitionDigest` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Workflows_Start(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Workflows_Start_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Read

[`EntityRequest`](models/entityrequest.md) → [`OperationRecord`](models/operationrecord.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Query |
| Permission | `nexa.workflows.read` |
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
nx_Workflows_Read(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Workflows_Read_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Watch

[`WatchRequest`](models/watchrequest.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Subscription |
| Permission | `nexa.workflows.read` |
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
nx_Workflows_Watch(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Workflows_Watch_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Cancel

[`OperationRequest`](models/operationrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Mutation |
| Permission | `nexa.workflows.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Operation` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Workflows_Cancel(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Workflows_Cancel_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ListRuns

[`PageRequest`](models/pagerequest.md) → `Page<OperationRecord>` ([wrapper](models.md#containers), [item](models/operationrecord.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Query |
| Permission | `nexa.workflows.read` |
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
nx_Workflows_ListRuns(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Workflows_ListRuns_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Resume

[`WorkflowRunRequest`](models/workflowrunrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Operation |
| Permission | `nexa.workflows.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Recovery requires the saved run revision and unchanged workflow definition/input. An unknown effect cannot be converted to a known failed step and automatically replayed.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Run` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |
| `DefinitionDigest` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Workflows_Resume(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Workflows_Resume_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RetryStep

[`WorkflowStepRequest`](models/workflowsteprequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Operation |
| Permission | `nexa.workflows.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Run` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `StepId` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |
| `IdempotencyKey` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Workflows_RetryStep(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Workflows_RetryStep_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ExplainPlan

[`WorkflowRequest`](models/workflowrequest.md) → [`ValidationReport`](models/validationreport.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `11` |
| Kind | Query |
| Permission | `nexa.workflows.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Workflow` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Inputs` | `AbiValue` | Typed input value encoded under the declared input schema. |
| `DefinitionDigest` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Workflows_ExplainPlan(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Workflows_ExplainPlan_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadRunTrace

[`EntityRequest`](models/entityrequest.md) → [`WorkflowTrace`](models/workflowtrace.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `12` |
| Kind | Query |
| Permission | `nexa.workflows.read` |
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
nx_Workflows_ReadRunTrace(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Workflows_ReadRunTrace_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/workflows.md) · Apache-2.0.
