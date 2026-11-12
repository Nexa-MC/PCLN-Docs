# JavaInstallRequest

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Distribution` | [`JavaDistribution`](../models/javadistribution.md) | Structured JavaDistribution value; follow its linked field contract. |
| `Target` | [`RootRef`](../models/rootref.md) | Structured RootRef value; follow its linked field contract. |

## Used directly by

- [Minecraft.Java.PrepareInstall](../minecraft-java.md#prepareinstall)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/models/javainstallrequest.md) · Apache-2.0.
