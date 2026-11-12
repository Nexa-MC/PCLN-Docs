> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../index.md)。

# Diagnostics

Report bounded, structured information about the current plugin’s work. Diagnostics help explain a failure without exposing private account data or creating an unbounded logging channel.

Contract: `nexa.diagnostics/100`. [API index](index.md).

## Typical sequence

Use stable message keys and relevant operation/correlation IDs. ReadOwnReports is scoped to the caller; it is not a global launcher log reader.

## Behavior and limits

The Host assigns source and ownership. Do not log bearer tokens, grants, encrypted package keys or full user file contents. A diagnostic report does not turn a failed operation into success.

The recorded Host maps 4 of 4 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[Log](#log) · [Report](#report) · [CreateSpan](#createspan) · [ReadOwnReports](#readownreports)

### Log

[`DiagnosticReport`](models/diagnosticreport.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Mutation |
| Permission | `nexa.diagnostics.write` |
| Legal phases | PreInitialize, Initialize, PostInitialize, Checkup, Finalize, Active, Abort, Stop |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Code` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Message` | [`LocalizedText`](models/localizedtext.md) | Structured LocalizedText value; follow its linked field contract. |
| `Severity` | [`DiagnosticSeverity`](models.md#diagnosticseverity) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `CorrelationId` | `Guid` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `OperationId` | `Guid?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Diagnostics_Log(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Diagnostics_Log_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Report

[`DiagnosticReport`](models/diagnosticreport.md) → [`Empty`](models/empty.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Mutation |
| Permission | `nexa.diagnostics.write` |
| Legal phases | PreInitialize, Initialize, PostInitialize, Checkup, Finalize, Active, Abort, Stop |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Code` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Message` | [`LocalizedText`](models/localizedtext.md) | Structured LocalizedText value; follow its linked field contract. |
| `Severity` | [`DiagnosticSeverity`](models.md#diagnosticseverity) | Use an exact enum member listed in the reference. The Host can support a subset for a particular operation. |
| `CorrelationId` | `Guid` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `OperationId` | `Guid?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

There is no result payload beyond the encoded Empty model. Check Success; an empty failure value is not successful completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Diagnostics_Report(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Diagnostics_Report_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### CreateSpan

[`DiagnosticSpan`](models/diagnosticspan.md) → [`SpanRef`](models/spanref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Mutation |
| Permission | `nexa.diagnostics.write` |
| Legal phases | PreInitialize, Initialize, PostInitialize, Checkup, Finalize, Active, Abort, Stop |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Name` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `CorrelationId` | `Guid` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Parent` | `Guid?` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |
| `Attributes` | [`NamedValue[]`](models/namedvalue.md) | Structured NamedValue value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Diagnostics_CreateSpan(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Diagnostics_CreateSpan_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### ReadOwnReports

[`PageRequest`](models/pagerequest.md) → `Page<DiagnosticReport>` ([wrapper](models.md#containers), [item](models/diagnosticreport.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Query |
| Permission | `nexa.diagnostics.read` |
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
nx_Diagnostics_ReadOwnReports(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Diagnostics_ReadOwnReports_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/api/diagnostics.md) · Apache-2.0.
