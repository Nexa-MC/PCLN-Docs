using System.Security.Cryptography;
using Nexa.Sidecar.Protocol;
using Nexa.Sidecar.Transport;
using Nexa.Xsr;
using Nexa.Xsr.Runtime;

// Explicit controlled Host, not a production executable-signature or target-grant bypass.
internal static class HostFixtures
{
    internal static async Task RunAsync()
    {
        using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(15));
        var token = timeout.Token;
        var title = XsrSemanticId.Parse("ui.resource.project-title.v1");
        var count = XsrSemanticId.Parse("ui.resource.download-count.v1");
        var functions = new XsrFunctionPatchRuntime(new XsrFunctionTarget(title, XsrFunctionShape.String),
            new XsrFunctionTarget(count, new(XsrFunctionValueKind.Int64, XsrFunctionValueKind.Int64)));
        var titlePoint = functions.Resolve(title);
        var countPoint = functions.Resolve(count);
        var (hostStream, peerStream) = SidecarLoopbackStream.CreatePair();
        using var peer = new SidecarConnection(peerStream);
        using var session = new SidecarHostSession(new SidecarConnection(hostStream), "AuthoringLab")
            { FunctionPatchAdmission = new(functions, title, count) };
        var handshake = session.HandshakeAsync(token);
        var hello = await Read(SidecarMessageType.Hello);
        await Send(SidecarMessageType.Welcome,
            SidecarHandshake.EncodeWelcome(SidecarProtocol.Version, Guid.NewGuid(), null, SidecarFeatures.None), hello.CorrelationId);
        await handshake;

        byte[] suffix = ContractRecipes.TitleSuffixProgram(" [example]");
        byte[] increment = ContractRecipes.CountIncrementProgram();
        var registration = session.AcceptRegistrationAsync(token);
        await Send(SidecarMessageType.RegisterBegin, SidecarRegistration.EncodeBegin(2));
        await Send(SidecarMessageType.RegisterItem, SidecarRegistration.EncodeItem(new(
            SidecarRegistrationKind.FunctionPatch, "example.title.suffix", 0, 0, suffix, SHA256.HashData(suffix), TargetSemanticId: title.Value)));
        await Send(SidecarMessageType.RegisterItem, SidecarRegistration.EncodeItem(new(
            SidecarRegistrationKind.FunctionPatch, "example.count.increment", 0, 0, increment, SHA256.HashData(increment), TargetSemanticId: count.Value)));
        await Send(SidecarMessageType.RegisterEnd, SidecarRegistration.EncodeEnd());
        await registration;
        var snapshot = session.AcceptStateSnapshotAsync(token);
        await Send(SidecarMessageType.StateSnapshotBegin, SidecarStateSnapshot.EncodeBegin(0));
        await Send(SidecarMessageType.StateSnapshotEnd, SidecarStateSnapshot.EncodeEnd());
        await snapshot;
        await Read(SidecarMessageType.Ready);
        Check(functions.Invoke(titlePoint, "Title", static value => value) == "Title", "registration alone must not execute patches");
        await session.ActivateAsync(token);
        await Read(SidecarMessageType.Activate);
        Check(functions.Invoke(titlePoint, "Title", static value => value) == "Title [example]", "NFP1 admitted execution");
        Check(functions.InvokeValues(countPoint, new[] { XsrFunctionValue.From(5L) },
            static values => values[0]).AsInt64() == 6, "NFP2 admitted primitive execution");
        await session.DeactivateAsync(token);
        await Read(SidecarMessageType.Deactivate);
        Check(functions.Invoke(titlePoint, "Title", static value => value) == "Title", "deactivation revokes execution");
        Check(functions.InvokeValues(countPoint, new[] { XsrFunctionValue.From(5L) },
            static values => values[0]).AsInt64() == 5, "deactivation restores original primitive result");
        Console.WriteLine("PASS: controlled Host admission, snapshot, NFP1/NFP2 activation and retirement; loopback transport only.");

        ValueTask Send(SidecarMessageType type, byte[] bytes, SidecarCorrelationId id = default) =>
            peer.SendAsync(new(SidecarProtocol.Version, type, SidecarFrameTraits.None,
                id.IsAssigned ? id : SidecarCorrelationId.Create(), bytes), token);
        async ValueTask<SidecarFrame> Read(SidecarMessageType type)
        {
            var frame = await peer.ReceiveAsync(token);
            Check(frame.MessageType == type, "expected " + type);
            return frame;
        }
    }
    private static void Check(bool valid, string reason) { if (!valid) throw new InvalidOperationException(reason); }
}
