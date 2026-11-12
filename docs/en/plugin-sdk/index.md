# NexaCL plugin development

Build a plugin that runs in PluginSidecar and adds capabilities to NexaCL through
an explicit Host contract. Start with a small working plugin, then add only the
permissions and capabilities its feature needs.

This guide covers **SDK 0.2.0-alpha.10, Bootstrap V1 and ABI 100**. Those numbers
identify different contracts. The SDK includes 346 operations; the recorded Host
maps 297 of them. Consult [Host support](host-support.md) before choosing a feature.
A mapping in source does not establish support in an older installed Alpha.

## Learn by building

Follow the chapters in order. Each chapter identifies its source files, explains
what changes, and gives an observable result before introducing another concept.

1. [Build and load your first plugin](quickstart.md).
2. [Add a page and a confirmed action](tutorials/page-and-action.md).
3. [Introduce state and persistent storage](tutorials/state-and-storage.md).
4. [Run and observe background work](tutorials/workflows.md).
5. [Test, package and publish](tutorials/test-and-release.md).

The first two chapters use the same executable project. The storage and workflow
chapters each use a separate complete SDK example, so their behavior can be tested
without adding unrelated UI code.

## Understand the system

Read [architecture](architecture.md) for ownership, [loading](loading-contract.md)
for callback order, and [permissions](permissions.md) for authority. The
[asynchronous call guide](guides/asynchronous-calls.md) explains why a returned
operation is not a completed effect. [Runtime services](runtime-services.md)
provides the detailed event, workflow and recovery behavior.

## Complete a task

- [List instances and use pagination](how-to/read-instances.md).
- [Prepare and execute a change](how-to/mutations.md).
- [Handle files, package assets and blobs](how-to/files.md).
- [Register a catalog provider](business-providers.md).
- [Support offline use](guides/offline.md).
- [Diagnose a failed load or call](errors.md).
- [Upgrade from the old SDK](migration.md).

## Look up a contract

The [API reference](api/index.md) covers every operation, including unmapped
operations, with exact permission, phase, idempotency and model links. Use the
[model reference](api/models.md) for fields and enum spelling, the
[package reference](packaging.md) for the manifest, and the [Wasm reference](wasm-sdk.md)
for memory, continuations and codecs.

[Online documentation](https://docs.pcln.top/en/plugin-sdk/) ·
[Template](https://github.com/Nexa-MC/NexaCL-Plugin-Template) ·
[Documentation conventions](documentation.md)

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/index.md) · Apache-2.0.
