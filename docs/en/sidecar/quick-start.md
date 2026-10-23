# Build your first Sidecar

Install the .NET 10 SDK. Check out NexaCL at `v2.0.0.alpha.12` and this docs repository. `examples/sidecar` contains a standalone peer and a test-only local protocol host.

```sh
dotnet run --project examples/sidecar/Example.Sidecar.csproj -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- --self-test
```

Expected output starts with `PASS: native IPC bootstrap`. A real child process connects through a named pipe/Unix socket, proves the stdin challenge, handshakes, registers a query, sends an empty state snapshot, echoes an Int32, answers health, unregisters and exits. No production signing key is needed for this controlled test.

The sample registers `example.echo` as the first Query, so its current session's Query ContractId is 1. Numeric IDs are per kind and session, not hashes of semantic strings. Input and output use I32; replies preserve correlation IDs. Zero State registrations still require BEGIN(0)/END.

[Complete peer](https://github.com/Nexa-MC/PCLN-Docs/blob/main/examples/sidecar/Program.cs).

```sh
dotnet publish examples/sidecar/Example.Sidecar.csproj -c Release -r linux-x64 -p:PublishAot=true -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -o out/sidecar
mv out/sidecar/Example.Sidecar out/sidecar/example.nsc
chmod +x out/sidecar/example.nsc
```

Build separately for each target RID; Windows renames Example.Sidecar.exe instead. Production discovery requires the correct native executable header and an adjacent `.nsc.asc` signed by a publisher trusted by the Host. An arbitrary self-generated GPG key is not trusted automatically. Use the controlled test while arranging actual publisher admission; do not disable production verification.
