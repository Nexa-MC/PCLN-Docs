# Understand the SDK, runtime and Host

A NexaCL plugin is a package executed under an admitted identity. It contributes
behavior through negotiated capabilities instead of receiving the launcher's CLR
objects. This separation lets the Host keep ownership of account data, game
instances, UI confirmation and filesystem grants.

## Follow one button click

The plugin registers an NXML page and a typed action during initialization. After
activation the Host renders the page. A button expresses the registered action ID;
the Host validates the target and asks for confirmation when required. PluginSidecar
then dispatches the callback under the admitted load identity. The plugin returns
a typed result, and the Host records or presents that result.

The action does not run in the renderer, and its NXML does not contain a second
privileged code path. The same authority checks apply whether the call originated
from UI, another supported consumer or a workflow.

## Who owns what

| Component | Responsibility | What a plugin receives |
| --- | --- | --- |
| Bootstrap V1 | Negotiation, lifecycle and generic values/errors | An admitted context and callback scope |
| ABI 100 SDK | Typed models, codecs, capability wrappers and C headers | A way to construct and decode calls |
| PluginSidecar | Isolation, load coordination, callbacks and resource retirement | Bounded execution with explicit continuations |
| NexaCL Host | Application services, grants, confirmation and platform policy | Public results and opaque handles |
| Market integration | Acquisition, publisher/entitlement verification and encrypted delivery | Only the admission outcome permitted by Host policy |

An SDK wrapper is not a service implementation. The catalog can describe an
operation before a Host maps it. A successful negotiation also does not waive
per-call permission, phase, ownership and revision checks.

## Separate the version axes

`0.2.0-alpha.10` is the authoring package version, `1` is Bootstrap V1, and `100` is
the stable ABI selected for this SDK. Capability minimum versions in the manifest
are another contract field; do not replace every `1` with `100`.

The independent SDK preserves the Bootstrap signatures, 346 current operations,
model fields and fingerprints extracted from PluginSidecar alpha.9. The 22 retained
Nexa preview dispatch slots are a separate compatibility catalog. Neither makes
historical PCL.N.Plugin.* injection plugins compatible with this runtime.

## Transport and generated code

`contracts/abi100.json` is build input for static C# and C bindings. JSON is not the
plugin-to-Host transport. SDK-local method numbers are not new Sidecar opcodes;
the existing binary Host ABI remains the communication boundary.

The executable production profile is import-free Wasm. Managed Bootstrap examples
help test or embed the contract; ordinary DLLs are not an alternate production
Desktop loading route. See [Wasm execution](wasm-sdk.md) for the actual guest ABI.

## Maintain one contract source

Edit contracts and generators in this SDK repository, regenerate bindings, and
validate compatibility before publishing an immutable bundle. Runtime consumers
should pin that bundle instead of maintaining a divergent editable contract copy.
The extraction of every runtime consumer is a separate integration task; the
published SDK does not itself prove every consumer has migrated.

Start with [loading](loading-contract.md), then use the [support snapshot](host-support.md)
to choose the application capabilities your plugin can actually depend on.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/architecture.md) · Apache-2.0.
