# Protocol, registration, complete lifecycle

Define sender, validator, publication, and retirement for every phase. Versions, frame constants, and feature bits are compatibility contracts, not adjustable author settings.

## Bootstrap to activation

```text
Host                         Sidecar
bind/start child ───────────→ read one-use stdin proof
authenticate first 32 bytes ← Bootstrap.ConnectAsync
HELLO ─────────────────────→ version/features check
      ←───────────────────── WELCOME
      ←───────────────────── REGISTER_BEGIN / ITEM* / END
      ←───────────────────── STATE_SNAPSHOT_BEGIN / ITEM* / END
READY ─────────────────────→ complete admitted registration/state
ACTIVATE ──────────────────→ execute granted behavior
```

Host publishes no partial mirror before all declarations, hashes, references, targets, and snapshot values pass. Do not start activation-owned behavior during construction/registration. Zero states still require an empty snapshot.

## Features

| Feature | Bit | Enables |
| --- | --- | --- |
| BinaryPayloads | 1 | Binary Command/Query/Event |
| Streams | 2 | Stream registration/messages |
| Health | 4 | Ping/Pong |
| Unregistration | 8 | Explicit unregister exchange |

WELCOME confirms the intersection; missing fields mean None. Bits are independent: Streams do not additionally require BinaryPayloads; typed State also works independently. Toggle needs BinaryPayloads for its Boolean Command.

## Every registration kind

| Kind | Value | Meaning |
| --- | --- | --- |
| Command/Query | 1/2 | Effect/one-off result |
| State/Event | 3/4 | Current fact/occurrence |
| UiModule/Resource | 5/6 | Hashed finite document/content |
| UiPatch | 7 | Finite caption |
| EventCatch/EventListen | 8/9 | Granted event match/observe |
| IntentCatch/IntentWait | 10/11 | Granted intent catch/one-shot wait |
| FunctionPatch | 12 | Finite program at explicit target |
| Stream | 13 | Credit-controlled output |

RegisterItem TLVs: 1 Kind(U32), 2 SemanticId(Str), 3 Flags(U32), 4 CodecId(U32), 5 Payload(Bytes), 6 ContentHash(Bytes), 7 RequiredResources(Str), 8 TargetSemanticId(Str), 9 ResultCodecId(U32). Optional fields depend on kind; omitted result codec means zero.

Command/Query declare argument/result codecs; State/Event declare values; Stream declares open-argument/chunk codecs. Extension bytes/hash/target must match Host admission.

## Per-kind numeric IDs

For Command set, State text, Query echo, State enabled in that order: Command set=1, Query echo=1, State text=1, State enabled=2. Tables are per kind/session, not one global ordinal or semantic hash. Reconnect registers/snapshots/resolves again. Reactivation within the same registration is distinct from a new session.

## Complete 32-byte frame header

| Offset | Size | Field |
| --- | --- | --- |
| 0 | 4 | Magic `0x53584350`, little-endian bytes `50 43 58 53` |
| 4 | 2 | Header version 1 |
| 6 | 2 | Protocol version 1 |
| 8 | 2 | Message type |
| 10 | 2 | Traits |
| 12 | 16 | Assigned correlation GUID, library Guid byte convention |
| 28 | 4 | Payload length, ≤16 MiB |

Use `SidecarFrameCodec`; cross-language implementations must compare bytes with library fixtures instead of inserting UUID text/different ordering. For GUID `00112233-4455-6677-8899-aabbccddeeff`, bytes are `33 22 11 00 55 44 77 66 88 99 aa bb cc dd ee ff`; --recipes checks the fixed example. Every frame, including controls, needs an assigned correlation. Validate headers before allocation.

Compressed/Final are known traits; current Transport does not automatically compress/decompress. Unknown message/version/undefined bits reject. Unknown TLV skipping is not permission to execute unknown frames.

## TLV and message numbers

Each field has u16 ID, u8 tag, u16 length, then bytes. IDs are ascending/unique; unknown fields skip by length while required fields/types remain checked. A single string/Bytes/value is ≤65535 bytes, regardless of the larger frame limit. Field tags are Boolean1/U32-2/U64-3/I64-4/F64-5/Str6/Bytes7/Id128-8; these are distinct from value codecs0–6. Wrong tags on known fields reject.

| Message | Value |
| --- | --- |
| Hello/Welcome | 1/2 |
| RegisterBegin/Item/End | 8/9/10 |
| Ready/Activate/Deactivate | 11/12/13 |
| StateSnapshotBegin/Item/End | 14/15/18 |
| HealthPing/HealthPong | 16/17 |
| Cancel | 19 |
| Unregister/Unregistered | 20/21 |
| Crash/Error/Shutdown | 24/25/30 |
| CommandRequest/Result | 64/65 |
| QueryRequest/Result | 66/67 |
| StateDelta/Event/HookSignal | 72/73/74 |
| StreamChunk/Open/End/Credit | 80/81/82/83 |

JSON is for configuration/diagnostics, not production data-plane object exchange. No CLR objects, reflection names, or fixed memory-struct ABI.

## Budgets

| Item | Default/bound |
| --- | --- |
| Discovery/native image/signature | 64/512 MiB/64 KiB |
| Supervisor candidate bootstrap/admission | 30s |
| Session handshake/registration/shutdown | 10s/30s/2s |
| Registrations/semantic ID/aggregate | 4096/256 characters/32 MiB |
| Snapshot | Separate 32 MiB, exact State coverage |
| Pending writes | 64 |
| Pending Command/Query | Default 1024 |
| Command/Query timeout | Default 30s; positive explicit values within .NET timer bounds |
| Stream/Health timeout | 30s/5s, maximum 5 minutes |
| Streams | 16/session, 16 queued chunks/stream, 4 MiB total |
| Health | 32 pending plus shared admission |
| Best-effort CANCEL/credit | Separate 100ms |

Host may lower budgets; the peer cannot raise them. Deadlines cover send plus response, not just response wait.

## Teardown and failure

Withdraw local grants before ordered DEACTIVATE; exchange UNREGISTER/UNREGISTERED if negotiated, then SHUTDOWN and await exit. Synchronous Dispose is not proof of joined async teardown; await ShutdownAsync/DisposeAsync when required.

Cancellation before IO admission preserves an unused connection. Interrupted frame IO can leave partial bytes and closes the transport rather than reusing it. Crash is terminal; structured Error may end only its correlated exchange. Every terminal path completes pending work, and late results cannot resurrect closed sessions.


## Implementation references

- [Nexa.Sidecar.Protocol/SidecarProtocol.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarProtocol.cs)
- [Nexa.Sidecar.Protocol/SidecarFrameCodec.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarFrameCodec.cs)
- [Nexa.Sidecar.Protocol/SidecarRegistration.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarRegistration.cs)
- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
