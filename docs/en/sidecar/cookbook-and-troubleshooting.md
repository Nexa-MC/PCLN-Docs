# Sidecar cookbook and troubleshooting

Diagnose a Sidecar by the earliest failing boundary: bootstrap, negotiation, registration, activation, request handling or retirement. Preserve the initiating error when cleanup also fails.

**Version scope:** these source-level examples target `v2.0.0.alpha.14`. Use [the Plugin SDK](/en/plugin-sdk/) for current Wasm plugin authoring.

## Private note form

Follow the [worked design](../development/walkthrough): define validation, then set Command/current-enabled State/changed Event/finite module. Prove IPC first, codecs next, admitted UI last. Do not query per frame, read remote drafts, confuse registration with publisher approval, or claim persistence for an in-memory note.

## Continuous task output

Command starts work, State owns progress, Event announces completion, Stream carries bounded output. Define cancellation/retry/idempotency. Credit pauses production; navigation cancels page-owned streams. Background work needs an explicit business owner rather than a dead control's lifetime.

## Display-only changes

Use UiPatch for captions and granted FunctionPatch for display values. Do not alter directory/account/download trust. Verify before registration, active, and retired results.

## Failure phases

| Symptom | Phase/check |
| --- | --- |
| Not discovered | Top-level BaseDirectory, identity/suffix/budget |
| Rejected before launch | Native OS/RID, bytes/signature/pinned publisher |
| Immediate child exit | Arguments/stdin proof/current-user endpoint/authentication before frames |
| Failure after WELCOME | Features/kind/codec/count/hash/target/resources |
| Never Active | Complete snapshot including zero-state case, READY/order |
| Request rejection | Active/package/per-kind ID/argument-result codecs |
| Accepted but no success | Completion and authoritative State |
| Timeout | Blocked receive loop, competing readers, cancellation |
| Stream failure | Sequence1/next-sequence End/credit/budgets |
| Cached UI not visible | Grant/schema/activation/exposure |
| Disabled input | Typed/available bindings and ancestor predicates |
| Old click after restart | Session/activation/exposure retirement |
| No recovery after attempts | Quarantine, fix cause and explicitly restart |

## Avoid false fixes

Do not disable trust checks for codec mistakes, translate failures into empty success, add synchronous RPC for current state, or escape lifetime via unbounded queues/retries/reflection.

Compare against a minimal working chain. Missing Host targets need an ownership/type/cancellation/retirement/test proposal, not an invented hidden API.


## Implementation references

- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.14/docs/xsr/sidecar-host-api.md)
- [docs/xsr/sidecar-ui-modules.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.14/docs/xsr/sidecar-ui-modules.md)
- [Nexa.Xsr.Runtime/Sidecar/SidecarSupervisor.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.14/Nexa.Xsr.Runtime/Sidecar/SidecarSupervisor.cs)

## Check your result

Reduce the problem to the unchanged self-test plus one added contract. Record phase and correlation, and verify a deliberate failure before restoring the full feature.
