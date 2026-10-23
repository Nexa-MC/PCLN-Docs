# Worked design: a resource-page note extension

The goal is to submit a note on the resource page, show the last valid value, invalidate old operations after navigation, and restore current facts after activation. Resource search, downloads, and account policy stay outside this feature.

## 1. Write acceptance scenarios

```text
Given an active session whose note is “Ready to test”
When the user submits “Alpha 12 tested”
Then the command succeeds, current-note state changes, and the card shows it

Given navigation away or a replaced module exposure
When a captured old submit arrives
Then it is not admitted as an operation on the new module

Given an oversized argument or a stopped session
When a request arrives
Then it fails explicitly and preserves the previous value
```

Choose a business limit below the Host input budget, for example 120 characters, and decide whether blank notes are allowed. The 512-character draft budget is a container limit, not your business rule.

## 2. Assign ownership

| Concern | Owner | Input/output |
| --- | --- | --- |
| Validate/save note | Sidecar-private business logic | String → success/stable error |
| Current value and action availability | Sidecar State, read-only Host mirror | Snapshot and deltas |
| Form and unsubmitted draft | Host module projection | Schema 2, exposure, user input |
| Cancellation/exchange/session lifetime | Host Runtime and peer receive loop | Numeric contract, correlation, CANCEL |
| Appearance | Host/NTP | Readable presentation without behavior authority |

Do not pass `SidecarConnection` to the renderer, keep control references in business objects, or let an unsubmitted draft become authoritative state.

## 3. Declare the minimal contracts

| Kind | Semantic ID | Codec | Purpose |
| --- | --- | --- | --- |
| Command | `example.note.set` | Argument 0, result 0 | Submit text |
| State | `example.note.current` | 0 | Last valid note |
| State | `example.note.enabled` | 1 | Availability |
| Event | `example.note.changed` | 0 | Successful change notification |
| UiModule | `example.note.panel` | 0, flags 0 | Hashed finite form |

The command is ordinal 1 in its kind; states are ordinals 1 and 2. UI and State do not share a numeric table. Include both states in the initial snapshot, even when the Boolean value is simply true.

## 4. Use an admitted module

```csharp
var document = new SidecarUiDocument(
    "ui.resources.extension-card.v1", "Resource note", "Stores this extension's note only.",
    new SidecarUiNode[] {
        new(1, 0, SidecarUiNodeKind.Stack, "Note panel"),
        new(2, 1, SidecarUiNodeKind.Text, "Current note",
            ValueState: "example.note.current"),
        new(3, 1, SidecarUiNodeKind.TextInput, "Edit note",
            Command: "example.note.set", ValueState: "example.note.current",
            EnabledState: "example.note.enabled")
    });
byte[] bytes = document.Encode();
```

This registration-time fragment uses `Nexa.Sidecar.Protocol`. [UI and extensions](../sidecar/ui-and-extensions) explains node fields, references, and hashed registration. TextInput uses the Host-owned submit control. Do not create another button that attempts to read a remote control's draft: button `Argument` is a registration-time literal, not an arbitrary binding expression.

## 5. Execute and publish facts

Check Active state, contract ID, codec, and argument before business validation. On success publish a current-note StateDelta, optionally emit changed Event, and return CommandResult with the original correlation. On failure preserve the prior value and return an explicit error.

When saving involves IO, keep receiving Health/CANCEL and track cancellable workers by correlation. Do not block the receive loop, or synchronously wait on async work with `.Result`/`.Wait()`.

A timeout means the caller did not obtain a result before its deadline; it does not prove that no effect occurred. A retryable persistent operation needs operation IDs, deduplication, or idempotency. A fresh correlation is not an idempotency key.

## 6. Include retirement and failure

On deactivation stop admitting work, finish/cancel pending workers, and retire UI/subscriptions/signals. After restart register again, send a complete snapshot, and wait for ACTIVATE. Discard old numeric mappings and exposures.

An in-memory note disappears on exit. If persistence is required, implement it through Sidecar-owned storage with a format version and failure contract. This example does not gain arbitrary Host filesystem access or claim durable persistence merely because echo works.

## 7. Produce evidence

| Layer | Required evidence | Entry |
| --- | --- | --- |
| Business | Length/blank rules and failure preservation | Pure business tests |
| Codec | Consistent Command, State, Event, UI references | [Message recipes](../sidecar/commands-and-queries) |
| IPC | Child bootstrap, registration, query, shutdown | [First Sidecar](../sidecar/quick-start) |
| UI | Draft, submit, state projection, navigation cancellation | Execution inside an admitted Host, recording OS/build |
| Distribution | Native executable, publisher signature, discovery path | [Packaging and discovery](../sidecar/packaging-and-discovery) |

The same design scales to a task panel: Command starts work, State owns progress/availability, Event announces completion, and Stream carries bounded continuous output. Confirm target authorization before broadening the feature.


## Implementation references

- [docs/xsr/sidecar-ui-modules.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-ui-modules.md)
- [Nexa.Sidecar.Protocol/SidecarUiDocument.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarUiDocument.cs)
- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
