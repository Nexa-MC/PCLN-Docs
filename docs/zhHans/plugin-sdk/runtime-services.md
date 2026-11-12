> 本页保留英文技术原文；中文入门与专题见 [开发文档](index.md)。

# Runtime service behavior

Use this reference when a plugin depends on event delivery, workflows, service
binding or persistent recovery. These behaviors belong to PluginSidecar's runtime
and the embedding Host; the standalone SDK supplies their types and codecs.

The recorded implementation has 97 kernel mappings and 200 Desktop mappings.
[Host support](host-support.md) identifies the exact development snapshot. These
counts describe routes, not a promise that every provider family or every released
Alpha implements the full catalog. Production Market delivery remains incomplete.

Read [asynchronous calls](guides/asynchronous-calls.md) first if you need to distinguish
call completion, task completion and uncertain external effects.

## Publication and callbacks

Contracts, services, actions, predicates, workflows, event definitions and owned
state declarations stage during Initialize. Group commit publishes them together
with content. Aborting removes the group; stopping retires definitions, bindings,
subscriptions and callbacks. A required service binding adds a runtime dependency:
provider stop also seals/stops its required consumers, consumers first. An optional
binding becomes unavailable. Bindings never silently attach to a replacement load.

Only the coordinator dispatches handlers, with the admitted identity/context,
cancellation and causal metadata. Nested callback cycles are rejected. Host service
calls return an owned operation whose typed result is read through Tasks.Read.
The coordinator's deadline also bounds synchronously blocking adapter callbacks.
It observes a late completion without replacing an already uncertain action result.
Native-execution service methods and unapproved cross-service delegation are denied.
Actions validate input/output schemas and declared capability/scope requirements.
Actions requiring confirmation use the trusted `IActionConfirmation` port supplied
through `PluginRuntimeOptions`; missing UI fails with `CAPABILITY_UNAVAILABLE`.
The Host receives the actual caller/provider, descriptor, input and target.
Concurrent retries coalesce both the prompt and effect. Decline or cancellation
never dispatches the handler; late answers are ignored. Confirmation is bounded
by the invocation budget even if the UI adapter blocks synchronously. Caller or
provider retirement cancels a pending confirmation. After approval, permissions
and registration identity are checked again. Non-read-only action idempotency keys bind inputs within a load;
a reused key with different arguments fails instead of invoking the handler again.
An unvalidated result or interrupted effect is `OUTCOME_UNKNOWN` and is not replayed.
The recorded Desktop integration supplies the confirmation UI. Other embedding Hosts must provide their own trusted confirmation port.

## State, events and subscriptions

An unread initialized state has Null content and the explicit `uninitialized`
revision. Both update methods check ownership, scope, schema and expected revision.
State/watch and operation/watch notifications are bounded. `Resources.ReadSubscription`
consumes up to 256 items, reports gaps and binds the returned batch to the call's
idempotency key; retries must reuse that key. `Resources.ReleaseSubscription`
retires either kind of subscription. Both methods check the admitted owner.

Event callbacks support transient and resumable subscriptions, best-effort and
at-least-once delivery, self filtering and bounded event-ID deduplication. Queue
serializes callbacks; Reject drops a new delivery while busy and reports a gap;
AllowBounded runs at most four callbacks per subscription. The Host caps all event
workers at 64 and retains queue/in-flight payloads within a shared 16 MiB budget.
Callbacks never block event publication.
Queue overflow or callback failure sets a gap flag; reading a callback subscription
returns that flag without stealing messages from its handler. Callback failures
retry at 250 ms intervals for at-least-once subscriptions until success or release;
handlers must tolerate duplicate effects. Only published
subscriptions receive notifications. Event origin is supplied by Host, not trusted
from plugin data. Watches cannot silently claim cursor replay support.

## Workflow execution and recovery

