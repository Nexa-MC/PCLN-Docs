# Signals, captions, finite Function Patch

Choose by outcome: observing search completion, changing a caption, and transforming a displayed result use distinct contracts. Publisher trust is not arbitrary method authority.

## Exact product targets

| Target | Kind | Grant |
| --- | --- | --- |
| ui.resources.search.v1 | Intent | Search-button value search, catch only when granted |
| event.resources.search-completed.v1 | Event | success/failure only |
| ui.resources.search-label.v1 | UiPatch | Caption/accessibility, ≤16 characters |
| ui.resource.project-title.v1 | Function | Display string→string |
| ui.resource.download-count.v1 | Function | Display I64→I64; negative presentation clamps to zero |

Completion contains no search text/path/account/results. Automatic search/download/install is not this catch grant. Display patches do not change provider IDs, persisted facts, downloads, or trust.

## Caption recipe

```csharp
byte[] content = SidecarUiCaptionPatch.Encode("Search notes");
var patch = new SidecarRegistrationItem(SidecarRegistrationKind.UiPatch,
    "example.search.caption", 0, 0, content,
    System.Security.Cryptography.SHA256.HashData(content),
    TargetSemanticId: "ui.resources.search-label.v1");
```

Ordered TLV: schema U32=1, caption Str. Payload ≤2048; target supplies a tighter nonempty/control-free character limit. Visual/accessibility text change together; retirement restores predecessor/localization. Limits: 64 targets, 128/session, 256 active, 32/target. Latest live activation wins.

## Observe or catch a signal

EventListen observes matches. IntentWait matches once per activation without consuming. Catch kinds may consume only explicitly granted points.

NXS1 = magic, mode byte 0 observe/1 consume, strict UTF-8 exact-match text ≤512 bytes; empty matches all. Flags/codec zero, target/hash required.

```csharp
byte[] predicate = [.. "NXS1"u8.ToArray(), 0, .. System.Text.Encoding.UTF8.GetBytes("success")];
var listen = new SidecarRegistrationItem(SidecarRegistrationKind.EventListen,
    "example.search.completed", 0, 0, predicate,
    System.Security.Cryptography.SHA256.HashData(predicate),
    TargetSemanticId: "event.resources.search-completed.v1");
```

Decode HookSignal and check ActivationId/Kind/ContractId/Sequence/Value. Discard old activation notifications; reactivation renews IntentWait. Limits: queue128/activation, bindings256 global/32 per point/128 per session. Overflow revokes/fails rather than blocking/dropping; catch consumes only after notification admission.

## Function execution order

```text
HEAD → ARGS → REPLACE or original → TAIL → RETURN
```

| Phase | Authority |
| --- | --- |
| Head1 | Set a result before skipping |
| Args2 | Same-shape argument changes |
| Tail3 | After successful body/replacement |
| Return4 | Transform final result |
| Replace5 | Set result/skip; first successful replacement wins |

Order is activation then registration within phase. Original exceptions propagate and skip post-body code. Same-point reentry runs original. Execution is local, finite, with no synchronous IPC/reflection/Harmony/remote delegates.

## NFP1 title-suffix recipe

```text
NFP1 | ABI=1 | phase=4 | instructionCount=5
2        load result
3,len,s  load UTF-8 suffix
4        concatenate
6        store result
8        terminal empty-stack end
```

TitleSuffixProgram in [ContractRecipes.cs](https://github.com/Nexa-MC/PCLN-Docs/blob/main/examples/sidecar/ContractRecipes.cs) builds this payload. Register FunctionPatch/hash against the title target. HostFixtures proves registration alone leaves Title unchanged, activation yields Title [example], and deactivation restores Title using controlled loopback, not production trust bypass.

## NFP2 count-increment recipe

Supports 0–8 String/Bool/I32/I64/F64 arguments and primitive/Void result. Strings ≤2048; doubles finite; Void only as result. Header: NFP2/version1/phase/argument count/result kind/argument kinds/u16 instruction count. Primitive kinds match codecs0–4, Void7.

CountIncrementProgram loads result, I64(1), adds, stores, ends. HostFixtures executes 5→6 and restores 5 after retirement.

| Opcode | Operand | Meaning |
| --- | --- | --- |
| 1 | u8 index | Argument load |
| 2 | None | Tail/Return result load |
| 3 | kind/len/value | Constant |
| 4 | None | Checked addition/bounded concatenate |
| 5 | u8 index | Args store |
| 6 | None | Result store |
| 7 | None | Head/Replace skip |
| 8 | None | Final empty-stack end |
| 9 | None | Same-kind equality→Bool |
| 10 | None | Boolean not |

No jumps, loops, calls, IO, or object construction. Host compile-time sites and explicit composition grants create targets; peers cannot invent them.

## Execution budgets/lifetime

64 instructions/program, stack16, payload8 KiB, constants1 KiB UTF-8, 32 programs/target, 256/runtime, 512 instructions/invocation. Length/overflow/nonfinite/budget faults roll back that program and disable it for the activation, preserving original exceptions.

Retirement/cancellation is checked between instructions and before commit. It prevents future execution, not already-completed effects. Do not keep a Host alive or resurrect an activation to preserve a patch.


## Implementation references

- [docs/xsr/sidecar-signals.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-signals.md)
- [docs/xsr/sidecar-ui-patches.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-ui-patches.md)
- [docs/xsr/function-patches.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/function-patches.md)
- [Nexa.Desktop/DesktopSidecarSignals.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Desktop/DesktopSidecarSignals.cs)
