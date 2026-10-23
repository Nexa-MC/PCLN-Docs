# Start with a working Sidecar

Build an independent endpoint with real process bootstrap, authentication, registration, Int32 query, health, and cleanup. Read [goal-first XSR design](../development/) and establish this slice before UI or new behavior.

## 1. Pin inputs

Install .NET 10. NativeAOT also needs the target OS toolchain. Use A12 source and current docs main:

```sh
git clone --branch v2.0.0.alpha.12 --depth 1 https://github.com/Nexa-MC/NexaCL.git
git clone https://github.com/Nexa-MC/PCLN-Docs.git
```

```text
examples/sidecar/
├── Example.Sidecar.csproj    Protocol/Transport only
├── Program.cs               Small independent endpoint
├── SmokeHost.cs             Test-only Host peer
└── ContractRecipes.cs       Runnable codec/state/stream/UI recipes
```

`NexaCLSourceRoot` is an explicit source reference. Do not commit workstation paths or assume a same-named SDK NuGet package.

## 2. Run real-process IPC

From the docs repository, substitute an absolute source path:

```sh
dotnet run --project examples/sidecar/Example.Sidecar.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- --self-test
```

Expected:

```text
PASS: native IPC bootstrap, registration, empty snapshot, binary query, health, unregister and shutdown.
```

The test creates a randomized current-user endpoint, starts child mode, supplies a one-use 32-byte challenge over stdin, and authenticates real IPC. It proves protocol behavior, not production publisher authorization.

## 3. Understand every phase

| Stage | Behavior | Reason |
| --- | --- | --- |
| Arguments | Peer or explicit test modes only | Invalid invocation fails |
| Bootstrap | stdin proof and connection | Authentication precedes frames |
| HELLO/WELCOME | Version/features intersection | Unnegotiated features are unavailable |
| REGISTER | `example.echo` Query, I32→I32 | Explicit argument/result types |
| Empty snapshot | BEGIN(0), END | Required even without State |
| READY/ACTIVATE | Enter execution | Ready alone is not active authorization |
| QueryRequest | Active, contract 1, I32 | Do not guess payload shape |
| QueryResult | Original correlation | Cannot complete unrelated work |
| Health/retirement | Preserve nonce, unregister, exit | Complete long-lived behavior |

The query is ordinal 1 in its kind/session, not a semantic hash or permanent global ID. The first State would independently be ID 1.

## 4. Run codec recipes

```sh
dotnet run --project examples/sidecar/Example.Sidecar.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- --recipes
```

Recipes cover versioned DTO, correlation, State/Event, stream sequence/credit encoding, schema 2, caption, HookSignal, and invalid values. They do not claim actual stream backpressure, Host UI execution, or target grants.

## 5. Publish and test NativeAOT output

Linux x64:

```sh
dotnet publish examples/sidecar/Example.Sidecar.csproj -c Release -r linux-x64 -p:PublishAot=true -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -o out/sidecar
out/sidecar/Example.Sidecar --self-test
out/sidecar/Example.Sidecar --recipes
```

Use each platform's tools and win-x64/win-arm64/linux-arm64/osx-x64/osx-arm64 where appropriate. Renaming cannot convert architectures.

Rename verified native output to `example.nsc` (Windows starts from `.exe`); preserve Unix execute permission. Production discovery additionally needs `.nsc.asc` and trusted publisher admission: [packaging/discovery](./packaging-and-discovery).

## 6. Extend toward your goal

Keep the lifecycle skeleton and add one business contract with explicit argument/result/state. For concurrency keep one receive loop and a correlation-indexed worker table, not a reader per request.

Continue with [lifecycle](./protocol-and-lifecycle) and the [note-extension design](../development/walkthrough).


## Implementation references

- [Nexa.Sidecar.Transport/SidecarBootstrap.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Transport/SidecarBootstrap.cs)
- [Nexa.Sidecar.Protocol/SidecarHandshake.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarHandshake.cs)
- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
