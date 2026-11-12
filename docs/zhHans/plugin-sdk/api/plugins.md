> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../index.md)。

# Plugins

Export a typed service or bind to a compatible service from another admitted plugin. Bindings are explicit relationships between particular loads, not ambient access to other plugins.

Contract: `nexa.interplugin/100`. [API index](index.md).

## Typical sequence

Export during Initialize, bind during PostInitialize and probe during Checkup. Invoke only after activation. Describe the service before choosing a version range.

## Behavior and limits

A required provider dependency can stop its consumers when it retires; an optional binding becomes unavailable. Bindings never silently switch to a replacement load.

The recorded Host maps 8 of 8 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[ExportService](#exportservice) · [DescribeService](#describeservice) · [BindService](#bindservice) · [ProbeService](#probeservice) · [CallService](#callservice) · [WatchAvailability](#watchavailability) · [ReleaseBinding](#releasebinding) · [ReadOwnLoadReport](#readownloadreport)

### ExportService

[`ServiceDefinition`](models/servicedefinition.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Registration |
| Permission | `nexa.interplugin.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Contract` | [`PublicContract`](models/publiccontract.md) | Structured PublicContract value; follow its linked field contract. |
| `Handler` | `ulong` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. |
| `Probe` | `QualifiedId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Plugins_ExportService(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Plugins_ExportService_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### DescribeService

[`ServiceLookup`](models/servicelookup.md) → [`PublicContract`](models/publiccontract.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Query |
| Permission | `nexa.interplugin.read` |
| Legal phases | PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Provider` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Service` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `MinimumVersion` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `MaximumVersion` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Required` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Plugins_DescribeService(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Plugins_DescribeService_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### BindService

[`ServiceLookup`](models/servicelookup.md) → [`ServiceBinding`](models/servicebinding.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Registration |
| Permission | `nexa.interplugin.write` |
| Legal phases | PostInitialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Provider` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Service` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `MinimumVersion` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `MaximumVersion` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Required` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Plugins_BindService(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Plugins_BindService_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ProbeService

[`ServiceProbe`](models/serviceprobe.md) → [`ValidationReport`](models/validationreport.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `11` |
| Kind | Query |
| Permission | `nexa.interplugin.read` |
| Legal phases | Checkup |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Binding` | [`ServiceBinding`](models/servicebinding.md) | Structured ServiceBinding value; follow its linked field contract. |
| `Probe` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Input` | `AbiValue` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Plugins_ProbeService(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Plugins_ProbeService_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### CallService

[`ServiceCall`](models/servicecall.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `12` |
| Kind | Operation |
| Permission | `nexa.interplugin.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Binding` | [`ServiceBinding`](models/servicebinding.md) | Structured ServiceBinding value; follow its linked field contract. |
| `Method` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Input` | `AbiValue` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `CallChain` | `Guid[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Delegation` | [`ScopedTarget?`](models/scopedtarget.md) | Structured ScopedTarget value; follow its linked field contract. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Plugins_CallService(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Plugins_CallService_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### WatchAvailability

[`ServiceLookup`](models/servicelookup.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `13` |
| Kind | Subscription |
| Permission | `nexa.interplugin.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Provider` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Service` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `MinimumVersion` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `MaximumVersion` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Required` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Retain the subscription identity, consume bounded batches or callbacks as specified, handle gaps, and release it when no longer needed.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Plugins_WatchAvailability(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Plugins_WatchAvailability_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReleaseBinding

[`ServiceBinding`](models/servicebinding.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `14` |
| Kind | Mutation |
| Permission | `nexa.interplugin.write` |
| Legal phases | PostInitialize, Active, Stop |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Handle` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Provider` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ProviderLoadInstance` | `Guid` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Contract` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Version` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Plugins_ReleaseBinding(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Plugins_ReleaseBinding_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadOwnLoadReport

[`Empty`](models/empty.md) → [`LoadReport`](models/loadreport.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `15` |
| Kind | Query |
| Permission | `nexa.interplugin.read` |
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
nx_Plugins_ReadOwnLoadReport(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Plugins_ReadOwnLoadReport_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/api/plugins.md) · Apache-2.0.
