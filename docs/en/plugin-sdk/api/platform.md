# Platform

Request finite operating-system integration through the Host. Platform availability, user grants and application policy determine which actions can run.

Contract: `nexa.platform/100`. [API index](index.md).

## Typical sequence

Describe the platform or query its facts before presenting optional features. Use explicit URI, file and clipboard operations with the requested data type and scope.

## Behavior and limits

Opening a URI is an external effect, not arbitrary command execution. Unsupported display/power/clipboard data must remain unavailable rather than being reported as fabricated measurements.

The recorded Host maps 10 of 10 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[Describe](#describe) · [OpenUri](#openuri) · [RevealFile](#revealfile) · [Notify](#notify) · [ReadClipboard](#readclipboard) · [WriteClipboard](#writeclipboard) · [PickFile](#pickfile) · [QueryPower](#querypower) · [QueryDisplay](#querydisplay) · [QueryArchitecture](#queryarchitecture)

### Describe

[`Empty`](models/empty.md) → [`PlatformDescription`](models/platformdescription.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Query |
| Permission | `nexa.platform.read` |
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
nx_Platform_Describe(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Platform_Describe_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### OpenUri

`UriRef` → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Mutation |
| Permission | `nexa.platform.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

Use the linked request type, including its container or handle ownership rules.

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Platform_OpenUri(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Platform_OpenUri_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### RevealFile

[`FileRef`](models/fileref.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Mutation |
| Permission | `nexa.platform.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Token` | `Guid` | Opaque Host-issued handle token. Keep it with its owner and resource type. |
| `LoadInstanceId` | `Guid` | Identity of the admitted load that owns this handle; it is not portable to a replacement load. |
| `Scope` | `string` | Explicit target scope. The Host checks that the caller is authorized for it. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Platform_RevealFile(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Platform_RevealFile_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Notify

[`UINotification`](models/uinotification.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Mutation |
| Permission | `nexa.platform.write` |
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
nx_Platform_Notify(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Platform_Notify_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadClipboard

[`Empty`](models/empty.md) → [`ClipboardContent`](models/clipboardcontent.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Query |
| Permission | `nexa.platform.read` |
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
nx_Platform_ReadClipboard(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Platform_ReadClipboard_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### WriteClipboard

[`ClipboardContent`](models/clipboardcontent.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Mutation |
| Permission | `nexa.platform.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Text` | `string?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Image` | [`BlobRef?`](models/blobref.md) | Structured BlobRef value; follow its linked field contract. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Platform_WriteClipboard(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Platform_WriteClipboard_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### PickFile

[`FilePick`](models/filepick.md) → [`FileRef`](models/fileref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Operation |
| Permission | `nexa.platform.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Title` | [`LocalizedText`](models/localizedtext.md) | Structured LocalizedText value; follow its linked field contract. |
| `Kind` | [`FilePickKind`](models.md#filepickkind) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `Extensions` | `string[]` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

An opaque file reference within the granted or package scope. It does not grant access to neighboring files.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Platform_PickFile(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Platform_PickFile_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### QueryPower

[`Empty`](models/empty.md) → [`PowerState`](models/powerstate.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Query |
| Permission | `nexa.platform.read` |
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
nx_Platform_QueryPower(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Platform_QueryPower_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### QueryDisplay

[`Empty`](models/empty.md) → `Page<DisplayInfo>` ([wrapper](models.md#containers), [item](models/displayinfo.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `9` |
| Kind | Query |
| Permission | `nexa.platform.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

This model has no fields. Send its encoded empty object, not an arbitrary Null value.

**Successful result**

Read Items and continue with NextCursor while preserving the original query. An absent cursor ends the sequence; an invalid cursor is an error.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Platform_QueryDisplay(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Platform_QueryDisplay_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### QueryArchitecture

[`Empty`](models/empty.md) → [`ArchitectureInfo`](models/architectureinfo.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `10` |
| Kind | Query |
| Permission | `nexa.platform.read` |
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
nx_Platform_QueryArchitecture(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Platform_QueryArchitecture_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/platform.md) · Apache-2.0.
