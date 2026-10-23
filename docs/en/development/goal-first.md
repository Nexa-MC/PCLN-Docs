# Develop toward an observable goal

Start from user behavior rather than an attractive hook. This chapter applies “goal → contract → implementation → evidence” to XSR so an extension remains usable beyond its demo.

## Define an outcome that can pass or fail

“Make an advanced theme” is vague. A testable goal is: “When the user releases the title-size slider, the current heading changes, remains readable in light/dark mode, survives restart, and a malformed manifest preserves the previous theme.” This defines the trigger, outcome, and failure behavior.

| Item | Question | Theme example |
| --- | --- | --- |
| Trigger | Who does what, and when? | The user drags the title-size slider |
| Current fact | Who owns the authoritative value? | Host-persisted options of the selected source |
| Outcome | Where is success observable? | Rendered title and options read after restart |
| Boundary | What is outside this feature? | Business actions and installer icons |
| Failure | What happens on error, navigation, retry? | Keep drafts and last valid style; allow another save |
| Evidence | Which checks demonstrate it? | Light/dark, drag, invalid value, restart |

## Establish ownership and the upstream contract

Inspect the current implementation rather than inferring behavior from a type name.

- If existing presentation capabilities meet the goal, use NTP instead of another process.
- Put new behavior in Sidecar-owned logic, exchanging declared commands and state.
- Select an admitted module slot and finite UI document for presentation. Host APIs are not page scripting services.
- If the target is unavailable, describe the missing outcome, contract, and tests to Host maintainers. Do not work around it through reflection, arbitrary files, or ungranted hooks.

Architecture documents can describe future capabilities. Find the type, admission, actual consumer, and tests at the selected tag before claiming support. An enum entry alone does not mean a product page executes it.

## Separate the four communication responsibilities

For “submit a note and display it on a resource extension card”:

| Requirement | Contract | Reason |
| --- | --- | --- |
| Submit a new note | `Command example.note.set`, UTF-8 argument | Requests an effect with validation/completion |
| Display the last valid note | `State example.note.current`, UTF-8 | A newly opened page immediately sees current truth |
| Expose action availability | `State example.note.enabled`, Boolean | UI consumes facts rather than guessing process health |
| Announce a successful submission | `Event example.note.changed` | An occurrence, not a replacement for current state |
| Calculate a one-off summary | Query, only if needed | A single result, never a query on every frame |

Do not invent a query for every visual property. Registration snapshots populate the Host mirror, so rendering needs no round trip.

## Deliver one complete vertical slice

Include argument validation, registration, initial snapshot, activation, one real command, state updates, cancellation, and teardown in the first slice. Drawing the form and returning hardcoded success while postponing permissions/errors is incomplete.

Implement business/value contracts, encode/decode behavior, lifecycle/self-test, finite UI, then native packaging and signature admission. Keep all work tied to this outcome instead of rebuilding unrelated modules.

## Choose evidence that can expose mistakes

| Scenario | Observable result |
| --- | --- |
| Valid submission | Successful command, updated state, matching presentation |
| Invalid argument | Explicit failure, unchanged prior value, no empty fake success |
| Navigation away | Captured intents/results from the old exposure lose authority |
| Stop/restart | Pending exchanges finish; old numeric IDs are discarded; activation follows a new snapshot |
| Repeated input | Bounded queues or documented coalescing |
| Missing resource | Declared fallback or activation rejection preserving valid presentation |

Test behavior rather than merely private method calls. Codec round trips prove encoding, a real child process proves IPC, and production admission proves publisher trust. Identify the evidence level honestly.

## Stop when the outcome is delivered

After acceptance checks pass, record limitations and ship. Treat new requirements as another bounded slice. Record incidental findings with location/evidence/impact and return to the goal, unless they block it or create an actual hazard.

Continue with [XSR responsibilities](./xsr-architecture), then fill the contract table in the [worked design](./walkthrough).


## Implementation references

- [docs/xsr/service-model.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/service-model.md)
- [docs/xsr/state-model.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/state-model.md)
- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
