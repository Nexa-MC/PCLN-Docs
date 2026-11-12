> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../index.md)。

# Settings

Read effective settings and apply reviewed changes to the requested scope. Stored values, inherited values and temporary overlays have different ownership and lifetimes.

Contract: `nexa.settings/100`. [API index](index.md).

## Typical sequence

Use GetEffective when the UI needs the value and its origin. Preview a change and apply its plan; retain an overlay’s registration so it can be ended explicitly.

## Behavior and limits

A temporary overlay is not a durable profile write. Schema/page registration and migration routes remain unmapped where listed; direct modification of launcher configuration files is not a supported substitute.

The recorded Host maps 15 of 15 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[RegisterSchema](#registerschema) · [RegisterPage](#registerpage) · [Get](#get) · [GetEffective](#geteffective) · [Watch](#watch) · [PreviewChange](#previewchange) · [Apply](#apply) · [Reset](#reset) · [Migrate](#migrate) · [ListProfiles](#listprofiles) · [SaveProfile](#saveprofile) · [SelectProfile](#selectprofile) · [BeginTemporaryOverlay](#begintemporaryoverlay) · [EndTemporaryOverlay](#endtemporaryoverlay) · [RegisterVersionedSchema](#registerversionedschema)

### RegisterSchema

[`SettingSchema`](models/settingschema.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Registration |
| Permission | `nexa.settings.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Stage a plugin-owned setting schema at version 1. Supported scopes are global and instance. ValueSchema and Default must validate against a known ABI schema. The Host stores values in a private durable namespace using canonical instance identity, revision CAS and explicit defaults. Use RegisterVersionedSchema before introducing a migration.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `ValueSchema` | [`SchemaRef`](models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `Default` | `AbiValue` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Scopes` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Settings_RegisterSchema(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_RegisterSchema_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterPage

[`UIPage`](models/uipage.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Registration |
| Permission | `nexa.settings.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Register a verified NXML package page through the same rendering path as UI.RegisterPage. EntryFile must be an owned package-file handle. The page appears only after atomic activation and is removed on retirement. Registering a schema does not automatically generate controls.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `EntryFile` | [`FileRef`](models/fileref.md) | Structured FileRef value; follow its linked field contract. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Localizations` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Settings_RegisterPage(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_RegisterPage_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Get

[`SettingQuery`](models/settingquery.md) → [`StateSnapshot`](models/statesnapshot.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Query |
| Permission | `nexa.settings.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Target` | [`ScopedTarget`](models/scopedtarget.md) | Structured ScopedTarget value; follow its linked field contract. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Settings_Get(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_Get_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### GetEffective

[`SettingQuery`](models/settingquery.md) → [`EffectiveSetting`](models/effectivesetting.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Query |
| Permission | `nexa.settings.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Target` | [`ScopedTarget`](models/scopedtarget.md) | Structured ScopedTarget value; follow its linked field contract. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Settings_GetEffective(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_GetEffective_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Watch

[`SettingQuery`](models/settingquery.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Subscription |
| Permission | `nexa.settings.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Target` | [`ScopedTarget`](models/scopedtarget.md) | Structured ScopedTarget value; follow its linked field contract. |

**Successful result**

Retain the subscription identity, consume bounded batches or callbacks as specified, handle gaps, and release it when no longer needed.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Settings_Watch(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_Watch_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PreviewChange

[`SettingChange`](models/settingchange.md) → [`MutationPlan`](models/mutationplan.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Query |
| Permission | `nexa.settings.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Target` | [`ScopedTarget`](models/scopedtarget.md) | Structured ScopedTarget value; follow its linked field contract. |
| `Value` | `AbiValue` | Payload interpreted using the accompanying or declared schema; Null is not a substitute for an error. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

Retain the exact plan ID and revision, review its bound inputs and confirmation requirement, then use the corresponding commit operation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Settings_PreviewChange(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_PreviewChange_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Apply

[`PlanRequest`](models/planrequest.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Operation |
| Permission | `nexa.settings.write` |
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
nx_Settings_Apply(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_Apply_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Reset

[`SettingQuery`](models/settingquery.md) → [`StateSnapshot`](models/statesnapshot.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Mutation |
| Permission | `nexa.settings.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Target` | [`ScopedTarget`](models/scopedtarget.md) | Structured ScopedTarget value; follow its linked field contract. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Settings_Reset(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_Reset_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Migrate

[`SettingMigration`](models/settingmigration.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Operation |
| Permission | `nexa.settings.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Confirm a forward migration from the exact persisted FromVersion to the registered ToVersion. Handler receives SettingMigrationInput and returns a value matching the current setting schema. The callback is query-only and cannot mutate Host state. The Host rechecks schema identity and storage revision before one atomic write; failure or rejection preserves the old value. Repeating a completed migration returns a stale-version error.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Target` | [`ScopedTarget`](models/scopedtarget.md) | Structured ScopedTarget value; follow its linked field contract. |
| `FromVersion` | `ulong` | Exact stored setting version to transform. A mismatch rejects migration before committing. |
| `ToVersion` | `ulong` | Currently registered positive setting version. Migrations must move forward. |
| `Handler` | `ulong` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Settings_Migrate(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_Migrate_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ListProfiles

[`PageRequest`](models/pagerequest.md) → `Page<SettingsProfile>` ([wrapper](models.md#containers), [item](models/settingsprofile.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Query |
| Permission | `nexa.settings.read` |
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
nx_Settings_ListProfiles(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_ListProfiles_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### SaveProfile

[`SettingsProfile`](models/settingsprofile.md) → [`SettingsProfile`](models/settingsprofile.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `11` |
| Kind | Mutation |
| Permission | `nexa.settings.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `EntityId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Name` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Values` | [`EffectiveSetting[]`](models/effectivesetting.md) | Structured EffectiveSetting value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Revision` | `Revision` | Opaque version token issued by the owner. Do not increment it or substitute another object’s revision. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Settings_SaveProfile(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_SaveProfile_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### SelectProfile

[`EntityRequest`](models/entityrequest.md) → [`SettingsProfile`](models/settingsprofile.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `12` |
| Kind | Mutation |
| Permission | `nexa.settings.write` |
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
nx_Settings_SelectProfile(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_SelectProfile_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### BeginTemporaryOverlay

[`SettingsOverlay`](models/settingsoverlay.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `13` |
| Kind | Mutation |
| Permission | `nexa.settings.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Target` | [`ScopedTarget`](models/scopedtarget.md) | Structured ScopedTarget value; follow its linked field contract. |
| `Values` | [`EffectiveSetting[]`](models/effectivesetting.md) | Structured EffectiveSetting value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Settings_BeginTemporaryOverlay(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_BeginTemporaryOverlay_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### EndTemporaryOverlay

[`RegistrationRequest`](models/registrationrequest.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `14` |
| Kind | Mutation |
| Permission | `nexa.settings.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Registration` | [`RegistrationRef`](models/registrationref.md) | Structured RegistrationRef value; follow its linked field contract. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Settings_EndTemporaryOverlay(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_EndTemporaryOverlay_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterVersionedSchema

[`VersionedSettingSchema`](models/versionedsettingschema.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `15` |
| Kind | Registration |
| Permission | `nexa.settings.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Stage the current positive version of an owned SettingSchema. Registration does not transform persisted values. GetEffective rejects a stored value from another version until Migrate succeeds. The same plugin ID and setting ID retain their durable values across load replacement.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Schema` | [`SettingSchema`](models/settingschema.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Version` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Settings_RegisterVersionedSchema(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Settings_RegisterVersionedSchema_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/api/settings.md) · Apache-2.0.
