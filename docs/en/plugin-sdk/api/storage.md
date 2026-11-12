# Storage

Persist private plugin data in authorized namespaces with revision checks and transactions. Namespace handles are scoped to the admitted load even when the persisted data survives restart.

Contract: `nexa.storage/100`. [API index](index.md).

## Typical sequence

Open the namespace, read before conditional writes, and use CompareExchange for competing updates. Commit a transaction only with its actual returned identity and revision.

## Behavior and limits

Migration is explicit and bounded. A failed or oversized migration must not reset the store. The storage implementation assumes one trusted Host owner; it is not a distributed database protocol.

The recorded Host maps 8 of 8 operations in this group.
A mapping is subject to permission, phase, scope, platform and business preconditions.
[Host snapshot](../host-support.md) identifies the source revision; negotiate against
the actual installed Host.

## Operations

[OpenNamespace](#opennamespace) · [Read](#read) · [Write](#write) · [CompareExchange](#compareexchange) · [Query](#query) · [BeginTransaction](#begintransaction) · [Commit](#commit) · [Migrate](#migrate)

### OpenNamespace

[`NamespaceRequest`](models/namespacerequest.md) → [`StorageNamespace`](models/storagenamespace.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `1` |
| Kind | Acquisition |
| Permission | `nexa.storage.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Namespace` | `QualifiedId` | Private storage namespace identity or handle. It remains subject to current-load ownership. |
| `SchemaVersion` | `ulong` | Version of the declared data schema; independent of SDK and ABI versions. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Storage_OpenNamespace(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Storage_OpenNamespace_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Read

[`StorageKey`](models/storagekey.md) → [`StorageValue`](models/storagevalue.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `2` |
| Kind | Query |
| Permission | `nexa.storage.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Namespace` | [`StorageNamespace`](models/storagenamespace.md) | Private storage namespace identity or handle. It remains subject to current-load ownership. |
| `Key` | `string` | Private entry key inside the supplied namespace. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Storage_Read(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Storage_Read_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Write

[`StorageWrite`](models/storagewrite.md) → [`StorageValue`](models/storagevalue.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `3` |
| Kind | Mutation |
| Permission | `nexa.storage.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

The recorded storage owner requires the existing entry’s exact revision for an update. An absent ExpectedRevision creates only a missing key; it does not mean unconditional overwrite.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Namespace` | [`StorageNamespace`](models/storagenamespace.md) | Private storage namespace identity or handle. It remains subject to current-load ownership. |
| `Key` | `string` | Key within this model’s owning namespace or record. It does not grant access outside that owner. |
| `Value` | `AbiValue` | Payload interpreted using the accompanying or declared schema; Null is not a substitute for an error. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `ExpectedRevision` | `Revision?` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Storage_Write(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Storage_Write_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### CompareExchange

[`StorageWrite`](models/storagewrite.md) → [`StorageValue`](models/storagevalue.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `4` |
| Kind | Mutation |
| Permission | `nexa.storage.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

Read the entry first and supply its exact revision. For a missing key, use an absent revision. A competing create/update fails with STALE_REVISION; both Write and CompareExchange enforce this rule in the recorded owner.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Namespace` | [`StorageNamespace`](models/storagenamespace.md) | Private storage namespace identity or handle. It remains subject to current-load ownership. |
| `Key` | `string` | Key within this model’s owning namespace or record. It does not grant access outside that owner. |
| `Value` | `AbiValue` | Payload interpreted using the accompanying or declared schema; Null is not a substitute for an error. |
| `Schema` | [`SchemaRef`](models/schemaref.md) | Exact schema identity, version and fingerprint used to validate Value. |
| `ExpectedRevision` | `Revision?` | Revision observed before this change. Preserve it exactly; a mismatch requires re-reading and reconciling the target. Nullable; omission is distinct from an empty value. No implicit default is promised by this type. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Storage_CompareExchange(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Storage_CompareExchange_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Query

[`StorageQuery`](models/storagequery.md) → `Page<StorageEntry>` ([wrapper](models.md#containers), [item](models/storageentry.md))

| Property | Contract |
| --- | --- |
| Local SDK method ID | `5` |
| Kind | Query |
| Permission | `nexa.storage.read` |
| Legal phases | Initialize, PostInitialize, Checkup, Finalize, Active |
| Idempotency | ReadOnly |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Namespace` | [`StorageNamespace`](models/storagenamespace.md) | Private storage namespace identity or handle. It remains subject to current-load ownership. |
| `Prefix` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Page` | [`PageRequest`](models/pagerequest.md) | Structured PageRequest value; follow its linked field contract. |

**Successful result**

Read Items and continue with NextCursor while preserving the original query. An absent cursor ends the sequence; an invalid cursor is an error.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. A read-only classification does not bypass budgets or guarantee a failed request can be retried indefinitely. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Storage_Query(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Storage_Query_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### BeginTransaction

[`StorageNamespace`](models/storagenamespace.md) → [`StorageTransaction`](models/storagetransaction.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `6` |
| Kind | Mutation |
| Permission | `nexa.storage.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Token` | `Guid` | Opaque Host-issued handle token. Keep it with its owner and resource type. |
| `LoadInstanceId` | `Guid` | Identity of the admitted load that owns this handle; it is not portable to a replacement load. |
| `Namespace` | `QualifiedId` | Private storage namespace identity or handle. It remains subject to current-load ownership. |
| `Revision` | `Revision` | Opaque version token issued by the owner. Do not increment it or substitute another object’s revision. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Storage_BeginTransaction(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Storage_BeginTransaction_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Commit

[`StorageCommit`](models/storagecommit.md) → [`StorageNamespace`](models/storagenamespace.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `7` |
| Kind | Mutation |
| Permission | `nexa.storage.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Transaction` | [`StorageTransaction`](models/storagetransaction.md) | Structured StorageTransaction value; follow its linked field contract. |
| `Writes` | [`StorageWrite[]`](models/storagewrite.md) | Structured StorageWrite value; follow its linked field contract. A bounded collection; do not assume an unbounded result or unspecified ordering. |

**Successful result**

Decode the exact output model after Success. Preserve its identities, revision and schema metadata for subsequent domain operations.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Storage_Commit(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Storage_Commit_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.

### Migrate

[`StorageMigration`](models/storagemigration.md) → [`OperationRef`](models/operationref.md)

| Property | Contract |
| --- | --- |
| Local SDK method ID | `8` |
| Kind | Operation |
| Permission | `nexa.storage.write` |
| Legal phases | Active |
| Idempotency | RequiredKey |
| Host status | Mapped in recorded snapshot |

The current migration boundary accepts at most 256 entries and invokes an owned read-only migration action. Read the resulting operation to obtain the new namespace; do not reuse an obsolete namespace revision.

**Request fields**

| Field | Type | Meaning |
| --- | --- | --- |
| `Namespace` | [`StorageNamespace`](models/storagenamespace.md) | Private storage namespace identity or handle. It remains subject to current-load ownership. |
| `FromVersion` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `ToVersion` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Action` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |

**Successful result**

Work has been admitted. Read or watch the owned operation through Tasks to establish its terminal result; admission is not completion.

**Failure and retry**

Unavailable capability, denied permission, wrong phase, malformed schema or foreign ownership fails the call. Supply a key for the intended effect and retain that key and inputs while resolving an uncertain reply. Do not retry with changed inputs under the same key. Re-read after revision conflicts; cancellation does not prove rollback. Preserve structured errors; see [recovery guidance](../errors.md).

**C binding** (call fragment; the caller supplies the encoded request and buffers):

```c
nx_Storage_Migrate(&reply, request, &options);
```

The next resume receives the reply. Check `nx_reply_success` before
`nx_Storage_Migrate_result`. See the [complete continuation example](../tutorials/page-and-action.md)
and [Wasm ownership rules](../wasm-sdk.md). This fragment is not a standalone guest.


---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/storage.md) · Apache-2.0.
