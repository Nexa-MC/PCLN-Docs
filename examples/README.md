# NexaCL Alpha 12 authoring examples

These examples target the public source at
[`Nexa-MC/NexaCL`, `v2.0.0.alpha.12`](https://github.com/Nexa-MC/NexaCL/tree/v2.0.0.alpha.12).
They do not depend on an unpublished Plugin SDK package.

## Theme

`themes/twilight` is a complete NTP/1 directory with color, range-slider and Boolean-switch
options, typed NSS tokens and light/dark conditions. From the NexaCL checkout:

```sh
python eng/themes/pack.py ../PCLN-Docs/examples/themes/twilight --output ../twilight.ntp
```

The output must be outside the source directory. Import/preview the archive in the
launcher's appearance settings; runtime capability/resource/style admission still applies.

## Sidecar

With .NET 10, from this documentation checkout:

```sh
dotnet run --project examples/sidecar/Example.Sidecar.csproj -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- --self-test
```

The self-test starts a real peer process and exercises current-user local IPC bootstrap,
registration, an empty state snapshot, a binary Int32 query, health, unregister and shutdown.
`SmokeHost.cs` is a protocol exercise, not the production Host or a signing bypass.
The peer requires protocol v1 and BinaryPayloads, and implements Health/Unregistration
when negotiated. It intentionally does not implement commands, state, streams or UI.

Production `.nsc` distribution needs the correct native architecture and a detached
signature from a publisher actually trusted by the launcher. No private key is included
or required for this self-test. The tutorials describe those distinct admission steps.
