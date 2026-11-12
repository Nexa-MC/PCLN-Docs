# Downloads

Resolve and run downloads as observable Host tasks with verification and cancellation. A download plan identifies approved sources and expected content.

Contract: `nexa.downloads/100`. [API index](index.md).

## Typical sequence

Resolve the plan, start it, then read or watch progress. Verify the final content before using it. Pause and resume availability depends on the admitted operation and transfer behavior.

## Behavior and limits

A completed transport is not proof of a matching hash. Custom source-resolver and transfer-provider routes remain unmapped; do not infer them from built-in download support.

The recorded Host maps 8 of 10 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[Resolve](#resolve) · [Start](#start) · [Read](#read) · [Watch](#watch) · [Pause](#pause) · [Resume](#resume) · [Cancel](#cancel) · [Verify](#verify) · [RegisterSourceResolver](#registersourceresolver) · [RegisterTransferProvider](#registertransferprovider)

### Resolve

[`DownloadPlan`](models/downloadplan.md) → [`DownloadPlan`](models/downloadplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Query |
| Permission | `nexa.downloads.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Sources` | [`DownloadSource[]`](models/downloadsource.md) | Structured DownloadSource value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Target` | [`FileRef`](models/fileref.md) | Structured FileRef value; follow its linked field contract. |
| `Size` | `long?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Sha256` | `string?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Downloads_Resolve(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Downloads_Resolve_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Start

[`DownloadPlan`](models/downloadplan.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Operation |
| Permission | `nexa.downloads.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Sources` | [`DownloadSource[]`](models/downloadsource.md) | Structured DownloadSource value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Target` | [`FileRef`](models/fileref.md) | Structured FileRef value; follow its linked field contract. |
| `Size` | `long?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Sha256` | `string?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Downloads_Start(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Downloads_Start_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Read

[`EntityRequest`](models/entityrequest.md) → [`DownloadState`](models/downloadstate.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Query |
| Permission | `nexa.downloads.read` |
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
nx_Downloads_Read(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Downloads_Read_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Watch

[`WatchRequest`](models/watchrequest.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Subscription |
| Permission | `nexa.downloads.read` |
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
nx_Downloads_Watch(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Downloads_Watch_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Pause

[`OperationRequest`](models/operationrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Mutation |
| Permission | `nexa.downloads.write` |
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
nx_Downloads_Pause(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Downloads_Pause_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Resume

[`OperationRequest`](models/operationrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Mutation |
| Permission | `nexa.downloads.write` |
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
nx_Downloads_Resume(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Downloads_Resume_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Cancel

[`OperationRequest`](models/operationrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Mutation |
| Permission | `nexa.downloads.write` |
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
nx_Downloads_Cancel(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Downloads_Cancel_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Verify

[`EntityRequest`](models/entityrequest.md) → [`IntegrityReport`](models/integrityreport.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Query |
| Permission | `nexa.downloads.read` |
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
nx_Downloads_Verify(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Downloads_Verify_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterSourceResolver

[`ProviderDescriptor`](models/providerdescriptor.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Registration |
| Permission | `nexa.downloads.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Kind` | `QualifiedId` | Host-supported provider family. Registration succeeds only for a mapped family. |
| `ContractVersion` | `ulong` | Provider contract version; current catalog read-provider callbacks use 100. |
| `SchemaHash` | `string` | Digest of the provider callback envelope schema; current catalog read providers use BusinessProviderCall. |
| `DisplayName` | [`LocalizedText`](models/localizedtext.md) | User-facing localized label; it is not an authority-bearing identity. |
| `Capabilities` | `string[]` | Exact capabilities advertised or required by this descriptor, subject to the Host’s accepted table. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `SupportedScopes` | `string[]` | Scopes the provider declares it can handle; declaration does not authorize every target. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Selection` | [`SelectionPolicy`](models.md#selectionpolicy) | Selection rule; the current catalog callback boundary supports ExplicitRequest. |
| `Concurrency` | [`ConcurrencyPolicy`](models.md#concurrencypolicy) | Declared execution policy. A provider family may reject enum members whose semantics it does not implement. |
| `DeadlineMilliseconds` | `long` | Requested deadline in milliseconds; queue time consumes this budget and caller deadlines can shorten it. |
| `FailurePolicy` | [`ProviderFailurePolicy`](models.md#providerfailurepolicy) | How this provider family reports callback failures; it does not automatically make retries safe. |
| `Configuration` | [`SchemaRef`](models/schemaref.md) | Schema for provider configuration, not arbitrary executable Host configuration. |
| `Handler` | `ulong` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Downloads_RegisterSourceResolver(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Downloads_RegisterSourceResolver_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterTransferProvider

[`ProviderDescriptor`](models/providerdescriptor.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Registration |
| Permission | `nexa.downloads.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Kind` | `QualifiedId` | Host-supported provider family. Registration succeeds only for a mapped family. |
| `ContractVersion` | `ulong` | Provider contract version; current catalog read-provider callbacks use 100. |
| `SchemaHash` | `string` | Digest of the provider callback envelope schema; current catalog read providers use BusinessProviderCall. |
| `DisplayName` | [`LocalizedText`](models/localizedtext.md) | User-facing localized label; it is not an authority-bearing identity. |
| `Capabilities` | `string[]` | Exact capabilities advertised or required by this descriptor, subject to the Host’s accepted table. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `SupportedScopes` | `string[]` | Scopes the provider declares it can handle; declaration does not authorize every target. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Selection` | [`SelectionPolicy`](models.md#selectionpolicy) | Selection rule; the current catalog callback boundary supports ExplicitRequest. |
| `Concurrency` | [`ConcurrencyPolicy`](models.md#concurrencypolicy) | Declared execution policy. A provider family may reject enum members whose semantics it does not implement. |
| `DeadlineMilliseconds` | `long` | Requested deadline in milliseconds; queue time consumes this budget and caller deadlines can shorten it. |
| `FailurePolicy` | [`ProviderFailurePolicy`](models.md#providerfailurepolicy) | How this provider family reports callback failures; it does not automatically make retries safe. |
| `Configuration` | [`SchemaRef`](models/schemaref.md) | Schema for provider configuration, not arbitrary executable Host configuration. |
| `Handler` | `ulong` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Downloads_RegisterTransferProvider(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Downloads_RegisterTransferProvider_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/downloads.md) · Apache-2.0.
