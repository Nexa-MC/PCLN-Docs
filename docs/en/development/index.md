# Choose a development route

Start with what the user should be able to do. NexaCL offers several extension
boundaries, each with a different owner, package format and compatibility contract.
Choosing the right boundary avoids building a feature on an API that cannot provide it.

## Choose by outcome

| Goal | Start here | Owner and boundary |
| --- | --- | --- |
| Build an installable plugin with pages, actions and application calls | [Plugin SDK](../plugin-sdk/) | Wasm executed by PluginSidecar; Host-granted ABI 100 capabilities |
| Change colors, spacing, fonts and theme options | [NTP/1 themes](../theme-packs/) | Declarative styles and admitted resources; no new executable behavior |
| Implement a separately supervised native endpoint | [Sidecar](../sidecar/) | Binary protocol, authenticated process lifecycle and publisher admission |
| Contribute Host pages or understand retained UI behavior | [NXML](../nxml/) | Host rendering, stable identities and explicit state/input contracts |
| Maintain a historical PXML application | [PXML compatibility reference](../pxml-compiler/) | Matching legacy compiler and runtime; separate from current plugin NXML |

For example, changing a heading color belongs to a theme. A page that reads
instances and runs a confirmed action belongs to a plugin with those capabilities.
An independent native service may need the Sidecar protocol. A visual mockup alone
does not decide who owns the underlying data or operation.

## Use the correct version baseline

The Plugin SDK chapters describe standalone SDK 0.2.0-alpha.10 and a recorded Host
implementation snapshot. They explicitly mark unmapped operations. The theme,
native Sidecar and Host NXML examples remain pinned to `v2.0.0.alpha.14` so their
source-level commands are reproducible. PXML is a historical compatibility section.
Do not combine instructions from these baselines without checking their contracts.

## Follow one working path

1. Read [goal-first development](goal-first) and name a visible success and failure.
2. Read [ownership and XSR](xsr-architecture) if the feature crosses component boundaries.
3. Build the complete example for the chosen route before changing its contracts.
4. Add one behavior, verify its result, then test denial, cancellation and owner retirement.
5. Distribute the tested artifact with its version requirements and known limits.

The [resource-note design](walkthrough) demonstrates how to reason about persistence
and input ownership. It is labelled as a design, not presented as a shipped feature.
The [platform guide](platform-and-runtime) explains why an unavailable measurement
must not be interpreted as a real zero.

## Read examples as evidence

Complete examples are in the [website repository](https://github.com/Nexa-MC/PCLN-Docs/tree/main/examples)
and the [SDK repository](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/tree/main/samples).
A compile checks syntax and linkage; an integration test checks actual Host behavior;
production admission checks publisher and package authority. Keep those claims separate.
