# Acceptance, testing, distribution

Return to the [goal](/en/development/goal-first): user action, current fact, success/failure, teardown. Test outcomes rather than private call counts.

## Four evidence layers

| Evidence | Proves | Does not prove |
| --- | --- | --- |
| --recipes | Codecs/fields/bounds/sequence/document shapes | Actual backpressure/trust/native UI |
| --self-test | Real child IPC/proof/handshake/query/shutdown | Production signatures/business grants |
| Authoring Lab | Controlled NFP1/NFP2 admission/activation/retirement and NXML/NSS retention | Production file trust/all OS backends |
| Native production admission/UI | Actual installation/resources/input/lifecycle | Untested platforms |

Loopback is not OS IPC; console success is not a UI capture; one RID is not all platforms. State these distinctions when releasing.

## Repeatable local commands

From docs root, with A12 source:

```sh
dotnet run --project examples/sidecar/Example.Sidecar.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- --recipes
dotnet run --project examples/sidecar/Example.Sidecar.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- --self-test
dotnet run --project examples/authoring-lab/Authoring.Lab.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- /absolute/path/to/PCLN-Docs
```

The lab compiles all Host API examples without automatically operating real packages. Controlled grants are not production-verification replacement.

## Execute published NativeAOT output

```sh
dotnet publish examples/sidecar/Example.Sidecar.csproj -c Release -r linux-x64 -p:PublishAot=true -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -o out/sidecar
out/sidecar/Example.Sidecar --recipes
out/sidecar/Example.Sidecar --self-test
dotnet publish examples/authoring-lab/Authoring.Lab.csproj -c Release -r linux-x64 -p:PublishAot=true -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -o out/lab
out/lab/Authoring.Lab /absolute/path/to/PCLN-Docs
```

Execution proves tested paths survive trimming/AOT, not merely compiler exit. Use native tools/RIDs per OS. Diagnose incompatible dependencies rather than reflexively disabling protections or retaining everything reflectively.

## Required regressions

| Scenario | Evidence |
| --- | --- |
| Wrong codec/result | Reject, cannot finish unrelated request |
| Invalid/incomplete registration | No partial mirror/activation |
| Zero State | Complete empty snapshot |
| Cancellation/deadline | Bounded cleanup/stable correlated outcome |
| Interrupted frame write | Close rather than reuse partial stream |
| Slow/abandoned stream | Credit bounds/completion/data release |
| UI draft/hide/navigation | Retention/current exposure/stale-click rejection |
| Patch retirement | Original/predecessor restored |
| Crash/recovery | Pending work finishes, fresh registration/snapshot |

## Diagnostics and release record

Record version/OS/RID/package/session/correlation/contract kind-ID-codec/phase/stable error/budgets. Exclude proof, keys, tokens, private notes, and whole payloads.

Reduce failures to one contract/sequence. Compare a working sample's declarations/features/coverage before changing Host architecture.

```text
Goal: submit/read extension-owned notes
Compatibility: A12/protocol1/required feature bits
Grant: ui.resources.extension-card.v1
Data: inputs/current fact/errors/persistence
Distribution: native RIDs/detached signatures
Evidence: OS/build/commands/results
Limitations: independent SDK/production publisher/untested platforms
```

Claim only verified outcomes. Develop later capabilities as new bounded slices, preserving numeric/wire meanings; API baseline changes do not excuse breaking contracts.


## Implementation references

- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
- [docs/xsr/sidecar-protocol.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-protocol.md)
- [docs/xsr/nsc-and-regional-policy.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nsc-and-regional-policy.md)
