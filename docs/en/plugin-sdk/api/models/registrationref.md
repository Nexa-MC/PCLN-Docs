# RegistrationRef

[Model index](../models.md) · [API index](../index.md).

This is the exact wire model. Non-nullable fields are required; field types do not imply undocumented defaults. Domain ownership, bounds and phase checks still apply.

| Field | Type | Meaning |
| --- | --- | --- |
| `Handle` | `ulong` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `Owner` | `string` | Domain value named by this field; additional accepted values and bounds are determined by the operation and Host policy. |
| `LoadInstanceId` | `Guid` | Identity of the admitted load that owns this handle; it is not portable to a replacement load. |
| `DefinitionId` | `QualifiedId` | Identity or revision in this model’s domain; preserve ownership and exact spelling. |
| `State` | [`RegistrationState`](../models.md#registrationstate) | Current state from the enum or model below; do not infer successful completion from admission alone. |

## Used directly by

- [Contracts.DefineService](../contracts.md#defineservice)
- [Contracts.DefineProviderKind](../contracts.md#defineproviderkind)
- [Contracts.DefineExtensionPoint](../contracts.md#defineextensionpoint)
- [Contracts.RegisterConsumer](../contracts.md#registerconsumer)
- [Definitions.DefineRegistry](../definitions.md#defineregistry)
- [Definitions.Register](../definitions.md#register)
- [Definitions.UpdateOwned](../definitions.md#updateowned)
- [Definitions.RegisterTag](../definitions.md#registertag)
- [Definitions.RegisterOverlay](../definitions.md#registeroverlay)
- [Predicates.Register](../predicates.md#register)
- [Actions.Register](../actions.md#register)
- [Workflows.Register](../workflows.md#register)
- [Schedules.Register](../schedules.md#register)
- [Events.Define](../events.md#define)
- [State.DefineOwned](../state.md#defineowned)
- [UI.RegisterPage](../ui.md#registerpage)
- [UI.RegisterComponent](../ui.md#registercomponent)
- [UI.RegisterContribution](../ui.md#registercontribution)
- [UI.RegisterViewReplacement](../ui.md#registerviewreplacement)
- [UI.RegisterNavigation](../ui.md#registernavigation)
- [UI.RegisterCommand](../ui.md#registercommand)
- [UI.RegisterShortcut](../ui.md#registershortcut)
- [Plugins.ExportService](../plugins.md#exportservice)
- [Resources.RegisterCleanup](../resources.md#registercleanup)
- [Minecraft.Install.RegisterTemplate](../minecraft-install.md#registertemplate)
- [Minecraft.Install.RegisterLoaderProvider](../minecraft-install.md#registerloaderprovider)
- [Minecraft.Java.RegisterDistributionProvider](../minecraft-java.md#registerdistributionprovider)
- [Minecraft.Launch.RegisterContribution](../minecraft-launch.md#registercontribution)
- [Minecraft.Launch.RegisterPreflight](../minecraft-launch.md#registerpreflight)
- [Minecraft.Content.RegisterFormatProvider](../minecraft-content.md#registerformatprovider)
- [Catalog.RegisterProvider](../catalog.md#registerprovider)
- [Catalog.RegisterCollection](../catalog.md#registercollection)
- [Catalog.RegisterTranslationProvider](../catalog.md#registertranslationprovider)
- [Accounts.RegisterProvider](../accounts.md#registerprovider)
- [Settings.RegisterSchema](../settings.md#registerschema)
- [Settings.RegisterPage](../settings.md#registerpage)
- [Settings.BeginTemporaryOverlay](../settings.md#begintemporaryoverlay)
- [Themes.Preview](../themes.md#preview)
- [Downloads.RegisterSourceResolver](../downloads.md#registersourceresolver)
- [Downloads.RegisterTransferProvider](../downloads.md#registertransferprovider)
- [Minecraft.Diagnostics.RegisterRuleProvider](../minecraft-diagnostics.md#registerruleprovider)

For nested uses, follow the model links from the owning request or result. A successful decode establishes shape, not permission or business success.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/models/registrationref.md) · Apache-2.0.
