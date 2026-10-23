# UI and extensions

UiModule/Resource registrations carry inline content and SHA-256 hashes. The Host validates/cache-admits the whole set before exposing it. Opening a registered page performs zero IPC. Registration retention alone does not grant execution: a concrete Host slot/target adapter must admit it.

Alpha 12 interactive modules use SidecarUiDocument schema 2: at most 64 nodes and 32 KiB encoded. Text, Button, TextInput, Toggle, Image, Stack and Row reference the current session's declared Command/State/Resource contracts. TextInput drafts are bounded to 512 characters. Toggle requires Boolean Command/ValueState codecs and BinaryPayloads.

Images must be declared RequiredResources, not URLs or filesystem paths. Per image: at most 1 MiB encoded and 1024×1024 pixels. Per module: 8 MiB rendered pixel reservation and a separate 8 MiB distinct encoded-content budget. The current production consumer is the resource extension slot, not arbitrary page replacement or script execution.

UiPatch uses a bounded caption ABI. The initial target `ui.resources.search-label.v1` admits 16 characters and updates the accessibility label too; retirement restores original localization.

Event/Intent catch/listen/wait declarations require explicit targets. FunctionPatch supports only generated granted Host sites and finite reviewed ABI shapes, not arbitrary CLR/Harmony injection.

Each module exposure has a fresh identity; retired clicks/results never regain authority when a module is displayed again. Failure, deactivation and disposal remove its presentation and subscriptions.

[Interactive modules](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-ui-modules.md) · [Caption patches](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-ui-patches.md) · [Signals](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-signals.md) · [Function ABI](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/function-patches.md).
