# OperationRequest

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Operation` | `EntityId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |

## Used directly by

- [Workflows.Cancel](../workflows.md#cancel)
- [Minecraft.Install.Cancel](../minecraft-install.md#cancel)
- [Minecraft.Launch.Cancel](../minecraft-launch.md#cancel)
- [Downloads.Pause](../downloads.md#pause)
- [Downloads.Resume](../downloads.md#resume)
- [Downloads.Cancel](../downloads.md#cancel)
- [Tasks.Cancel](../tasks.md#cancel)
- [Tasks.Retry](../tasks.md#retry)
- [Network.Cancel](../network.md#cancel)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/models/operationrequest.md) · Apache-2.0.
