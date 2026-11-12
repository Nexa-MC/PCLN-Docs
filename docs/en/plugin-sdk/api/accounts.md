# Accounts

Read public account information and request account workflows without exposing credentials. Authentication tokens and launch credentials are not ordinary account metadata.

Contract: `nexa.accounts/100`. [API index](index.md).

## Typical sequence

Begin sign-in, present its challenge through the supported user flow, then continue or cancel with the returned identity. Check launch eligibility before requesting a scoped launch grant.

## Behavior and limits

Public reads do not authorize token extraction. Sign-out and custom account providers remain unmapped where listed. A cancelled challenge is not a successful sign-in.

The recorded Host maps 15 of 17 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[List](#list) · [ReadPublic](#readpublic) · [Watch](#watch) · [Select](#select) · [BeginSignIn](#beginsignin) · [ContinueSignIn](#continuesignin) · [CancelSignIn](#cancelsignin) · [Refresh](#refresh) · [SignOut](#signout) · [Remove](#remove) · [ReadLaunchEligibility](#readlauncheligibility) · [RequestLaunchGrant](#requestlaunchgrant) · [ReadWardrobe](#readwardrobe) · [PreviewSkin](#previewskin) · [UploadSkin](#uploadskin) · [SetCape](#setcape) · [RegisterProvider](#registerprovider)

### List

[`PageRequest`](models/pagerequest.md) → `Page<AccountPublic>` ([wrapper](models.md#containers), [item](models/accountpublic.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Query |
| Permission | `nexa.accounts.read` |
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
nx_Accounts_List(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_List_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadPublic

[`EntityRequest`](models/entityrequest.md) → [`AccountPublic`](models/accountpublic.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Query |
| Permission | `nexa.accounts.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

Only public metadata is returned. Account tokens and credentials are not made available by this method or by a successful read permission check.

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
nx_Accounts_ReadPublic(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_ReadPublic_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Watch

[`WatchRequest`](models/watchrequest.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Subscription |
| Permission | `nexa.accounts.read` |
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
nx_Accounts_Watch(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_Watch_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Select

[`EntityRequest`](models/entityrequest.md) → [`AccountPublic`](models/accountpublic.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Mutation |
| Permission | `nexa.accounts.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Accounts_Select(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_Select_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### BeginSignIn

[`SignInRequest`](models/signinrequest.md) → [`SignInChallenge`](models/signinchallenge.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Operation |
| Permission | `nexa.accounts.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Provider` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Scope` | `string` | Explicit target scope. The Host checks that the caller is authorized for it. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Accounts_BeginSignIn(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_BeginSignIn_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ContinueSignIn

[`SignInContinue`](models/signincontinue.md) → [`SignInChallenge`](models/signinchallenge.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Operation |
| Permission | `nexa.accounts.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Flow` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Response` | `AbiValue` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Accounts_ContinueSignIn(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_ContinueSignIn_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### CancelSignIn

[`EntityRequest`](models/entityrequest.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Mutation |
| Permission | `nexa.accounts.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Accounts_CancelSignIn(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_CancelSignIn_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Refresh

[`EntityRequest`](models/entityrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Operation |
| Permission | `nexa.accounts.write` |
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
nx_Accounts_Refresh(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_Refresh_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### SignOut

[`EntityRequest`](models/entityrequest.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Mutation |
| Permission | `nexa.accounts.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | **Not mapped in recorded snapshot** |

The recorded Host cannot provide this operation. Keep it optional or require a Host that explicitly implements it; do not return synthetic success.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Accounts_SignOut(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_SignOut_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Remove

[`EntityRequest`](models/entityrequest.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Mutation |
| Permission | `nexa.accounts.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Accounts_Remove(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_Remove_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadLaunchEligibility

[`EntityRequest`](models/entityrequest.md) → [`LaunchEligibility`](models/launcheligibility.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `11` |
| Kind | Query |
| Permission | `nexa.accounts.read` |
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
nx_Accounts_ReadLaunchEligibility(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_ReadLaunchEligibility_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RequestLaunchGrant

[`GrantRequest`](models/grantrequest.md) → [`LaunchGrant`](models/launchgrant.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `12` |
| Kind | Operation |
| Permission | `nexa.accounts.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Account` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Instance` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Accounts_RequestLaunchGrant(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_RequestLaunchGrant_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadWardrobe

[`EntityRequest`](models/entityrequest.md) → [`Wardrobe`](models/wardrobe.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `13` |
| Kind | Query |
| Permission | `nexa.accounts.read` |
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
nx_Accounts_ReadWardrobe(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_ReadWardrobe_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PreviewSkin

[`SkinRequest`](models/skinrequest.md) → [`BlobRef`](models/blobref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `14` |
| Kind | Query |
| Permission | `nexa.accounts.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Account` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Image` | [`BlobRef`](models/blobref.md) | Structured BlobRef value; follow its linked field contract. |
| `Model` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

The Host retains bytes under an opaque, owned blob handle. It is not the bytes themselves and is not portable across loads.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Accounts_PreviewSkin(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_PreviewSkin_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### UploadSkin

[`SkinRequest`](models/skinrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `15` |
| Kind | Operation |
| Permission | `nexa.accounts.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Account` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Image` | [`BlobRef`](models/blobref.md) | Structured BlobRef value; follow its linked field contract. |
| `Model` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Accounts_UploadSkin(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_UploadSkin_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### SetCape

[`CapeSelection`](models/capeselection.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `16` |
| Kind | Operation |
| Permission | `nexa.accounts.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Account` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `CapeId` | `string?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Accounts_SetCape(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_SetCape_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterProvider

[`ProviderDescriptor`](models/providerdescriptor.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `17` |
| Kind | Registration |
| Permission | `nexa.accounts.write` |
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
nx_Accounts_RegisterProvider(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Accounts_RegisterProvider_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/accounts.md) · Apache-2.0.
