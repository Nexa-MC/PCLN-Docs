# Definitions

Publish typed definitions into registries and resolve the definitions visible to a consumer. Definitions are data; registering one does not make arbitrary launcher code execute it.

Contract: `nexa.definitions/100`. [API index](index.md).

## Typical sequence

Discover the registry and its accepted schema first. Register owned values during staging, and use the returned identity and revision for later updates. Tags and overlays affect resolution according to the registry contract.

## Behavior and limits

Use ExplainResolution when an overlay or tag produces an unexpected result. Keep a failed resolution distinct from a valid empty result; remove only definitions owned by the current load.

The recorded Host maps 15 of 15 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[ListRegistries](#listregistries) · [DescribeRegistry](#describeregistry) · [DefineRegistry](#defineregistry) · [Register](#register) · [RegisterBatch](#registerbatch) · [Get](#get) · [Query](#query) · [Watch](#watch) · [UpdateOwned](#updateowned) · [RemoveOwned](#removeowned) · [RegisterTag](#registertag) · [ResolveTag](#resolvetag) · [PreviewOverlay](#previewoverlay) · [RegisterOverlay](#registeroverlay) · [ExplainResolution](#explainresolution)

### ListRegistries

[`PageRequest`](models/pagerequest.md) → `Page<RegistryDescriptor>` ([wrapper](models.md#containers), [item](models/registrydescriptor.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Query |
| Permission | `nexa.definitions.read` |
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
nx_Definitions_ListRegistries(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_ListRegistries_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### DescribeRegistry

[`QualifiedRequest`](models/qualifiedrequest.md) → [`RegistryDescriptor`](models/registrydescriptor.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Query |
| Permission | `nexa.definitions.read` |
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
nx_Definitions_DescribeRegistry(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_DescribeRegistry_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### DefineRegistry

[`RegistryDescriptor`](models/registrydescriptor.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Registration |
| Permission | `nexa.definitions.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `EntryIdentity` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ReferenceTypes` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `MergePolicy` | [`MergePolicy`](models.md#mergepolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `OrderingPolicy` | [`OrderingPolicy`](models.md#orderingpolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Activation` | [`ActivationPolicy`](models.md#activationpolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Ownership` | [`OwnershipPolicy`](models.md#ownershippolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `SupportedOperations` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `ValidationRules` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Consumer` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Deletion` | [`DeletionPolicy`](models.md#deletionpolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `MergeContract` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Definitions_DefineRegistry(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_DefineRegistry_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Register

[`Definition`](models/definition.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Registration |
| Permission | `nexa.definitions.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Registry` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Body` | `AbiValue` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `References` | [`Reference[]`](models/reference.md) | Structured Reference value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Definitions_Register(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_Register_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterBatch

[`DefinitionBatch`](models/definitionbatch.md) → `Page<RegistrationRef>` ([wrapper](models.md#containers), [item](models/registrationref.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Registration |
| Permission | `nexa.definitions.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Definitions` | [`Definition[]`](models/definition.md) | Structured Definition value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

Read Items and continue with NextCursor while preserving the original query. An absent cursor ends the sequence; an invalid cursor is an error.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Definitions_RegisterBatch(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_RegisterBatch_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Get

[`DefinitionQuery`](models/definitionquery.md) → `Snapshot<Definition>` ([wrapper](models.md#containers), [item](models/definition.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Query |
| Permission | `nexa.definitions.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Registry` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

Read Value together with Revision, SchemaVersion and ObservedAt. Preserve the revision for conditional changes and observation time for freshness.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Definitions_Get(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_Get_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Query

[`DefinitionSearch`](models/definitionsearch.md) → `Page<Definition>` ([wrapper](models.md#containers), [item](models/definition.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Query |
| Permission | `nexa.definitions.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Registry` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Tags` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Page` | [`PageRequest`](models/pagerequest.md) | Structured PageRequest value; follow its linked field contract. |

**Successful result**

Read Items and continue with NextCursor while preserving the original query. An absent cursor ends the sequence; an invalid cursor is an error.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Definitions_Query(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_Query_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Watch

[`QualifiedRequest`](models/qualifiedrequest.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Subscription |
| Permission | `nexa.definitions.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

Retain the subscription identity, consume bounded batches or callbacks as specified, handle gaps, and release it when no longer needed.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Definitions_Watch(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_Watch_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### UpdateOwned

[`DefinitionUpdate`](models/definitionupdate.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Mutation |
| Permission | `nexa.definitions.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Definition` | [`Definition`](models/definition.md) | Structured Definition value; follow its linked field contract. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Definitions_UpdateOwned(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_UpdateOwned_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RemoveOwned

[`DefinitionRemove`](models/definitionremove.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Mutation |
| Permission | `nexa.definitions.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Registry` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Definitions_RemoveOwned(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_RemoveOwned_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterTag

[`TagDefinition`](models/tagdefinition.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `11` |
| Kind | Registration |
| Permission | `nexa.definitions.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Registry` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Add` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Remove` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Include` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Definitions_RegisterTag(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_RegisterTag_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ResolveTag

[`QualifiedRequest`](models/qualifiedrequest.md) → [`TagResolution`](models/tagresolution.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `12` |
| Kind | Query |
| Permission | `nexa.definitions.read` |
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
nx_Definitions_ResolveTag(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_ResolveTag_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PreviewOverlay

[`OverlayDefinition`](models/overlaydefinition.md) → [`MutationPlan`](models/mutationplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `13` |
| Kind | Query |
| Permission | `nexa.definitions.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Target` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Mode` | [`MergePolicy`](models.md#mergepolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Patch` | `AbiValue` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Before` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `After` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

Retain the exact plan ID and revision, review its bound inputs and confirmation requirement, then use the corresponding commit operation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Definitions_PreviewOverlay(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_PreviewOverlay_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterOverlay

[`OverlayDefinition`](models/overlaydefinition.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `14` |
| Kind | Registration |
| Permission | `nexa.definitions.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Target` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Mode` | [`MergePolicy`](models.md#mergepolicy) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Patch` | `AbiValue` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Before` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `After` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Definitions_RegisterOverlay(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_RegisterOverlay_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ExplainResolution

[`QualifiedRequest`](models/qualifiedrequest.md) → [`ResolutionReport`](models/resolutionreport.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `15` |
| Kind | Query |
| Permission | `nexa.definitions.read` |
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
nx_Definitions_ExplainResolution(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Definitions_ExplainResolution_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/definitions.md) · Apache-2.0.
