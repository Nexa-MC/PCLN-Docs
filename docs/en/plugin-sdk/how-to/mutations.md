# Prepare and execute a change

Use this pattern for an operation whose API exposes a preparation or planning step.
Examples include instance creation, content changes and theme application. Consult
the specific domain contract: not every write returns the same plan type.

## Keep the user's intent stable

Read the target's current state. Prepare the intended change with the exact inputs
and target scope. Retain the returned plan identity and revision and show its
summary through the Host's confirmation flow. A plan describes a proposed effect;
preparing it does not mean the effect has happened.

Commit the exact plan after approval. The Host rechecks ownership, target revision,
permissions and other preconditions. If the target changed while the dialog was
open, obtain a new plan and renewed confirmation when required. Never swap a target
behind an already approved summary.

## Handle the commit reply

For an OperationRef, monitor the task until terminal. For a direct result, validate
Success before reading the value. Mark the UI complete only after the operation's
actual success is known. On cancellation, do not infer rollback unless that domain
explicitly guarantees it.

Plans can be single-use and load-bound. A consumed, expired or foreign plan must be
prepared again. Idempotency keys identify intended effects; they are not tokens for
turning an invalid plan into a valid one. Preserve the key and inputs while checking
an uncertain result.

## Test a stale plan

Prepare a change, modify the target through another authorized operation, then
commit the original plan. Confirm that it fails with a conflict instead of applying
unreviewed inputs. Also test decline, repeat commit, plugin stop and missing permission.
These cases establish the mutation boundary more clearly than repeated happy paths.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/how-to/mutations.md) · Apache-2.0.
