# XSR architecture and author responsibilities

X is the execution/exchange runtime, S is business services, and R is semantic rendering. The current renderer is `Nexa.Xsr.Renderer`. UI.Next/PXML names in early design documents are historical context, not instructions to reference old assemblies from a current extension.

## Follow one action through the system

```text
User input → Renderer emits intent → Desktop composition
                                           ↓
                                  XSR command/query routes
                                           ↓
                                  Service or admitted Sidecar
                                           ↓
                                  State/Event publication
                                           ↓
                         Host-local state → Renderer
```

The process boundary separates Sidecar-private behavior from Host numeric routes, mirrors, and finite presentation. Rendering does not directly call a child process.

## X owns exchange and lifetime

X manages registration, numeric dispatch, correlation, cancellation, scopes, queues, and retirement. It does not define your business rules or decide that a page should claim success.

Use readable semantic identifiers such as `example.note.set` while authoring; execute through resolved handles. The sealed Host registry and Sidecar per-kind registration ordinals are distinct mappings. Do not assume matching numbers. Resolve again after reconnect instead of persisting numeric IDs.

Treat package, session, contract, correlation, cancellation, and deadline as one request context. This prevents old-session completions from modifying a new page.

## S owns business truth

Business logic validates input, decides effects, owns persistence, and publishes facts. It has no window, control, Avalonia dependency, or global service locator. A note handler returns a stable “too long” failure rather than showing a dialog or mutating a button.

Presentation projects explicit availability facts. Avoid competing copies of “current note” in UI and business code. The Host mirror projects remote facts; it is not a remote reference to arbitrary Sidecar objects.

## R reads local state and emits intent

The renderer owns layout, input, motion, and drawing. It does not discover services, open theme files, perform network IO, or use IPC. NXML compiles to finite Host IR, NSS calculates presentation, and backends consume prepared resources.

Drawing and hit testing share geometry. Theme changes cannot bypass virtual-list extents/anchors or modal ownership. Reproject retained entities instead of rebuilding pages and restarting entrance animations on every update.

## The four communication primitives

| Primitive | Question | Lifetime | Common mistake |
| --- | --- | --- | --- |
| Command | What effect is requested? | Admission, execution, completion/failure | Treating acceptance as completed work |
| Query | What one-off result is needed? | Correlated, cancellable, timed | Querying progress/text on each frame |
| State | What is currently true? | Snapshot, revisions, availability | Reconstructing sole current truth from events |
| Event | What just happened? | Bounded ordered occurrences | Dropping events as if they were replaceable progress |

Availability is separate from the last value. Retaining a value does not authorize interaction. Failure retires active presentation/interaction grants; renewed presentation needs a fresh snapshot, activation, and exposure.

## Three authoring formats

| Format | Authored content | Behavior authority |
| --- | --- | --- |
| NTP/1 + NSS/1 | Manifest, options, resources, finite styles | Existing Host page and business policy |
| NXML | Host pages, components, bindings, slots, input semantics | Host composition and declared State/Command |
| Sidecar UI schema 1/2 | Finite card or Text/Button/Input/Toggle/Image/Stack/Row | Admission, local module projection, current-session declarations |

A `.nxml` file in a theme does not create a page. An NXML string is not a valid schema-2 module. Legacy SDK/PXML packages, CLR objects, and patch APIs are not this wire contract.

## Resource authority and retirement

Give every subscription, task, lease, and dynamic fragment an owner. Retiring a source stops watching; leaving a page cancels its work; session termination completes exchanges and removes active extensions.

A signature establishes publisher trust, not automatic target permission. Process isolation is not an OS sandbox; NativeAOT is not authorization. External theme resources require Host picker grants. Exported option text carries no file-read authority.

## Evidence for a complete feature

Use behavior checks for inputs, protocol checks for encoding/contracts, lifecycle checks for cancellation/restart/stale results, target-platform execution for AOT/resources/installation, and visual/input evidence for presentation. One layer does not prove all others.

Next, apply the rules to a [resource-page note extension](./walkthrough).


## Implementation references

- [docs/xsr/architecture.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/architecture.md)
- [docs/xsr/service-model.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/service-model.md)
- [docs/xsr/state-model.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/state-model.md)
- [docs/xsr/nxml-renderer.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nxml-renderer.md)
