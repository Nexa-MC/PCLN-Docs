# Commands, queries, codecs, errors

Use note submission and integer echo to understand the data plane. Snippets use Protocol; [Host API](./host-api) covers composition callers. Independent peers need no Desktop/service implementation reference.

## Command or Query

Command requests effects; Query asks for a one-off result. Do not hide install/delete effects in queries or query current facts on every frame. Host Acceptance is admission, not completion. Background work needs its own running/final State/Event contract.

## Every codec

| ID/constant | Shape | Validation/use |
| --- | --- | --- |
| 0 Utf8String | Strict UTF-8 | Invalid UTF-8/UTF-16 rejects; count encoded bytes |
| 1 Bool | One byte 0/1 | 2 is invalid |
| 2 I32 | Four signed little-endian bytes | Encode int |
| 3 I64 | Eight signed little-endian bytes | Encode long |
| 4 F64 | Eight IEEE double bytes | Shape validation; business enforces finiteness if required |
| 5 Bytes | Owned bytes | Explicit format, no CLR deserialization |
| 6 GeneratedDto | Contract-defined bytes | Own schema/version, no implied SDK generator |

Values are at most 65535 bytes. Function Patch adds finite Float64 validation; it is not a universal wire rule. NSS/theme numbers have independent bounds.

```csharp
var number = new SidecarBinaryValue(SidecarWireCodecs.I32,
    SidecarWireCodecs.Encode(SidecarWireCodecs.I32, 42));
int roundTrip = (int)SidecarWireCodecs.Decode(number.CodecId, number.Span);
```

The constructor copies bytes, Span is read-only, and ToArray copies. No mutable shared buffer crosses processes.

## One exchange

```csharp
byte[] payload = SidecarDataMessages.EncodeBinaryRequest(1, number);
var correlation = SidecarCorrelationId.Create();
var frame = new SidecarFrame(SidecarProtocol.Version,
    SidecarMessageType.QueryRequest, SidecarFrameTraits.None, correlation, payload);
```

This is Host-to-peer construction, not arbitrary peer-to-Host RPC. Check active state, per-kind ID, and codec, then preserve correlation:

```csharp
var request = SidecarDataMessages.DecodeBinaryRequest(frame.Payload.Span);
byte[] result = SidecarDataMessages.EncodeBinaryResult(true, request.Value, null);
// Send QueryResult with frame.CorrelationId and an appropriate token.
```

[Program.cs](https://github.com/Nexa-MC/PCLN-Docs/blob/main/examples/sidecar/Program.cs) supplies complete IO. Results must match ResultCodecId. An I32 argument does not change an omitted UTF-8 result declaration.

## Text compatibility versus binary

Encode/DecodeRequest, Result, Event retain text representation. Binary pairs require BinaryPayloads and carry explicit codec/bytes. DecodeBinary*Details also reports IsBinary. Do not mix both representations. Unknown codecs, sizes, and result kinds cannot complete unrelated requests.

## Versioned DTO recipe

NoteCodec in ContractRecipes.cs implements ISidecarBinaryCodec&lt;Note&gt;:

| Field | Tag | Contract |
| --- | --- | --- |
| 1 | U32 | schema=1 |
| 2 | I64 | Nonnegative Revision |
| 3 | Str | Text, at most 120 business characters |

```csharp
using var writer = new SidecarPayloadWriter();
writer.WriteUInt32(1, 1);
writer.WriteInt64(2, 42);
writer.WriteString(3, "Ready");
byte[] dtoBytes = writer.ToArray();
```

Read known IDs with typed accessors; skip unknown fields. Validate schema, required fields, ranges, business limits. Add optional fields compatibly; version changed meanings. The adapter provides CodecId/Encode/Decode without reflection. Run --recipes for the full example.

## Cancellation and concurrency

Host exchanges and peer workers are correlation-indexed. CANCEL carries one request GUID/reason, not global termination. Use one receive loop and bounded workers while handling Health/Cancel/Deactivate. Cleanup canceled work and reject retired completions.

Timeout remains xsr.timed_out; independent best-effort cancellation cannot overwrite it.

## Stable errors

| Code | Meaning | Response |
| --- | --- | --- |
| xsr.cancelled | Caller/lifetime cancellation | Cleanup, no fake success |
| xsr.timed_out | Deadline exceeded | Report; confirm effects separately |
| xsr.backpressure | Admission exhausted | Bounded backoff/retry |
| xsr.feature_unavailable | Missing feature | Explicit fallback |
| route_not_found/target_not_found (xsr.) | Missing route/target | Check ID/kind/package/version |
| xsr.contract_mismatch | Type/codec mismatch | Fix, do not blindly retry |
| xsr.unavailable | Runtime/package cannot accept | Observe/wait/restart |
| xsr.handler_faulted | Handler/malformed remote error | Keep correlation, not CLR objects |

Expected business rejection uses a valid code such as example.invalid_note, never empty success. Structured Error can end one exchange; Crash is terminal.

## Correlation is not idempotency

Repeated effects need operation IDs, deduplication, transactions, or explicit idempotence. A timeout does not prove no write occurred; a fresh correlation can still duplicate an effect.


## Implementation references

- [Nexa.Sidecar.Protocol/SidecarBinaryValue.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarBinaryValue.cs)
- [Nexa.Sidecar.Protocol/SidecarDataMessages.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarDataMessages.cs)
- [Nexa.Sidecar.Protocol/SidecarControlMessages.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarControlMessages.cs)
- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
