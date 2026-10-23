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
