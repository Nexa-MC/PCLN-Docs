# Finite UI modules: forms, state, images, retirement

Expose Sidecar-owned behavior while preserving Host navigation/search/download/trust. A12 grants `ui.resources.extension-card.v1`; modules are not NXML/PXML source, DOM, or arbitrary product trees.

## Admission flow

```text
Declare Command/State/Resource → encode/hash UI → register module/resources
 → full Host validation + explicit slot grant + complete snapshot
 → ACTIVATE → immutable local view → Renderer
```

Cached content is not an execution grant. Hosts without UiModuleAdmission can inspect declarations without presenting them. Registered pages open with local reads and zero UI IPC.

## Schema 1: text only

```csharp
var card = new SidecarUiCard("ui.resources.extension-card.v1",
    "Note helper", "Ready to accept a note.");
byte[] content = card.Encode();
```

Fields: schema=1, slot, title, body. Limits: 4096 payload bytes, title 1–80/body 1–512 characters, no controls. No actions/bindings/scripts. Use it when static text meets the goal.

## Schema 2: complete form

```csharp
var form = new SidecarUiDocument(
    "ui.resources.extension-card.v1", "Resource note", "This extension owns the note.",
    new SidecarUiNode[] {
        new(1, 0, SidecarUiNodeKind.Stack, "Note panel"),
        new(2, 1, SidecarUiNodeKind.Text, "Current note", ValueState: "example.note.current"),
        new(3, 1, SidecarUiNodeKind.TextInput, "Edit note", Command: "example.note.set",
            ValueState: "example.note.current", EnabledState: "example.note.enabled"),
        new(4, 1, SidecarUiNodeKind.Toggle, "Enabled", Command: "example.note.enable",
            ValueState: "example.note.enabled"),
        new(5, 1, SidecarUiNodeKind.Row, "Actions"),
        new(6, 5, SidecarUiNodeKind.Button, "Reset", Command: "example.note.set", Argument: "Ready")
    });
byte[] content = form.Encode();
```

ContractRecipes runs this encoding. Host additionally validates same-session command/state declarations, codecs, feature negotiation, and slot permission.

## Every node field

| Field | Contract/use |
| --- | --- |
| Id | Contiguous 1–64, document-local |
| Parent | Zero or preceding Stack/Row ID |
| Kind | Text1/Button2/TextInput3/Toggle4/Image5/Stack6/Row7 |
| Label | ≤256, no controls; nonempty for interactive/image nodes |
| Command | Same-session Command, required only on interactive kinds |
| ValueState | Text accepts scalar codecs 0–4, input UTF-8 only, Toggle Bool |
| EnabledState/VisibleState | Bool predicates, inherited by descendants |
| Resource | Image only, registered and listed in RequiredResources |
| Argument | Button-only literal string, ≤512, no controls |

Image/Stack/Row cannot use ValueState. Maximum depth 8, nodes 64, total schema-2 payload 32 KiB. These IDs cannot reference Host entity keys.

## Hashed registration

```csharp
var module = new SidecarRegistrationItem(SidecarRegistrationKind.UiModule,
    "example.note.panel", 0, 0, content,
    System.Security.Cryptography.SHA256.HashData(content));
```

Keep bytes/hash consistent. Flags/codec are zero; RequiredResources is a semicolon list of same-session Resource semantic IDs, not paths or cross-package borrowing.

## Input/Toggle behavior

Host owns input drafts up to 512 characters and submits through its own control. Unrelated State updates preserve uncommitted drafts; changed bound values can update input presentation. Toggle needs Bool command/value State and BinaryPayloads. Button/input parameters are strings; nonzero result codecs also need binary negotiation.

Unavailable bindings disable interaction. Dispatch rechecks ancestor enabled/visible state and current exposure rather than trusting a captured old frame.

## Image resources

```csharp
byte[] png = File.ReadAllBytes("icon.png"); // Explicit peer-owned build resource.
var resource = new SidecarRegistrationItem(SidecarRegistrationKind.Resource,
    "example.note.icon", 0, 0, png,
    System.Security.Cryptography.SHA256.HashData(png));
// Add Image with Resource="example.note.icon" and module RequiredResources.
// Re-encode/hash the resulting module.
```

Ship real icon bytes. Host accepts hash-verified static PNG/WebP/JPEG, never URLs/paths. Decoder budget is 1 MiB/1024×1024, but an inline Bytes field is still ≤65535 bytes: **both limits apply**. Aggregate node pixels and distinct encoded bytes are separately ≤8 MiB. Shared references reuse the carrier; native decode stays in the backend.

## Exposure/lifetime

Every exposure has a fresh GUID. Replacement revokes old intents/exchanges; restoring a predecessor also creates a fresh exposure. Navigation retires controls/cancels requests; deactivation/failure/disposal removes active views and subscriptions. Cached bytes are not a live interactive view.

Limits: 32 modules/session, 64 active globally, 8/slot, 16 Host slots. Latest live activation wins; retirement restores a still-live predecessor.

## Interaction evidence

Test drafts/IME, rejection, State changes, toggles, missing images, ancestor hiding, replacement, navigation, stop/recovery. Codec recipes prove shapes; real presentation requires an admitted Host.


## Implementation references

- [Nexa.Sidecar.Protocol/SidecarUiDocument.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarUiDocument.cs)
- [Nexa.Xsr.Runtime/Sidecar/XsrUiModuleRuntime.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Runtime/Sidecar/XsrUiModuleRuntime.cs)
- [docs/xsr/sidecar-ui-modules.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-ui-modules.md)
