using System.Diagnostics;
using System.Security.Cryptography;
using Nexa.Sidecar.Protocol;
using Nexa.Sidecar.Transport;

// A protocol exercise, not the production Host or a signature-verification bypass.
internal static class SmokeHost
{
    internal static async Task RunAsync()
    {
        using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(20));
        var token = timeout.Token;
        using var listener = SidecarIpcListener.Bind("nexa-docs-" + Guid.NewGuid().ToString("N"));
        string executable = Environment.ProcessPath ?? throw new IOException("Process path is unavailable.");
        var start = new ProcessStartInfo(executable) { UseShellExecute = false, RedirectStandardInput = true };
        if (Path.GetFileNameWithoutExtension(executable).Equals("dotnet", StringComparison.OrdinalIgnoreCase))
            start.ArgumentList.Add(Environment.GetCommandLineArgs()[0]);
        start.ArgumentList.Add("--nexa-sidecar"); start.ArgumentList.Add("--endpoint"); start.ArgumentList.Add(listener.Endpoint);
        using var child = Process.Start(start) ?? throw new IOException("Could not start the example peer.");
        try
        {
            byte[] challenge = RandomNumberGenerator.GetBytes(SidecarBootstrap.ChallengeSize);
            await child.StandardInput.BaseStream.WriteAsync(challenge, token);
            await child.StandardInput.BaseStream.FlushAsync(token);
            using var stream = await listener.AcceptAsync(token);
            await SidecarBootstrap.AuthenticateAsync(stream, challenge, token);
            CryptographicOperations.ZeroMemory(challenge);
            using var connection = new SidecarConnection(stream);
            var helloId = SidecarCorrelationId.Create();
            await Send(SidecarMessageType.Hello, SidecarHandshake.EncodeHello(
                SidecarProtocol.Version, "example", SidecarFeatures.BinaryPayloads | SidecarFeatures.Health | SidecarFeatures.Unregistration), helloId);
            var welcome = await Read(SidecarMessageType.Welcome);
            Check(welcome.CorrelationId == helloId, "WELCOME correlation");
            Check(SidecarHandshake.DecodeWelcomeDetails(welcome.Payload.Span).NegotiatedVersion == SidecarProtocol.Version, "version");
            Check(SidecarRegistration.DecodeBegin((await Read(SidecarMessageType.RegisterBegin)).Payload.Span) == 1, "registration count");
            var item = SidecarRegistration.DecodeItem((await Read(SidecarMessageType.RegisterItem)).Payload.Span);
            Check(item.Kind == SidecarRegistrationKind.Query && item.SemanticId == "example.echo", "query declaration");
            await Read(SidecarMessageType.RegisterEnd);
            Check(SidecarStateSnapshot.DecodeBegin((await Read(SidecarMessageType.StateSnapshotBegin)).Payload.Span) == 0, "empty snapshot");
            await Read(SidecarMessageType.StateSnapshotEnd);
            await Send(SidecarMessageType.Ready, []);
            await Send(SidecarMessageType.Activate, []);
            var queryId = SidecarCorrelationId.Create();
            await Send(SidecarMessageType.QueryRequest, SidecarDataMessages.EncodeBinaryRequest(1,
                new(SidecarWireCodecs.I32, SidecarWireCodecs.Encode(SidecarWireCodecs.I32, 42))), queryId);
            var reply = await Read(SidecarMessageType.QueryResult);
            var result = SidecarDataMessages.DecodeBinaryResult(reply.Payload.Span);
            Check(reply.CorrelationId == queryId && result.Success &&
                (int)SidecarWireCodecs.Decode(result.Value.CodecId, result.Value.Span) == 42, "binary echo");
            var healthId = SidecarCorrelationId.Create();
            await Send(SidecarMessageType.HealthPing, SidecarControlMessages.EncodeHealth(7), healthId);
            var pong = await Read(SidecarMessageType.HealthPong);
            Check(pong.CorrelationId == healthId && SidecarControlMessages.DecodeHealth(pong.Payload.Span) == 7, "health");
            await Send(SidecarMessageType.Deactivate, []);
            await Send(SidecarMessageType.Unregister, SidecarControlMessages.EncodeUnregister("smoke complete"));
            await Read(SidecarMessageType.Unregistered);
            await Send(SidecarMessageType.Shutdown, []);
            await child.WaitForExitAsync(token);
            Check(child.ExitCode == 0, "clean child exit");
            Console.WriteLine("PASS: native IPC bootstrap, registration, empty snapshot, binary query, health, unregister and shutdown.");

            ValueTask Send(SidecarMessageType type, byte[] bytes, SidecarCorrelationId id = default) =>
                connection.SendAsync(new(SidecarProtocol.Version, type, SidecarFrameTraits.None,
                    id.IsAssigned ? id : SidecarCorrelationId.Create(), bytes), token);
            async Task<SidecarFrame> Read(SidecarMessageType type)
            {
                var frame = await connection.ReceiveAsync(token);
                Check(frame.MessageType == type, "expected " + type);
                return frame;
            }
        }
        finally { if (!child.HasExited) child.Kill(entireProcessTree: true); }
    }

    private static void Check(bool value, string message)
    { if (!value) throw new InvalidDataException(message); }
}
