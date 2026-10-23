# Data and Host API

Codec IDs: 0 strict UTF-8; 1 one-byte Boolean 0/1; 2 little-endian Int32; 3 Int64; 4 Float64; 5 Bytes; 6 schema-contracted DTO blob. SidecarBinaryValue owns and validates bytes. The hot path carries no JSON, CLR objects or reflection dispatch.

```csharp
var value = new SidecarBinaryValue(SidecarWireCodecs.I32,
    SidecarWireCodecs.Encode(SidecarWireCodecs.I32, 42));
byte[] request = SidecarDataMessages.EncodeBinaryRequest(1, value);
```

Send QueryRequest using SidecarConnection and preserve correlation in QueryResult. Commands and queries have independent ID tables. Stable errors include xsr.timeout, xsr.cancelled, xsr.sidecar_failed, xsr.contract_mismatch and xsr.handler_faulted. Remote errors never construct CLR exception types.

## Host-side composition routes

These belong to **SidecarHostApi in the Host**, not unrestricted business/filesystem RPC callable by the peer. Resolve once to a numeric route ID.

| Commands | Request |
|---|---|
| sidecar.command | SidecarCommandCall |
| sidecar.binary.command | SidecarBinaryCall |
| sidecar.stop / sidecar.restart | SidecarPackageCall |
| sidecar.reload | SidecarReloadCall |

| Queries | Response |
|---|---|
| sidecar.query / sidecar.binary.query | string / SidecarBinaryValue |
| sidecar.state.read | SidecarStateRead |
| sidecar.resource.read / sidecar.ui.read | SidecarCachedContent |
| sidecar.catalog | IReadOnlyList&lt;SidecarPackageSnapshot&gt; |
| sidecar.session / sidecar.health | SidecarSessionInfo / TimeSpan |
| sidecar.stream.open | SidecarHostStream |

State/resource/UI/session reads use admitted local caches with zero IPC. Async calls accept cancellation. The binary Command route reports normal action completion; the direct SendBinaryCommandAsync method additionally returns the admitted binary result.

State deltas may coalesce replaceable values; events must not silently coalesce. Streams require the Streams feature and registration, start with 16 credits and chunk sequence 1, and end with the next expected sequence. Return credits as data is consumed. ReadAllAsync has one consumer; observe Completion to distinguish normal end from cancellation, timeout and failure.

[Full request types, methods and budgets](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md).
