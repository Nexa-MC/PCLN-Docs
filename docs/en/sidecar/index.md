# Sidecar authoring: independently owned capabilities

Choose this route when you are implementing a separately supervised native Sidecar using the launcher’s binary protocol. For an installable Wasm plugin hosted by PluginSidecar, start with the Plugin SDK tutorial instead.

**Version scope:** these source-level examples target `v2.0.0.alpha.14`. Use [the Plugin SDK](/en/plugin-sdk/) for current Wasm plugin authoring.

A Sidecar executes independently. Host owns trust, sessions, registries, mirrors, permissions, and finite presentation; the peer owns business code, private state, and dependencies. The model is “register once → execute numeric contracts → observe state → render locally.”

## Decide whether a process is needed

Use [themes](../theme-packs/) for appearance. For new behavior/data, read [goal-first XSR design](../development/) and choose an exposed target. A color change does not need a process; new behavior does not authorize bypassing Host policy.

| Outcome | A14 route |
| --- | --- |
| Independent operation/result | Command/Query with argument/result codecs |
| Continuously visible fact | State, complete snapshot, then deltas |
| Occurrence/continuous output | Event or credit-based Stream |
| Shared UI, standalone pages and onboarding | NXML schema 3 with Nxml / Pages |
| Automatic function targets | Target-build catalog, AutomaticFunctions and NFP3 |
| Finite resource-page form | Granted extension-card slot, schema 2 |
| Caption/search signal/display patch | Exact finite target/ABI, not arbitrary injection |

## What this guide covers

The baseline is `v2.0.0.alpha.14` Host and portable Protocol/Transport. Protocol version is 1, still evolving before the independent SDK freeze; source examples do not promise a published stable SDK package.

The independent executor, Plugin SDK, and package/UI-IR freeze belong to another project. We teach verified protocol integration, business ownership, and Host cooperation without inventing attributes, NuGet packages, manifest fields, or installation controls.

## Reading route

1. [First Sidecar](./quick-start): real child-process echo.
2. [Protocol/lifecycle](./protocol-and-lifecycle): features, registration, snapshots, IDs, budgets, retirement.
3. [Commands/queries/codecs](./commands-and-queries): primitive/DTO values, correlation, cancellation, errors, idempotency.
4. [State/events/streams](./state-events-streams): facts, occurrences, credit, bounded consumption.
5. [UI/extensions](./ui-and-extensions): every node/reference, images, drafts, exposure.
6. [Signals/patches](./signals-and-patches): exact targets and finite binary ABIs.
7. [Host API](./host-api): all 14 composition routes and direct-method semantics.
8. [Packaging/discovery](./packaging-and-discovery): native `.nsc`, bootstrap, trust, supervision.
9. [Testing/distribution](./testing-and-publishing): self-tests, AOT, production admission, evidence.
10. [Cookbook/troubleshooting](./cookbook-and-troubleshooting): goals to contracts and failure phases.

## Evidence boundaries

`examples/sidecar --self-test` uses a real child, pipe/socket, and 32-byte proof to exercise registration, query, and shutdown. `--recipes` runs DTO/State/Event/Stream/UI codecs and rejection cases.

Codec success is not a target grant; local IPC is not production installation; Linux AOT is not Windows/macOS execution. Each chapter identifies which side owns a snippet and its prerequisites.


## Implementation references

- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.14/docs/xsr/sidecar-host-api.md)
- [docs/xsr/nxml-renderer.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.14/docs/xsr/nxml-renderer.md)


New: [shared NXML/pages](nxml-pages), [automatic NFP3 functions](automatic-functions), [platform/runtime](../development/platform-and-runtime).

## Check your result

Build the first Sidecar and run its real-process self-test before adding UI or business contracts. Passing this test establishes protocol behavior, not production publisher approval.
