# Writing a Sidecar

This guide covers **NexaCL Firefly Alpha 12's Host and portable wire libraries**. Wire protocol version 1 evolves by appending message/registration numbers; this does not freeze an independent Plugin SDK release.

A Sidecar runs in its own process and registers capabilities through bounded asynchronous local IPC. It is not a DLL injected into the launcher, and a legacy `.pnp` cannot be renamed to `.nsc`.

1. [Build your first Sidecar](quick-start).
2. [Protocol and lifecycle](protocol-and-lifecycle).
3. [Data and Host API](host-api).
4. [UI and extensions](ui-and-extensions).
5. [Testing and distribution](testing-and-publishing).

The example references actual Nexa.Sidecar.Protocol and Nexa.Sidecar.Transport source projects, without Desktop, Avalonia or private Runtime dependencies. The independently maintained execution engine/Plugin SDK is outside this Host delivery; do not assume a stable Nexa.Plugin NuGet package or legacy AXAML/plugin compatibility.

[Complete Host reference](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md).
