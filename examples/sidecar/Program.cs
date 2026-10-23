using Nexa.Sidecar.Protocol;
using Nexa.Sidecar.Transport;

if (args is ["--self-test"])
{
    await SmokeHost.RunAsync();
    return;
}
if (args is not ["--nexa-sidecar", "--endpoint", var endpoint])
    throw new ArgumentException("Use --self-test, or let an admitted Host start this executable.");
await RunPeerAsync(endpoint);

static async Task RunPeerAsync(string endpoint)
{
    using var stop = new CancellationTokenSource();
    Console.CancelKeyPress += (_, e) => { e.Cancel = true; stop.Cancel(); };
    using var startup = CancellationTokenSource.CreateLinkedTokenSource(stop.Token);
    startup.CancelAfter(TimeSpan.FromSeconds(30));
    using var connection = new SidecarConnection(await SidecarBootstrap.ConnectAsync(
        endpoint, Console.OpenStandardInput(), startup.Token));
    var hello = await connection.ReceiveAsync(startup.Token);
    if (hello.MessageType != SidecarMessageType.Hello) throw new InvalidDataException("Expected HELLO.");
    var details = SidecarHandshake.DecodeHelloDetails(hello.Payload.Span);
    if (details.ProtocolVersion != SidecarProtocol.Version || !details.Features.HasFlag(SidecarFeatures.BinaryPayloads))
        throw new InvalidDataException("This example requires protocol v1 and BinaryPayloads.");
    var features = details.Features & (SidecarFeatures.BinaryPayloads | SidecarFeatures.Health | SidecarFeatures.Unregistration);
    await Send(SidecarMessageType.Welcome,
        SidecarHandshake.EncodeWelcome(SidecarProtocol.Version, Guid.NewGuid(), null, features), hello.CorrelationId, startup.Token);
    var query = new SidecarRegistrationItem(SidecarRegistrationKind.Query, "example.echo", 0, SidecarWireCodecs.I32)
    { ResultCodecId = SidecarWireCodecs.I32 };
    await Send(SidecarMessageType.RegisterBegin, SidecarRegistration.EncodeBegin(1), default, startup.Token);
    await Send(SidecarMessageType.RegisterItem, SidecarRegistration.EncodeItem(query), default, startup.Token);
    await Send(SidecarMessageType.RegisterEnd, SidecarRegistration.EncodeEnd(), default, startup.Token);
    // No State declarations still require a complete, empty snapshot.
    await Send(SidecarMessageType.StateSnapshotBegin, SidecarStateSnapshot.EncodeBegin(0), default, startup.Token);
    await Send(SidecarMessageType.StateSnapshotEnd, SidecarStateSnapshot.EncodeEnd(), default, startup.Token);
    if ((await connection.ReceiveAsync(startup.Token)).MessageType != SidecarMessageType.Ready)
        throw new InvalidDataException("Expected READY.");
    startup.CancelAfter(Timeout.InfiniteTimeSpan);
    bool active = false, unregistered = false;
    while (!stop.IsCancellationRequested)
    {
        var frame = await connection.ReceiveAsync(stop.Token);
        switch (frame.MessageType)
        {
            case SidecarMessageType.Activate when !unregistered:
                active = true;
                break;
            case SidecarMessageType.Deactivate:
                active = false;
                break;
            case SidecarMessageType.QueryRequest when active:
                var request = SidecarDataMessages.DecodeBinaryRequest(frame.Payload.Span);
                bool valid = request.ContractId == 1 && request.Value.CodecId == SidecarWireCodecs.I32;
                var value = valid ? request.Value : new SidecarBinaryValue(SidecarWireCodecs.I32,
                    SidecarWireCodecs.Encode(SidecarWireCodecs.I32, 0));
                await Send(SidecarMessageType.QueryResult, SidecarDataMessages.EncodeBinaryResult(
                    valid, value, valid ? null : "xsr.contract_mismatch"), frame.CorrelationId, stop.Token);
                break;
            case SidecarMessageType.HealthPing when features.HasFlag(SidecarFeatures.Health):
                await Send(SidecarMessageType.HealthPong, SidecarControlMessages.EncodeHealth(
                    SidecarControlMessages.DecodeHealth(frame.Payload.Span)), frame.CorrelationId, stop.Token);
                break;
            case SidecarMessageType.Cancel:
                _ = SidecarControlMessages.DecodeCancel(frame.Payload.Span);
                // Echo completes synchronously; there is no retained worker to cancel.
                break;
            case SidecarMessageType.Unregister when !active && features.HasFlag(SidecarFeatures.Unregistration):
                unregistered = true;
                await Send(SidecarMessageType.Unregistered, SidecarControlMessages.EncodeUnregister(
                    SidecarControlMessages.DecodeUnregister(frame.Payload.Span)), frame.CorrelationId, stop.Token);
                break;
            case SidecarMessageType.Shutdown when !active:
                return;
            default:
                throw new InvalidDataException($"Unexpected frame: {frame.MessageType}.");
        }
    }

    ValueTask Send(SidecarMessageType type, byte[] payload, SidecarCorrelationId correlation, CancellationToken token) =>
        connection.SendAsync(new(SidecarProtocol.Version, type, SidecarFrameTraits.None,
            correlation.IsAssigned ? correlation : SidecarCorrelationId.Create(), payload), token);
}
