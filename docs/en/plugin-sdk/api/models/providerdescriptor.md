# ProviderDescriptor

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Id` | `QualifiedId` | Identity in this model’s domain. Use the identity issued or declared for this object, not a display name or filesystem path. |
| `Kind` | `QualifiedId` | Host-supported provider family. Registration succeeds only for a mapped family. |
| `ContractVersion` | `ulong` | Provider contract version; current catalog read-provider callbacks use 100. |
| `SchemaHash` | `string` | Digest of the provider callback envelope schema; current catalog read providers use BusinessProviderCall. |
| `DisplayName` | [`LocalizedText`](../models/localizedtext.md) | User-facing localized label; it is not an authority-bearing identity. |
| `Capabilities` | `string[]` | Exact capabilities advertised or required by this descriptor, subject to the Host’s accepted table. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `SupportedScopes` | `string[]` | Scopes the provider declares it can handle; declaration does not authorize every target. A bounded collection; do not assume an unbounded result or unspecified ordering. |
| `Selection` | [`SelectionPolicy`](../models.md#selectionpolicy) | Selection rule; the current catalog callback boundary supports ExplicitRequest. |
| `Concurrency` | [`ConcurrencyPolicy`](../models.md#concurrencypolicy) | Declared execution policy. A provider family may reject enum members whose semantics it does not implement. |
| `DeadlineMilliseconds` | `long` | Requested deadline in milliseconds; queue time consumes this budget and caller deadlines can shorten it. |
| `FailurePolicy` | [`ProviderFailurePolicy`](../models.md#providerfailurepolicy) | How this provider family reports callback failures; it does not automatically make retries safe. |
| `Configuration` | [`SchemaRef`](../models/schemaref.md) | Schema for provider configuration, not arbitrary executable Host configuration. |
| `Handler` | `ulong` | Callback identifier registered by this plugin. A handler alone is not a public action or provider registration. |

## Used directly by

- [Minecraft.Install.RegisterLoaderProvider](../minecraft-install.md#registerloaderprovider)
- [Minecraft.Java.RegisterDistributionProvider](../minecraft-java.md#registerdistributionprovider)
- [Minecraft.Content.RegisterFormatProvider](../minecraft-content.md#registerformatprovider)
- [Catalog.DescribeProvider](../catalog.md#describeprovider)
- [Catalog.RegisterProvider](../catalog.md#registerprovider)
- [Catalog.RegisterTranslationProvider](../catalog.md#registertranslationprovider)
- [Accounts.RegisterProvider](../accounts.md#registerprovider)
- [Downloads.RegisterSourceResolver](../downloads.md#registersourceresolver)
- [Downloads.RegisterTransferProvider](../downloads.md#registertransferprovider)
- [Minecraft.Diagnostics.RegisterRuleProvider](../minecraft-diagnostics.md#registerruleprovider)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/api/models/providerdescriptor.md) · Apache-2.0.
