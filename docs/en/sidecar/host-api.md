# Complete Host API reference

SidecarHostApi is a **Host composition** surface invoking admitted peers, not child-to-Host account/file/install RPC. Renderers do not own it; independent peers reference Protocol/Transport only.

Complete compilable code below covers all 14 routes. api is composed by Host; package is the discovered filename without .nsc, not a path/display name.

## Construction and resolution

Construct `SidecarHostApi(SidecarSupervisor supervisor, IXsrDispatchObserver? observer = null)`. Commands/Queries are sealed routers; PackageSnapshots is local. Resolve routes to XsrCommandId/XsrQueryId once and cache in the owning scope. These differ from peer per-kind IDs.

## Every route

| Route | Request | Response/effect |
| --- | --- | --- |
| sidecar.command | SidecarCommandCall | Text command, XsrResult |
| sidecar.binary.command | SidecarBinaryCall | Binary command, ordinary completion |
| sidecar.stop | SidecarPackageCall | Stop/disable recovery |
| sidecar.restart | SidecarPackageCall | Reverify/new session |
| sidecar.reload | SidecarReloadCall | Rescan original directory |
| sidecar.query | SidecarQueryCall | string |
| sidecar.binary.query | SidecarBinaryCall | SidecarBinaryValue |
| sidecar.state.read | SidecarContractCall | SidecarStateRead |
| sidecar.resource.read | SidecarContractCall | SidecarCachedContent |
| sidecar.ui.read | SidecarContractCall | SidecarCachedContent |
| sidecar.catalog | SidecarCatalogQuery | IReadOnlyList&lt;SidecarPackageSnapshot&gt; |
| sidecar.session | SidecarPackageCall | SidecarSessionInfo |
| sidecar.health | SidecarHealthCall | TimeSpan |
| sidecar.stream.open | SidecarBinaryCall | SidecarHostStream |

| Request | Fields |
| --- | --- |
| CommandCall/QueryCall | PackageName, XsrSemanticId Contract, optional text Argument/Timeout |
| BinaryCall | PackageName, Contract, optional binary Argument/Timeout |
| ContractCall | PackageName, Contract |
| PackageCall | PackageName |
| HealthCall | PackageName, optional Timeout |
| CatalogQuery/ReloadCall | Empty |

Omitting an argument does not create a required I32/Bool value. Async calls accept cancellation and declared codecs remain authoritative.

## 1. Text command

Direct SendCommandAsync returns final XsrResult. Commands.Dispatch returns Acceptance, Completion, and CorrelationId. Acceptance is not completed work. RoutedTextCommandAsync below observes both; fire-and-forget does not discard runtime failures.

## 2. Binary command

Direct SendBinaryCommandAsync returns XsrResult&lt;SidecarBinaryValue&gt;. The binary Command route deliberately retains ordinary action completion, not Query semantics. Use the direct method for returned bytes. BinaryCommandAsync needs the admitted Boolean input/result and BinaryPayloads.

## 3–4. Text/binary queries

SendQueryAsync returns string; SendBinaryQueryAsync returns an owned value. TextQueryAsync computes one summary; EchoAsync submits Int32 42. Inspect IsSuccess first. Ongoing facts are State, not per-frame queries.

## 5. Local state

ReadState returns Revision/Availability/HasValue/optional Value with no IPC. Retained Stale data is not fresh success. CurrentNote takes a State semantic ID, not a Query ordinal.

## 6–7. Resource/UI cache

ReadResource/ReadUiModule access admitted cache bytes, not paths/page RPC. SidecarCachedContent offers Length, read-only Span, SHA-256 ContentHash, copying ToArray. Registration ownership/budgets still apply. Reading a cached document is not a presentation grant; execution needs UiModuleAdmission and a live session.

## 8. Catalog

PackageSnapshots and catalog Query return PackageName/Status/optional SessionId/ProcessId/RecoveryAttempts/FailureCode, no business payload. States: Discovered/Starting/Active/Stopped/Failed/Recovering/Quarantined/Removed. The sample resolves catalogId for clarity; production composition caches it after initialization.

## 9. Session

ReadSession returns SessionId/State/Features/immutable Contracts/Metrics. Reconnect has a new identity; do not reuse its old mapping or results.

## 10. Health

PingAsync measures a nonce-correlated round trip: 5s default, 5-minute bound, 32 pending plus shared admission. Pong proves control responsiveness, not cloud/business success.

## 11. Stream

OpenStreamAsync requires Streams and registration. One consumer, inspect Completion, await-dispose. The sample accepts asynchronous consume callbacks. See [credit flow](./state-events-streams).

## 12. Stop

StopAsync disables automatic recovery until restart. Missing and unavailable differ; this is lifecycle control, not an arbitrary text stop command.

## 13. Restart

RestartAsync stops, revalidates image/signature, creates/registers/snapshots a new session, and retires old IDs/exposures. Prior trust does not authorize changed bytes.

## 14. Reload

ReloadAsync rescans the original root, accepting no new peer path. Added/removed/ambiguous identities still pass supervision/trust.

## Complete compilable code

