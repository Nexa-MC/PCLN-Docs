# FileRef

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Token` | `Guid` | Opaque Host-issued handle token. Keep it with its owner and resource type. |
| `LoadInstanceId` | `Guid` | Identity of the admitted load that owns this handle; it is not portable to a replacement load. |
| `Scope` | `string` | Explicit target scope. The Host checks that the caller is authorized for it. |

## Used directly by

- [Minecraft.Install.InspectLocalInstaller](../minecraft-install.md#inspectlocalinstaller)
- [Minecraft.Java.Inspect](../minecraft-java.md#inspect)
- [Backups.PrepareRestoreDestination](../backups.md#preparerestoredestination)
- [Files.Pick](../files.md#pick)
- [Files.Stat](../files.md#stat)
- [Files.Watch](../files.md#watch)
- [Files.OpenPackageFile](../files.md#openpackagefile)
- [Platform.RevealFile](../platform.md#revealfile)
- [Platform.PickFile](../platform.md#pickfile)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/fileref.md) · Apache-2.0.
