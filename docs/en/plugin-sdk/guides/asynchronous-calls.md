# Asynchronous calls, budgets and unknown outcomes

A Host call may finish with a value, return a handle to continuing work, or fail
without proving whether an external effect completed. Design these cases separately.
This guide applies to managed ABI views and C/Wasm continuations.

## Two layers of completion

An `AbiReply<T>` describes one invocation. When T is OperationRef, a successful reply
means work was admitted. Read or watch that operation to discover its terminal
result. Returning from `Downloads.Start` is not proof that bytes are verified;
returning from `Launch.Start` is not proof that a game reached its main menu.

In C, `nx_Group_Method` serializes a continuation and yields. On the next resume,
check `nx_reply_success`, then decode using the corresponding `_result` helper.
Do not issue a blocking wait inside a Host callback. In managed code, await the
ValueTask and preserve the structured error rather than substituting a default value.

## Budgets are remaining time

The Host assigns an invocation deadline. A requested budget can shorten that
deadline, not extend it. Stage views link the stage cancellation and remaining
budget; recreating a view does not restart the clock. A disposed stage view cannot
be used as a runtime view. Provider queue time consumes the same deadline as its work.

Cancellation requests termination. It does not rewind an already committed file
write, network request or launched process. Read the resulting operation record
when an effect may already have crossed that boundary.

## Retry only with evidence

For a read, retry policy must still respect resource limits and the deadline.
For an effect requiring an idempotency key, use a new key for a new intended effect,
and retain that key and inputs while resolving an uncertain result. Reusing a key
with different inputs is a conflict. Using a fresh key to bypass that conflict can
run the effect twice.

If the Host reports OUTCOME_UNKNOWN, keep that status visible. Inspect the operation
or journal and reconcile the external state. Do not label it “failed, safe to retry”.
A workflow checkpoint protects known progress; it cannot manufacture knowledge of
an interrupted effect.

## Own the resources you acquire

Subscriptions, bindings, files, plans and registrations belong to the admitted load.
Release resources through their documented release operation when finished. Stop
retires Host resources, but local code must also cancel its work and discard views.
Do not invent a generic release call for a handle type that has no such API.

See [errors](../errors.md) for recovery choices and [Resources](../api/resources.md)
for subscription consumption and release contracts.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/guides/asynchronous-calls.md) · Apache-2.0.