Node Inputs equal to Null use the previous result; other Inputs are literal data.
Every node validates its declared input/output schema. Sequence pipes results;
If evaluates the target predicate; Switch matches a string to a child ID (or
`default`); ForEach returns an array; Parallel obeys its concurrency bound and
All/AnySuccess completion policy. Return exits the current flow/parallel branch.
Action/Compensate invoke a declared action. Delay is cancellable. Retry uses only
its declared retryable codes, bounded attempts and backoff. Try runs its second
child on a business failure; Finally always attempts its second child with the
same cancellation token. Subflow invokes a declared workflow under the parent
work/depth budget. Checkpoint flushes the current persistent run journal.

Runtime limits are at most 32 nesting levels, 4096 node executions/trace records,
32 parallel branches, 16 retry attempts and five minutes per asynchronous run.
Workflow concurrency supports Parallel, Queue, RejectDuplicate and ReplacePending.
Queued cancellation preserves the predecessor fence. Replacement cancels queued
work only. WaitEvent matches the exact declared event/schema/scope; a transient
wait interrupted by reload requires resynchronization. AskUser requires the
trusted Host interaction port and an explicit UI permission. Missing UI fails.
Persistent Delay resumes its saved deadline instead of restarting the delay. Predicates may use a
handler, a Boolean literal, or the bounded `op` expression grammar: `input` with
`field`, `not` with one argument, `eq` with two, and `all`/`any` with `args`.

Persistent runs write versioned, bounded closed-binary journals using flush plus
atomic replacement. Journals are private to the plugin ID and plugin version.
Resume requires the current revision and unchanged full workflow definition/input;
completed outputs and early-return markers are reused. An effect is recorded
before dispatch and cleared only after a validated result. If that result is
unknown after interruption, the run becomes OUTCOME_UNKNOWN and cannot be replayed.
Confirmation precedes this effect marker, so a declined dialog remains a known
failed step across restart rather than an uncertain effect.
There is no invented successful recovery and no automatic retry after restart.
RetryStep only resumes a known failed step/run when these same checks allow it.
Read/ListRuns load the current owner's saved runs; Tasks.Dismiss removes a terminal
run and its journal. Journal corruption is an explicit error, not an empty history.
The store assumes one trusted Host owner, as does private plugin storage.

## Limits and acceptance

Registrations, state bytes, diagnostics, queue bytes, operation results and action
memoization have independent memory bounds. At most 256 operations are retained.
Persistent journals are limited to 256 files and 64 MiB. Ordinary stop revokes all
in-memory handles, while authorized saved workflows can be inspected after reload.

Tests load actual managed entries through the coordinator and execute callbacks,
service binding, state CAS/watch, event delivery, task ownership, action
idempotency, workflow branching/early return/cancellation, rollback and stop
closures. A separate test restarts the Host and resumes a checkpoint, then proves
that an uncertain effect is not executed again. These run under NativeAOT too.
C/Wasm conformance independently covers all 368 current/legacy SDK slots and 300
model/collection shapes; that count is not a claim of 368 launcher integrations.

