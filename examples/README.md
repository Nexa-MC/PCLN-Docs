# NexaCL Alpha 12 authoring examples

These examples target the public source at
[`Nexa-MC/NexaCL`, `v2.0.0.alpha.12`](https://github.com/Nexa-MC/NexaCL/tree/v2.0.0.alpha.12).
They do not depend on an unpublished Plugin SDK package.

## Themes

Choose by outcome: presentation only → NTP, independent behavior → admitted Sidecar,
Host presentation work → the NXML lab. The examples preserve XSR ownership boundaries.

`themes/workshop` adds all nine option kinds, sliders/switch/checkbox/segments,
conditional visibility, a packaged SVG and authorized user media selection. Music is
disabled by default; no private paths or grants are shipped. Package it with the same
command below, substituting `workshop` for `twilight`.

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
dotnet run --project examples/sidecar/Example.Sidecar.csproj -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- --recipes
```

The self-test starts a real peer process and exercises current-user local IPC bootstrap,
registration, an empty state snapshot, a binary Int32 query, health, unregister and shutdown.
`SmokeHost.cs` is a protocol exercise, not the production Host or a signing bypass.
The peer requires protocol v1 and BinaryPayloads, and implements Health/Unregistration
when negotiated. The small peer intentionally remains an echo query. `ContractRecipes`
separately executes explicit DTO, frame/correlation, State/Event, Stream sequence/credit,
schema-2 UI, captions, HookSignal and negative codec examples. It builds the NFP1/NFP2
programs also used by the controlled Host fixture. Codec recipes do not prove actual
flow control, Host UI grants or production installation.

Production `.nsc` distribution needs the correct native architecture and a detached
signature from a publisher actually trusted by the launcher. No private key is included
or required for this self-test. The tutorials describe those distinct admission steps.

## NXML and Host integration lab

```sh
dotnet run --project examples/authoring-lab/Authoring.Lab.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- /absolute/path/to/PCLN-Docs
```

The real compiler/runtime and theme service verify local State projection,
intent-only/disabled input, literal data, retained draft/selection across reload/reorder,
invalid candidate preservation, sample admission, and light/dark NSS compilation.
Every fenced NXML/NSS/JSON authoring example in both locales is parsed/compiled with
explicit context for partial snippets. MSBuild XML is checked by building the project.

`HostApiRecipes.cs` compiles usage for all 14 Host routes without automatically stopping,
restarting, reloading or invoking real packages. It is Host integration, not child-to-Host RPC.
`HostFixtures.cs` gives explicit controlled grants over loopback to prove registration alone
does not run NFP1/NFP2 programs, activation changes results, and retirement restores originals.
It is not a production signature bypass or OS IPC test.

No native window is opened; portable checks do not prove native material, media, tray, IME,
or screen-reader behavior. The separate peer self-test does prove real child-process IPC.

## Execute NativeAOT output

On Linux x64 with its native toolchain:

```sh
dotnet publish examples/sidecar/Example.Sidecar.csproj -c Release -r linux-x64 -p:PublishAot=true -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -o out/sidecar
out/sidecar/Example.Sidecar --recipes
out/sidecar/Example.Sidecar --self-test
dotnet publish examples/authoring-lab/Authoring.Lab.csproj -c Release -r linux-x64 -p:PublishAot=true -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -o out/lab
out/lab/Authoring.Lab /absolute/path/to/PCLN-Docs
```

Use each OS's native tools/RID elsewhere. Record actual executions rather than relabeling
Linux evidence as cross-platform acceptance. `authoring-examples.yml` repeats these checks.
