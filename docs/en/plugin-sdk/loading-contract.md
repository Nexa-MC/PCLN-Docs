# Loading, activation and retirement

A plugin becomes usable only after negotiation, staged registration and atomic
activation. Treat this as a state machine: receiving a context or completing one
callback does not mean the plugin may already perform Active-only work.

This page describes Bootstrap V1 with ABI 100. The original
[v0.2 proposal](specifications/plugin-abi-v0.2.proposal.zh-CN.md) records design input;
use the generated API and Host support pages for current operation availability.

## Negotiate once, then use the confirmed context

In managed Bootstrap, `GetABIContext(100, options)` returns a draft. Build required
and optional capability requests, then call Make through the negotiator. Only the
Host-confirmed final context is used for loading callbacks. `GetExpermentABI`
retains its historical spelling. ABI requests must be positive multiples of 100;
an unsupported version does not silently fall back.

`ABIContext.Info` describes the admitted identity and negotiated capabilities.
`GetAbility` and `GetExperiment` access already confirmed contracts. They do not
perform new negotiation or grant permissions. An optional capability may be absent;
a missing required capability should prevent the unsupported feature from loading.

## Callback order and purpose

| Phase | What to do | What must not be assumed |
| --- | --- | --- |
| PreInitialize | Negotiate; prepare callback and cleanup ownership | A draft is not an Active context |
| Initialize | Stage allowed contracts, pages, actions and definitions | Staged registrations are not visible to consumers |
| PostInitialize | Establish allowed inter-plugin bindings | A service name does not bind every future provider load |
| Checkup | Probe dependencies and return explicit findings | Passing one probe does not skip later Host checks |
| Finalize | Finish the admitted load without new registrations | Finalize is not another Initialize |
| Activated | Begin normal runtime work after group commit | This notification is not an extra loading stage |
| Abort | Clean up an unsuccessful load | A final context may not exist if negotiation failed |
| Stop | Retire active work and release local resources | Old handles cannot be reused after a new load |

Required participants publish together. Failure before commit removes the staged
group, so users cannot interact with a half-registered plugin. After commit,
retirement cancels retained work and removes owned registrations.

## Scope every managed view

The final ABIContext is shared across Initialize, PostInitialize, Checkup and
Finalize, but each callback receives its own StageContext. Use
`abi.ForStage100(stage)` inside that callback and dispose the view before returning.
Use `abi.AsAbi100()` for a runtime view with a runtime invocation scope.

A stage view forwards its invocation ID, cancellation and remaining budget. A
saved proxy from a disposed view fails with STAGE_FROZEN. Creating another wrapper
does not extend a deadline. The Host independently rejects retired stage IDs,
wrong phases, foreign loads and missing permissions; wrapper disposal is a local
convenience, not the security boundary.

See `samples/HelloPlugin/Plugin.cs` for a complete compiled managed implementation.
It illustrates the contract and is not an installable production DLL plugin.

## Scope Wasm continuations

Wasm receives lifecycle messages through `nexa_resume`. An SDK call yields an
`invoke` continuation; its reply arrives in a later resume. Keep only owned scalar
state or copied values across that boundary. Borrowed model views refer to the
current input buffer and cannot outlive it.

The guest does not choose its trusted identity, stage or remaining budget by
adding fields to the request. PluginSidecar supplies them from the admitted load.
See [the page tutorial](tutorials/page-and-action.md) for a complete call chain.

## Handle failure without hiding it

Check `AbiReply<T>.Success` before using Value. A failed reply's default value is
not an empty successful response. Preserve the structured error and let Abort or
Stop perform the appropriate cleanup. Cleanup itself is bounded; do not block it
waiting synchronously for unrelated Host work.

Activation, stop and provider replacement require fresh ownership decisions.
A service binding does not silently attach to a new provider instance, and a saved
file or subscription handle is not portable across loads.

[Permission checks](permissions.md) · [Asynchronous calls](guides/asynchronous-calls.md) ·
[Host implementation snapshot](host-support.md)

## Complete source

The following is synchronized with `samples/HelloPlugin/Plugin.cs` and compiled by SDK CI.

<!-- example:samples/HelloPlugin/Plugin.cs language:csharp -->
```csharp
using Nexa.Plugin.Bootstrap.V1;
using Nexa.Plugin.Sdk.Abi100;
namespace HelloPlugin;

public sealed class Plugin : IPluginBootstrapV1
{
    public async ValueTask<AbiReply<PreInitResult>> OnPreInitialize(PreInitContext context)
    {
        var options = new InvocationOptions(Guid.NewGuid(), context.Budget, context.Cancellation);
        var draft = await context.Negotiator.GetABIContext(100, options);
        if (!draft.Success) return AbiReply<PreInitResult>.Fail(draft.Error!);
        var ready = await new Abi100Draft(draft.Value).Require("nexa.diagnostics", 1).Optional("nexa.ui", 1)
            .Make(context.Negotiator, Guid.NewGuid(), [], context.Cancellation);
        return ready.Success ? AbiReply<PreInitResult>.Ok(new(ready.Value, [], [], [], [])) : AbiReply<PreInitResult>.Fail(ready.Error!);
    }
    public ValueTask<AbiReply<Unit>> OnInitialize(ABIContext abi, StageContext stage) => Ok();
    public ValueTask<AbiReply<Unit>> OnPostInitialize(ABIContext abi, StageContext stage) => Ok();
    public async ValueTask<AbiReply<CheckupResult>> OnCheckup(ABIContext abi, StageContext stage)
    {
        using var api = abi.ForStage100(stage);
        var registrations = await api.Diagnostics.QueryRegistrations(new(Guid.NewGuid(), stage.Budget, stage.Cancellation));
        return registrations.Success
            ? AbiReply<CheckupResult>.Ok(new(CheckupStatus.Passed, [], []))
            : AbiReply<CheckupResult>.Fail(registrations.Error!);
    }
    public ValueTask<AbiReply<Unit>> OnFinalize(ABIContext abi, StageContext stage) => Ok();
    public ValueTask<AbiReply<Unit>> OnActivated(ABIContext abi, InvocationContext invocation) => Ok();
    public ValueTask<AbiReply<Unit>> OnAbort(AbortContext context) => Ok();
    public ValueTask<AbiReply<Unit>> OnStop(StopContext context) => Ok();
    private static ValueTask<AbiReply<Unit>> Ok() => ValueTask.FromResult(AbiReply<Unit>.Ok(new()));
}
```
<!-- /example -->

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/loading-contract.md) · Apache-2.0.