On Windows, the Wasm adapter uses explicit trap checks (`WithSignalsBasedTraps(false)`).
This preserves .NET apphost CET shadow-stack protection while avoiding Wasmtime's
incompatible signal-based trap recovery ([upstream issue 374](https://github.com/bytecodealliance/wasmtime-dotnet/issues/374)).
CI exercises unreachable instructions, memory bounds, division by zero and fuel
exhaustion as well as compiled C decoder rejection, in managed and NativeAOT hosts.

## Schedules

The six schedule routes implement interval, absolute-time and event triggers,
explicit timezone validation, enable/disable, manual trigger and next-run queries.
The runtime owns a 250 ms pump; tests or embedding Hosts may supply a TimeProvider
and disable automatic polling. Skip, Coalesce and ReplayBounded govern missed
triggers; event debounce retains the latest matching payload. Schedule dispatch
re-enters workflow authority with the owner's grants. It cannot confer workflow
or event permissions. Stop and disable fence further dispatch.

Schedule state persists by plugin version and exact definition. The due time is
advanced and flushed before dispatch: a crash in this window may lose a trigger,
but cannot automatically replay an uncertain effect. Event debounce payloads are
transient and are not invented after restart. Limits are 256 schedules, 32 replayed
occurrences per poll, 1 second to 30 day intervals, and 5 minute debounce.

## Durable events and availability

Durable event publication flushes an atomic binary history before dispatch. Each
stream retains at most 256 events (or its smaller declared queue limit) and 1 MiB;
one event is limited to 256 KiB. There are at most 64 persisted streams. Resumable
subscription cursors identify persisted checkpoints bound to subscriber plugin ID,
stream and exact scope. Store the returned cursor for the next Initialize callback.
Subscribe remains an Initialize-only registration under the existing ABI.

Successful callback acknowledgement advances the checkpoint. Parallel completion
cannot advance it past an earlier outstanding delivery. Restart may repeat a
callback that completed before its acknowledgement was flushed. Retention loss,
queue overflow and rejected reentry report resynchronization explicitly. Up to
4096 checkpoints persist; explicit ReleaseSubscription deletes its checkpoint,
while plugin stop retains it. Starting a fresh subscription establishes a new
checkpoint after the author has resynchronized application state. Durable
WaitEvent nodes use this same history to recover events published while suspended;
expired history fails with RESYNC_REQUIRED instead of silently skipping events.

Contracts.WatchAvailability and Plugins.WatchAvailability queue typed
CapabilityDescription snapshots through Resources.ReadSubscription. They deliver
an initial snapshot, followed by changes at group publication and retirement.
Service snapshots honor provider identity and the requested version range; no
binding silently switches to a new provider. Staged declarations are not exposed.

## Resolved content

All 15 Definitions routes now execute in the kernel. Dynamic registries bind an
IRegistryConsumer supplied through PluginRuntimeOptions. Its Validate method must
check the descriptor, declared validation rules and resolved batch without effects;
Publish accepts an immutable application-state snapshot. This is a real local
consumer port; the Desktop adapter and plugin-defined consumer bridge are still
separate integration work. Consumer exceptions are visible in ExplainResolution;
valid data remains readable so an owner can inspect and repair it.

The built-in merge contract is `nexa:merge/closed-v1`. Add introduces new map keys
or appends arrays, Merge recursively merges maps, Replace replaces the body, and
Mask hides an entry. Resolved outputs are schema validated. Registries choose the
allowed mode and ordering policy. Explicit constraints are topologically sorted;
RejectAmbiguity rejects an unconstrained choice; UserSelection requires a trusted
Host selector and still checks declared order constraints. Other merge contracts
and deletion modes beyond RejectWhileReferenced return CAPABILITY_UNAVAILABLE.

Cross-owner overlays require AuditedOverlay policy and the Host's explicit
ApproveForeignOverlay decision. Tags include other same-registry tags, add/remove
members and reject cycles or missing members. Tagged queries intersect requested
tags; their cursors bind identity, registry, tag filter and revision. Overlay
publication/retirement invalidates definition CAS revisions. PreviewOverlay returns
a plan containing the resolved result without publishing it. Definitions.Watch
uses owned Resources subscriptions and sends `Snapshot<DefinitionBatch>` values.
Host Snapshot and consumer publication use the same resolved values as SDK reads.

Content dependencies participate in consumer-first plugin retirement. Dynamic
registry snapshots are bounded to 1 MiB; the combined definition/metadata store
retains its 32 MiB limit and at most 1024 registry/tag/overlay declarations.

## Cleanup and release

Resources.RegisterCleanup and Bootstrap IResourcesV1 share one instance-owned
cleanup registration table. The same callback yields the same registration.
Resources.Release removes a cleanup registration before invoking it, so an
unknown result cannot cause a second cleanup during stop. Remaining callbacks run
in reverse registration order under one bounded cleanup budget. A cleanup may
release another cleanup without double execution. The optional local
IPluginCleanupInvocationV1 adapter lets compiled Wasm handlers run after normal
business dispatch is sealed, using the existing handler envelope/lifecycle phase.

All registration families allocate handles from one Host counter. Generic release
checks owner/load/definition identity and rejects required references, live service
bindings and running callback leases. Releasing declarations updates the resolved
content or availability state. PreInitialize routes declared by the catalog are
callable after Make; returning from PreInitialize freezes that call scope.
Synchronous lifecycle/cleanup callbacks run behind the same deadline as async
callbacks. A timed-out effect remains an unknown outcome and is not re-executed.

## Service Checkup and load reports

All eight Plugins routes execute in the kernel. `ServiceDefinition.Probe` names
an owned predicate. `ProbeService` checks the caller-owned binding, exact probe ID
and input schema. Pure predicates evaluate directly; callback predicates receive
a `PredicateRequest` and return a revision-bound `PredicateResult`. False/Unknown/
Error results produce a failed validation report. Fatal findings cannot become a
successful report even if the predicate returns True.

The coordinator admits prepared providers in the same atomic group and existing
active providers through `IPluginProbeInvocationV1` (or registered development
callbacks). Only catalog queries permitted in Checkup can run inside the probe.
Saved contexts cannot bypass that boundary; detached continuations retain a revoked
lease after callback return. Deadlines, cancellation, provider identity and causal
cycle checks apply. Self/cyclic probes return CONFLICT rather than reentering a
suspended Wasm instance. Ordinary service calls still require Active.

`ReadOwnLoadReport` returns the caller's identity, current phase, retained bootstrap
and Checkup findings and required dependency IDs. Findings are bounded and preserved
in the final trusted load report, including failed group loads. Other plugins'
private findings are not exposed. Service probes also protect their predicate
registration from release while referenced.

### Host-managed cleanup

`RegisterHostCleanup` and `ReleaseHostCleanup` are trusted embedding ports, not
guest methods. Registration requires an admitted caller and its declared permission.
The returned reference is owned by that exact load, can be released through the
existing `Resources.Release`, and is automatically cleaned up on abort or stop.
Host callbacks occupy a separate namespace from guest callback handles. A failed
or timed-out cleanup is reported; its effect is never retried automatically.

### Compatible Host integration additions

Commands enumerate and execute the active Actions catalog through the same validation,
confirmation, idempotency and provider lifetime rules. Command execution requires its
own `nexa.commands.write` grant; it does not borrow an Actions capability handle.

`Events.RegisterSubscription` returns both the subscription and an owned cleanup
registration. The existing `Events.Unsubscribe(RegistrationRequest)` accepts that
registration only. `Events.UnsubscribeSubscription` accepts the `SubscriptionRef`
returned by the existing `Subscribe` method. Existing IDs, models and signatures
are preserved; new slots and models are appended. Both forms use the same event
queue/checkpoint cleanup and reject references belonging to another load.

`Minecraft.Java.ListManagedDistributions` and `PrepareManagedInstall` are additive
contracts for Host-managed, multi-file runtime manifests. Offers expose actual
version/platform, file count, byte count, license URLs, expiry and a revision;
manifest files and the managed target remain with the Java owner. The existing
`Install(PlanRequest)` executes the resulting confirmed mutation plan. The old
single-artifact `JavaDistribution` contract is unchanged.

## Commands and private storage migration

Commands list and describe the published action registry. Execute retains the
command permission boundary and uses the same schema checks, trusted confirmation,
provider lifetime and idempotency ledger as action invocation. A command-only
caller does not acquire permission to call Actions.Invoke.

Storage.Migrate invokes an owned read-only action with StorageMigrationInput and
StorageMigrationOutput schemas. The callback receives at most 256 entries and must
return unique, schema-valid keys. The namespace version and revision are compared
before and after the callback. The complete result is atomically persisted before
the new version is published; failed transforms and concurrent writers preserve
the old namespace. Success invalidates old namespace/transaction handles and
returns a fresh StorageNamespace through Tasks.Read. Existing namespaces larger
than this bounded migration payload fail explicitly; data is never truncated.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/runtime-services.md) · Apache-2.0.
