# UI

Contribute verified NXML pages, components and finite UI behavior to Host-owned rendering. Plugins provide assets and typed intent; the Host owns controls, input, navigation and confirmation.

Contract: `nexa.ui/100`. [API index](index.md).

## Typical sequence

Open verified package assets before registration. Discover extension targets and their contracts before contributing or replacing a view. Keep action IDs and NXML bindings in the plugin namespace.

## Behavior and limits

Stage registrations are not visible before atomic activation. Stop retires them. Model updates, drawing surfaces and input subscriptions retain their own schemas, budgets and ownership checks.

The recorded Host maps 19 of 19 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[RegisterPage](#registerpage) · [RegisterComponent](#registercomponent) · [RegisterContribution](#registercontribution) · [RegisterViewReplacement](#registerviewreplacement) · [RegisterNavigation](#registernavigation) · [RegisterCommand](#registercommand) · [RegisterShortcut](#registershortcut) · [ShowDialog](#showdialog) · [CloseDialog](#closedialog) · [Navigate](#navigate) · [Notify](#notify) · [PublishModel](#publishmodel) · [UpdateModel](#updatemodel) · [WatchViewLifecycle](#watchviewlifecycle) · [ListExtensionTargets](#listextensiontargets) · [DescribeViewContract](#describeviewcontract) · [CreateDrawingSurface](#createdrawingsurface) · [SubmitDrawCommands](#submitdrawcommands) · [SubscribeInput](#subscribeinput)

### RegisterPage

[`UIPage`](models/uipage.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Registration |
| Permission | `nexa.ui.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

The page asset must be opened from the verified package and owned by the current load. The descriptor links an NXML asset to its model schema and declared actions; it does not transfer rendering ownership.

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
nx_UI_RegisterPage(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_RegisterPage_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterComponent

[`UIComponent`](models/uicomponent.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Registration |
| Permission | `nexa.ui.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `EntryFile` | [`FileRef`](models/fileref.md) | Structured FileRef value; follow its linked field contract. |
| `Parameters` | [`SchemaRef`](models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_RegisterComponent(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_RegisterComponent_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterContribution

[`UIContribution`](models/uicontribution.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Registration |
| Permission | `nexa.ui.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `View` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `SemanticNode` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Mode` | [`UIContributionMode`](models.md#uicontributionmode) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Component` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Before` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `After` | `QualifiedId[]` | Identity or revision in this model’s domain; preserve ownership and exact spelling. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_RegisterContribution(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_RegisterContribution_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterViewReplacement

[`UIViewReplacement`](models/uiviewreplacement.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Registration |
| Permission | `nexa.ui.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `View` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `ViewContract` | [`SchemaRef`](models/schemaref.md) | Structured SchemaRef value; follow its linked field contract. |
| `Page` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_RegisterViewReplacement(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_RegisterViewReplacement_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterNavigation

[`UINavigation`](models/uinavigation.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `11` |
| Kind | Registration |
| Permission | `nexa.ui.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Page` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Title` | [`LocalizedText`](models/localizedtext.md) | Structured LocalizedText value; follow its linked field contract. |
| `Icon` | `QualifiedId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_RegisterNavigation(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_RegisterNavigation_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterCommand

[`UICommand`](models/uicommand.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `12` |
| Kind | Registration |
| Permission | `nexa.ui.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Action` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Title` | [`LocalizedText`](models/localizedtext.md) | Structured LocalizedText value; follow its linked field contract. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_RegisterCommand(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_RegisterCommand_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RegisterShortcut

[`UIShortcut`](models/uishortcut.md) → [`RegistrationRef`](models/registrationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `13` |
| Kind | Registration |
| Permission | `nexa.ui.write` |
| Legal phases | Initialize |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Command` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Gesture` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Scope` | `QualifiedId` | Explicit target scope. The Host checks that the caller is authorized for it. |

**Successful result**

Retain the registration identity for the permitted update/release operation. Staged registrations become visible only at group activation.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_RegisterShortcut(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_RegisterShortcut_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ShowDialog

[`UIDialog`](models/uidialog.md) → [`UIDialogRef`](models/uidialogref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `14` |
| Kind | Operation |
| Permission | `nexa.ui.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Page` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Model` | `AbiValue` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_ShowDialog(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_ShowDialog_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### CloseDialog

[`EntityRequest`](models/entityrequest.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `15` |
| Kind | Mutation |
| Permission | `nexa.ui.write` |
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
nx_UI_CloseDialog(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_CloseDialog_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Navigate

[`UINavigateRequest`](models/uinavigaterequest.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `16` |
| Kind | Mutation |
| Permission | `nexa.ui.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Page` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Arguments` | `AbiValue` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_Navigate(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_Navigate_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Notify

[`UINotification`](models/uinotification.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `17` |
| Kind | Mutation |
| Permission | `nexa.ui.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Title` | [`LocalizedText`](models/localizedtext.md) | Structured LocalizedText value; follow its linked field contract. |
| `Body` | [`LocalizedText`](models/localizedtext.md) | Structured LocalizedText value; follow its linked field contract. |
| `Action` | `QualifiedId?` | Identity or revision in this model’s domain; preserve ownership and exact spelling. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_Notify(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_Notify_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PublishModel

[`UIModelUpdate`](models/uimodelupdate.md) → [`StateSnapshot`](models/statesnapshot.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `18` |
| Kind | Mutation |
| Permission | `nexa.ui.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `View` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Value` | `AbiValue` | Payload interpreted using the accompanying or declared schema; Null is not a substitute for an error. |
| `ExpectedRevision` | `Revision?` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_PublishModel(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_PublishModel_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### UpdateModel

[`UIModelUpdate`](models/uimodelupdate.md) → [`StateSnapshot`](models/statesnapshot.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `19` |
| Kind | Mutation |
| Permission | `nexa.ui.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `View` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `Value` | `AbiValue` | Payload interpreted using the accompanying or declared schema; Null is not a substitute for an error. |
| `ExpectedRevision` | `Revision?` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_UpdateModel(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_UpdateModel_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### WatchViewLifecycle

[`UIViewWatch`](models/uiviewwatch.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `20` |
| Kind | Subscription |
| Permission | `nexa.ui.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `View` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `ViewScope` | `Guid` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Cursor` | `string?` | Opaque continuation or observation cursor. Reuse only in the issuing query/scope; absence and invalidity are different. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Retain the subscription identity, consume bounded batches or callbacks as specified, handle gaps, and release it when no longer needed.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_WatchViewLifecycle(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_WatchViewLifecycle_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ListExtensionTargets

[`PageRequest`](models/pagerequest.md) → `Page<UIViewContract>` ([wrapper](models.md#containers), [item](models/uiviewcontract.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `21` |
| Kind | Query |
| Permission | `nexa.ui.read` |
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
nx_UI_ListExtensionTargets(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_ListExtensionTargets_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### DescribeViewContract

[`QualifiedRequest`](models/qualifiedrequest.md) → [`UIViewContract`](models/uiviewcontract.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `22` |
| Kind | Query |
| Permission | `nexa.ui.read` |
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
nx_UI_DescribeViewContract(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_DescribeViewContract_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### CreateDrawingSurface

[`DrawingSurfaceRequest`](models/drawingsurfacerequest.md) → [`DrawingSurfaceRef`](models/drawingsurfaceref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `23` |
| Kind | Operation |
| Permission | `nexa.ui.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Width` | `double` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Height` | `double` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ViewScope` | `Guid` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_CreateDrawingSurface(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_CreateDrawingSurface_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### SubmitDrawCommands

[`DrawSubmission`](models/drawsubmission.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `24` |
| Kind | Mutation |
| Permission | `nexa.ui.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Surface` | [`DrawingSurfaceRef`](models/drawingsurfaceref.md) | Structured DrawingSurfaceRef value; follow its linked field contract. |
| `Commands` | [`DrawCommand[]`](models/drawcommand.md) | Structured DrawCommand value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `ExpectedRevision` | `Revision` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_SubmitDrawCommands(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_SubmitDrawCommands_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### SubscribeInput

[`InputSubscription`](models/inputsubscription.md) → [`SubscriptionRef`](models/subscriptionref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `25` |
| Kind | Subscription |
| Permission | `nexa.ui.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Surface` | [`DrawingSurfaceRef`](models/drawingsurfaceref.md) | Structured DrawingSurfaceRef value; follow its linked field contract. |
| `Events` | [`InputEventKind[]`](models.md#inputeventkind) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Handler` | `ulong` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. |

**Successful result**

Retain the subscription identity, consume bounded batches or callbacks as specified, handle gaps, and release it when no longer needed.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_UI_SubscribeInput(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_UI_SubscribeInput_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/ui.md) · Apache-2.0.
