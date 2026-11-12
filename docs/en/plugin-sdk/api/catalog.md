# Catalog

Search resource providers and resolve projects, versions, files and dependencies. Provider identity remains part of every resource reference and page sequence.

Contract: `nexa.catalog/100`. [API index](index.md).

## Typical sequence

Choose an explicit provider, search with a bounded page, then resolve a selected version before planning installation. Read-provider callbacks return typed values with matching provenance.

## Behavior and limits

Custom catalog providers currently support seven read queries. Mixed built-in/custom searches, custom installation and favorites are not implied by successful registration.

The recorded Host maps 20 of 20 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[ListProviders](#listproviders) · [DescribeProvider](#describeprovider) · [RegisterProvider](#registerprovider) · [Search](#search) · [ReadProject](#readproject) · [ListVersions](#listversions) · [ReadVersion](#readversion) · [ReadChangelog](#readchangelog) · [ResolveFiles](#resolvefiles) · [ResolveDependencies](#resolvedependencies) · [ListFavorites](#listfavorites) · [SetFavorite](#setfavorite) · [PlanInstall](#planinstall) · [PlanUpdate](#planupdate) · [ExecutePlan](#executeplan) · [RegisterCollection](#registercollection) · [RegisterTranslationProvider](#registertranslationprovider) · [ReadTranslatedProject](#readtranslatedproject) · [ListCollections](#listcollections) · [ReadCollection](#readcollection)

### ListProviders

[`PageRequest`](models/pagerequest.md) → `Page<ProviderDescriptor>` ([wrapper](models.md#containers), [item](models/providerdescriptor.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
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
nx_Catalog_ListProviders(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_ListProviders_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### DescribeProvider

[`QualifiedRequest`](models/qualifiedrequest.md) → [`ProviderDescriptor`](models/providerdescriptor.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
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
nx_Catalog_DescribeProvider(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_DescribeProvider_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterProvider

[`ProviderDescriptor`](models/providerdescriptor.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Registration |
| Permission | `nexa.catalog.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

The current mapped custom provider family is read-only. It supports Search, ReadProject, ListVersions, ReadVersion, ReadChangelog, ResolveFiles and ResolveDependencies. See the provider guide for descriptor and callback requirements.

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
nx_Catalog_RegisterProvider(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_RegisterProvider_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Search

[`CatalogSearch`](models/catalogsearch.md) → `Page<CatalogProject>` ([wrapper](models.md#containers), [item](models/catalogproject.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Providers` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Query` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Kind` | `QualifiedId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `GameVersion` | `string?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Loader` | `QualifiedId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Page` | [`PageRequest`](models/pagerequest.md) | Structured PageRequest value; follow its linked field contract. |

**Successful result**

Read Items and continue with NextCursor while preserving the original query. An absent cursor ends the sequence; an invalid cursor is an error.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Catalog_Search(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_Search_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadProject

[`ResourceRef`](models/resourceref.md) → [`CatalogProject`](models/catalogproject.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Provider` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `ProjectId` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Catalog_ReadProject(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_ReadProject_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ListVersions

[`CatalogVersionQuery`](models/catalogversionquery.md) → `Page<CatalogVersion>` ([wrapper](models.md#containers), [item](models/catalogversion.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Resource` | [`ResourceRef`](models/resourceref.md) | Structured ResourceRef value; follow its linked field contract. |
| `GameVersion` | `string?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Page` | [`PageRequest`](models/pagerequest.md) | Structured PageRequest value; follow its linked field contract. |

**Successful result**

Read Items and continue with NextCursor while preserving the original query. An absent cursor ends the sequence; an invalid cursor is an error.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Catalog_ListVersions(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_ListVersions_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadVersion

[`ResourceVersionRef`](models/resourceversionref.md) → [`CatalogVersion`](models/catalogversion.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Resource` | [`ResourceRef`](models/resourceref.md) | Structured ResourceRef value; follow its linked field contract. |
| `VersionId` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Catalog_ReadVersion(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_ReadVersion_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadChangelog

[`ResourceVersionRef`](models/resourceversionref.md) → [`TextResult`](models/textresult.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Resource` | [`ResourceRef`](models/resourceref.md) | Structured ResourceRef value; follow its linked field contract. |
| `VersionId` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Catalog_ReadChangelog(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_ReadChangelog_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ResolveFiles

[`ResourceVersionRef`](models/resourceversionref.md) → `Page<CatalogFile>` ([wrapper](models.md#containers), [item](models/catalogfile.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Resource` | [`ResourceRef`](models/resourceref.md) | Structured ResourceRef value; follow its linked field contract. |
| `VersionId` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Read Items and continue with NextCursor while preserving the original query. An absent cursor ends the sequence; an invalid cursor is an error.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Catalog_ResolveFiles(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_ResolveFiles_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ResolveDependencies

[`ResourceVersionRef`](models/resourceversionref.md) → `Page<CatalogDependency>` ([wrapper](models.md#containers), [item](models/catalogdependency.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Resource` | [`ResourceRef`](models/resourceref.md) | Structured ResourceRef value; follow its linked field contract. |
| `VersionId` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Read Items and continue with NextCursor while preserving the original query. An absent cursor ends the sequence; an invalid cursor is an error.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Catalog_ResolveDependencies(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_ResolveDependencies_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ListFavorites

[`PageRequest`](models/pagerequest.md) → `Page<CatalogProject>` ([wrapper](models.md#containers), [item](models/catalogproject.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `11` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
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
nx_Catalog_ListFavorites(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_ListFavorites_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### SetFavorite

[`FavoriteChange`](models/favoritechange.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `12` |
| Kind | Mutation |
| Permission | `nexa.catalog.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Resource` | [`ResourceRef`](models/resourceref.md) | Structured ResourceRef value; follow its linked field contract. |
| `Favorite` | `bool` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ExpectedRevision` | `Revision?` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Catalog_SetFavorite(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_SetFavorite_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PlanInstall

[`CatalogInstallRequest`](models/cataloginstallrequest.md) → [`ContentPlan`](models/contentplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `13` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Instance` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Versions` | [`ResourceVersionRef[]`](models/resourceversionref.md) | Structured ResourceVersionRef value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Catalog_PlanInstall(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_PlanInstall_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PlanUpdate

[`CatalogInstallRequest`](models/cataloginstallrequest.md) → [`ContentPlan`](models/contentplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `14` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Instance` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Versions` | [`ResourceVersionRef[]`](models/resourceversionref.md) | Structured ResourceVersionRef value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Catalog_PlanUpdate(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_PlanUpdate_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ExecutePlan

[`PlanRequest`](models/planrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `15` |
| Kind | Operation |
| Permission | `nexa.catalog.write` |
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
nx_Catalog_ExecutePlan(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_ExecutePlan_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterCollection

[`ResourceCollection`](models/resourcecollection.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `16` |
| Kind | Registration |
| Permission | `nexa.catalog.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Publish an owned collection of at most 256 distinct resource references and 64 distinct tags. The collection becomes visible atomically with its plugin. ListCollections and ReadCollection consume the registration; stopping its owner removes it.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Resources` | [`ResourceRef[]`](models/resourceref.md) | Structured ResourceRef value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Tags` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Catalog_RegisterCollection(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_RegisterCollection_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterTranslationProvider

[`ProviderDescriptor`](models/providerdescriptor.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `17` |
| Kind | Registration |
| Permission | `nexa.catalog.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Register kind nexa:catalog/translation with Translate: CatalogTranslationInput → CatalogTranslation. The input contains a validated project and requested locale; the output may change display name and summary only. It cannot change provider/project identity or download provenance.

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
nx_Catalog_RegisterTranslationProvider(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_RegisterTranslationProvider_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadTranslatedProject

[`CatalogTranslationRequest`](models/catalogtranslationrequest.md) → [`CatalogProject`](models/catalogproject.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `18` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

Resolve the original project through its catalog provider, then invoke the selected translation provider. Locales are 2–64 ASCII letters/digits/hyphens. Names are 1–1,024 characters and summaries at most 65,536 characters. Failure remains a failure; the caller may explicitly choose to show the untranslated project.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Provider` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Resource` | [`ResourceRef`](models/resourceref.md) | Structured ResourceRef value; follow its linked field contract. |
| `Locale` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Catalog_ReadTranslatedProject(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_ReadTranslatedProject_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ListCollections

[`PageRequest`](models/pagerequest.md) → `Page<ResourceCollection>` ([wrapper](models.md#containers), [item](models/resourcecollection.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `19` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

List active registered resource collections with revision-bound pagination. Staged registrations are not exposed. Collection membership is a resource reference, not proof that the resource is installed or downloadable.

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
nx_Catalog_ListCollections(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_ListCollections_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadCollection

[`QualifiedRequest`](models/qualifiedrequest.md) → [`ResourceCollection`](models/resourcecollection.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `20` |
| Kind | Query |
| Permission | `nexa.catalog.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

Read an active collection by qualified ID. A stopped or absent provider returns NOT_FOUND; callers must not reuse a cached collection as current authority.

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
nx_Catalog_ReadCollection(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Catalog_ReadCollection_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/catalog.md) · Apache-2.0.
