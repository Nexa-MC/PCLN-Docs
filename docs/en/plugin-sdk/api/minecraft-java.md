# Minecraft.Java

Discover Java runtimes, inspect requirements and select a runtime through launcher policy. Managed distribution offers describe the complete installable content accepted by the current installer.

Contract: `nexa.minecraft.java/100`. [API index](index.md).

## Typical sequence

Read the instance’s requirements before resolving selection. Use ListManagedDistributions and PrepareManagedInstall for the mapped multi-file distribution path, then commit through Install.

## Behavior and limits

The older single-file distribution catalog and preparation route are not mapped in this snapshot. A selected runtime still needs platform, architecture and version compatibility.

The recorded Host maps 11 of 14 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[List](#list) · [Discover](#discover) · [Inspect](#inspect) · [ReadRequirements](#readrequirements) · [ResolveSelection](#resolveselection) · [SelectGlobal](#selectglobal) · [SelectForInstance](#selectforinstance) · [ListDistributions](#listdistributions) · [PrepareInstall](#prepareinstall) · [Install](#install) · [Remove](#remove) · [RegisterDistributionProvider](#registerdistributionprovider) · [ListManagedDistributions](#listmanageddistributions) · [PrepareManagedInstall](#preparemanagedinstall)

### List

[`PageRequest`](models/pagerequest.md) → `Page<JavaRuntime>` ([wrapper](models.md#containers), [item](models/javaruntime.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Query |
| Permission | `nexa.minecraft.java.read` |
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
nx_Minecraft_Java_List(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Java_List_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Discover

[`RootRequest`](models/rootrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Operation |
| Permission | `nexa.minecraft.java.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Root` | [`RootRef`](models/rootref.md) | Structured RootRef value; follow its linked field contract. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Java_Discover(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Java_Discover_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Inspect

[`FileRef`](models/fileref.md) → [`JavaRuntime`](models/javaruntime.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Query |
| Permission | `nexa.minecraft.java.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Token` | `Guid` | Opaque Host-issued handle token. Keep it with its owner and resource type. |
| `LoadInstanceId` | `Guid` | Identity of the admitted load that owns this handle; it is not portable to a replacement load. |
| `Scope` | `string` | Explicit target scope. The Host checks that the caller is authorized for it. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Java_Inspect(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Java_Inspect_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadRequirements

[`EntityRequest`](models/entityrequest.md) → [`JavaRequirements`](models/javarequirements.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Query |
| Permission | `nexa.minecraft.java.read` |
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
nx_Minecraft_Java_ReadRequirements(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Java_ReadRequirements_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ResolveSelection

[`JavaSelection`](models/javaselection.md) → [`JavaRuntime`](models/javaruntime.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Query |
| Permission | `nexa.minecraft.java.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Instance` | `EntityId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Runtime` | `EntityId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `VersionLocal` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ExpectedRevision` | `Revision?` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Java_ResolveSelection(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Java_ResolveSelection_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### SelectGlobal

[`JavaSelection`](models/javaselection.md) → [`JavaRuntime`](models/javaruntime.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Mutation |
| Permission | `nexa.minecraft.java.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Instance` | `EntityId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Runtime` | `EntityId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `VersionLocal` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ExpectedRevision` | `Revision?` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Java_SelectGlobal(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Java_SelectGlobal_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### SelectForInstance

[`JavaSelection`](models/javaselection.md) → [`JavaRuntime`](models/javaruntime.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Mutation |
| Permission | `nexa.minecraft.java.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Instance` | `EntityId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Runtime` | `EntityId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `VersionLocal` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ExpectedRevision` | `Revision?` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Java_SelectForInstance(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Java_SelectForInstance_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ListDistributions

[`PageRequest`](models/pagerequest.md) → `Page<JavaDistribution>` ([wrapper](models.md#containers), [item](models/javadistribution.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Query |
| Permission | `nexa.minecraft.java.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

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
nx_Minecraft_Java_ListDistributions(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Java_ListDistributions_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PrepareInstall

[`JavaInstallRequest`](models/javainstallrequest.md) → [`MutationPlan`](models/mutationplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Query |
| Permission | `nexa.minecraft.java.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Distribution` | [`JavaDistribution`](models/javadistribution.md) | Structured JavaDistribution value; follow its linked field contract. |
| `Target` | [`RootRef`](models/rootref.md) | Structured RootRef value; follow its linked field contract. |

**Successful result**

Retain the exact plan ID and revision, review its bound inputs and confirmation requirement, then use the corresponding commit operation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Java_PrepareInstall(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Java_PrepareInstall_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Install

[`PlanRequest`](models/planrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Operation |
| Permission | `nexa.minecraft.java.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Plan` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |
| `ConfirmationToken` | `string?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Java_Install(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Java_Install_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Remove

[`EntityRequest`](models/entityrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `11` |
| Kind | Operation |
| Permission | `nexa.minecraft.java.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Java_Remove(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Java_Remove_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterDistributionProvider

[`ProviderDescriptor`](models/providerdescriptor.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `12` |
| Kind | Registration |
| Permission | `nexa.minecraft.java.write` |
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
nx_Minecraft_Java_RegisterDistributionProvider(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Java_RegisterDistributionProvider_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ListManagedDistributions

[`PageRequest`](models/pagerequest.md) → `Page<ManagedJavaOffer>` ([wrapper](models.md#containers), [item](models/managedjavaoffer.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `13` |
| Kind | Query |
| Permission | `nexa.minecraft.java.read` |
| Legal phases | Active |
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
nx_Minecraft_Java_ListManagedDistributions(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Java_ListManagedDistributions_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PrepareManagedInstall

[`ManagedJavaInstallRequest`](models/managedjavainstallrequest.md) → [`MutationPlan`](models/mutationplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `14` |
| Kind | Query |
| Permission | `nexa.minecraft.java.read` |
| Legal phases | Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

Use an offer returned by ListManagedDistributions. The managed offer describes the installer’s multi-file manifest; it is not interchangeable with the older JavaDistribution model.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Offer` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

Retain the exact plan ID and revision, review its bound inputs and confirmation requirement, then use the corresponding commit operation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Minecraft_Java_PrepareManagedInstall(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Minecraft_Java_PrepareManagedInstall_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/minecraft-java.md) · Apache-2.0.