Authoring Lab compiles this file but **never automatically invokes it against real packages**. It requires an authorized Host composition context, not a peer-side service shortcut.
```csharp
using Nexa.Sidecar.Protocol;
using Nexa.Xsr;
using Nexa.Xsr.Runtime;

// Compilable Host-side integration snippets. The portable lab never automatically stops,
// restarts, reloads or invokes real packages. A child Sidecar does not receive this API.
public static class HostApiRecipes
{
    public static async ValueTask<XsrResult> RoutedTextCommandAsync(
        SidecarHostApi api, string package, CancellationToken token)
    {
        if (!api.Commands.TryResolve(SidecarHostRoutes.Command, out var route))
            return XsrResult.Failure(XsrRuntimeErrors.RouteNotFound());
        var dispatch = api.Commands.Dispatch(route,
            new SidecarCommandCall(package, XsrSemanticId.Parse("example.note.set"), "Ready"),
            cancellationToken: token);
        if (!dispatch.Acceptance.IsSuccess) return dispatch.Acceptance;
        return await dispatch.Completion;
    }

    public static ValueTask<XsrResult<string>> TextQueryAsync(SidecarHostApi api, string package, CancellationToken token) =>
        api.SendQueryAsync(new(package, XsrSemanticId.Parse("example.note.summary"), "current", TimeSpan.FromSeconds(3)), token);

    public static ValueTask<XsrResult<SidecarBinaryValue>> EchoAsync(SidecarHostApi api, string package, CancellationToken token) =>
        api.SendBinaryQueryAsync(new(package, XsrSemanticId.Parse("example.echo"),
            new(SidecarWireCodecs.I32, SidecarWireCodecs.Encode(SidecarWireCodecs.I32, 42)), TimeSpan.FromSeconds(3)), token);

    public static ValueTask<XsrResult<SidecarBinaryValue>> BinaryCommandAsync(SidecarHostApi api, string package, CancellationToken token) =>
        api.SendBinaryCommandAsync(new(package, XsrSemanticId.Parse("example.note.enable"),
            new(SidecarWireCodecs.Bool, SidecarWireCodecs.Encode(SidecarWireCodecs.Bool, true))), token);

    public static XsrResult<SidecarStateRead> CurrentNote(SidecarHostApi api, string package) =>
        api.ReadState(new(package, XsrSemanticId.Parse("example.note.current")));

    public static XsrResult<SidecarCachedContent> Resource(SidecarHostApi api, string package) =>
        api.ReadResource(new(package, XsrSemanticId.Parse("example.note.icon")));

    public static XsrResult<SidecarCachedContent> Ui(SidecarHostApi api, string package) =>
        api.ReadUiModule(new(package, XsrSemanticId.Parse("example.note.panel")));

    public static ValueTask<XsrResult<IReadOnlyList<SidecarPackageSnapshot>>> CatalogAsync(SidecarHostApi api, CancellationToken token)
    {
        if (!api.Queries.TryResolve(SidecarHostRoutes.Catalog, out var route))
            return ValueTask.FromResult(XsrResult.Failure<IReadOnlyList<SidecarPackageSnapshot>>(XsrRuntimeErrors.RouteNotFound()));
        return api.Queries.QueryAsync<SidecarCatalogQuery, IReadOnlyList<SidecarPackageSnapshot>>(
            route, new(), cancellationToken: token);
    }

    public static XsrResult<SidecarSessionInfo> Session(SidecarHostApi api, string package) => api.ReadSession(package);

    public static ValueTask<XsrResult<TimeSpan>> HealthAsync(SidecarHostApi api, string package, CancellationToken token) =>
        api.PingAsync(new(package, TimeSpan.FromSeconds(2)), token);

    public static async ValueTask<XsrResult> ConsumeStreamAsync(SidecarHostApi api, string package,
        Func<SidecarBinaryValue, ValueTask> consume, CancellationToken token)
    {
        var opened = await api.OpenStreamAsync(new(package, XsrSemanticId.Parse("example.note.history"),
            new(SidecarWireCodecs.I32, SidecarWireCodecs.Encode(SidecarWireCodecs.I32, 2)), TimeSpan.FromSeconds(10)), token);
        if (!opened.IsSuccess) return XsrResult.Failure(opened.Error!);
        await using var stream = opened.Value!;
        await foreach (var value in stream.ReadAllAsync(token)) await consume(value);
        return await stream.Completion;
    }

    public static ValueTask<XsrResult> StopAsync(SidecarHostApi api, string package, CancellationToken token) =>
        api.StopAsync(package, token);
    public static ValueTask<XsrResult> RestartAsync(SidecarHostApi api, string package, CancellationToken token) =>
        api.RestartAsync(package, token);
    public static ValueTask<XsrResult> ReloadAsync(SidecarHostApi api, CancellationToken token) => api.ReloadAsync(token);
}
```

## Advanced session/transport surfaces

Session exposes handshake/registration/snapshot, activation, text/binary semantic and ById calls, event observers, one receive loop, health/metrics, streams, unregister/shutdown/dispose. Follow phase ordering.

Event observers must return promptly. RegistrationSet provides per-kind views/TryResolve/TryResolveId; StateMirror exposes a local store and admitted wire publication, not remote CLR access.

Connection owns the stream with Send/Receive/Close/Dispose/State/FailureReason. IPC owns endpoints; Bootstrap authenticates; FrameTransport frames and bounds writes to 64. None executes business or reconnects automatically. UI continues to consume immutable local facts and emit intent.


## Implementation references

- [Nexa.Xsr.Runtime/Sidecar/SidecarHostApi.Contracts.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Runtime/Sidecar/SidecarHostApi.Contracts.cs)
- [Nexa.Xsr.Runtime/Sidecar/SidecarHostApi.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Runtime/Sidecar/SidecarHostApi.cs)
- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
