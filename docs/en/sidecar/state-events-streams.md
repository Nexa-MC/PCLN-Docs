# Current state, events, credit-based streams

State provides current truth, Event an occurrence, and Stream continuous output at consumer pace. They are different contracts.

## Snapshot before deltas

For UTF-8 current-note State 1 and Bool enabled State 2:

```csharp
byte[] begin = SidecarStateSnapshot.EncodeBegin(2);
byte[] note = SidecarStateSnapshot.EncodeItem(1,
    SidecarWireCodecs.Encode(SidecarWireCodecs.Utf8String, "Ready"));
byte[] enabled = SidecarStateSnapshot.EncodeItem(2,
    SidecarWireCodecs.Encode(SidecarWireCodecs.Bool, true));
byte[] end = SidecarStateSnapshot.EncodeEnd();
```

Send each with its corresponding Begin/Item/Item/End kind, not an invented combined DTO. Host validates coverage/duplicates/codecs/budget before atomic publication. Active deltas use the registered type; Host owns local revisions/availability and rendering reads the mirror without IPC.

## Value, availability, consistency

HasValue/Availability/Revision differ. Stale retained data is not fresh success. Termination invalidates facts; a new session requires a new full snapshot. Only replaceable state may coalesce. Use an explicit DTO/ordering contract for coherent multi-field facts rather than assuming arbitrary multi-cell transactions.

## Event is not current truth

```csharp
var changed = new SidecarBinaryValue(SidecarWireCodecs.Utf8String,
    SidecarWireCodecs.Encode(SidecarWireCodecs.Utf8String, "changed"));
byte[] notification = SidecarDataMessages.EncodeBinaryEvent(1, changed);
```

Event 1 is its own registered ordinal; binary form needs BinaryPayloads, text uses EncodeEvent. Observers return promptly; offload IO to bounded work. Keep current-note State alongside submission Event. Do not silently coalesce occurrences or assume undeclared durable replay/exactly-once behavior.

## Stream types

```csharp
var declaration = new SidecarRegistrationItem(
    SidecarRegistrationKind.Stream, "example.note.history", 0, SidecarWireCodecs.I32)
    { ResultCodecId = SidecarWireCodecs.Utf8String };
```

I32 opens the request; UTF-8 chunks return history. Streams is independent of BinaryPayloads. Initial credit is 16; spending one per chunk and returning one after consumption bounds production.

## Sequence and credit

```text
Host → StreamOpen(contract=1, argument=2, credit=16), correlation=C
Peer → StreamChunk(sequence=1, value="first"), C       credit15
Peer → StreamChunk(sequence=2, value="second"), C      credit14
Host → StreamCredit(1), C                             after consumption
Peer → StreamEnd(nextSequence=3, success=true), C
```

Start at 1, End names the next expected sequence, and preserve C throughout. Sending 17 chunks before waiting violates initial admission.

## Host consumption

Given admitted api/package and a caller token:

```csharp
var opened = await api.OpenStreamAsync(new(package,
    XsrSemanticId.Parse("example.note.history"),
    new SidecarBinaryValue(SidecarWireCodecs.I32,
        SidecarWireCodecs.Encode(SidecarWireCodecs.I32, 2))), token);
if (!opened.IsSuccess) return;
await using var stream = opened.Value!;
await foreach (var value in stream.ReadAllAsync(token)) {
    Console.WriteLine((string)SidecarWireCodecs.Decode(value.CodecId, value.Span));
}
var completion = await stream.Completion;
// Inspect IsSuccess/Error; enumeration ending does not prove success.
```

One consumer only. HostApiRecipes.cs supplies compilable callbacks; this is asynchronous composition work, never frame work.

## Completion and unread ownership

Inspect normal End, remote rejection, cancellation, timeout, session loss. Early exit disposes the handle and releases data with bounded best-effort CANCEL. Completed unread chunks remain charged until drained/disposed/detached during retirement. Bound retained old handles and do not relabel old data as new-session output.

## Budgets and verification

16 streams/session, 16 queued chunks each, ≤65535 bytes/chunk, ≤4 MiB aggregate; timeout 30s/default, 5 minutes maximum. Invalid sequence/codec/credit/queue use is a fault, not silently droppable output. Recipes prove encoding; real backpressure needs delayed consumers, exhausted credit, cancellation, and disconnect in a controlled Host.


## Implementation references

- [Nexa.Sidecar.Protocol/SidecarDataMessages.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarDataMessages.cs)
- [Nexa.Sidecar.Protocol/SidecarStreamMessages.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarStreamMessages.cs)
- [Nexa.Xsr.Runtime/Sidecar/SidecarHostSession.Streams.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Runtime/Sidecar/SidecarHostSession.Streams.cs)
