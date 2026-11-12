# Retained Nexa preview bindings

These 22 dispatch slots preserve the earlier Nexa Bootstrap/ABI preview contract.
They are unrelated to historical PCL.N.Plugin.* injection plugins. New features
should use the current typed capability operations unless an existing integration
specifically requires a retained slot. Numeric IDs remain local SDK dispatch IDs,
not transport opcodes. The current catalog uses its own non-overlapping IDs.

The C bindings use the `nx_Legacy_*` prefix. Results in this compatibility catalog
are generic AbiValue; use the matching legacy facade's decoder instead of assuming
that a similarly named current method returns the same shape. The current Host
mapping count does not add these slots to the 346-operation catalog.

## Lifecycle and authority

A retained method still requires negotiated access and its documented load scope.
Legacy service ExportService belongs to Initialize, Bind to PostInitialize, Probe
to Checkup and ordinary Call to Active. Finalize cannot add registrations. Cleanup
uses the actual owned handle; do not reinterpret it as a current RegistrationRef.
The event slot 3 is reserved and must not be invoked. Verify legacy integration
against the actual Host rather than assuming namespace compatibility is sufficient.

## Dispatch table

| Family | Contract | Method | ID | Input | Output |
| --- | --- | --- | --- | --- | --- |
| Legacy.Events | `nexa.events/100` | DeclareEvent | 1 | [LegacyEventDeclaration](#legacyeventdeclaration) | `AbiValue` |
| Legacy.Events | `nexa.events/100` | Subscribe | 2 | [LegacyEventSubscription](#legacyeventsubscription) | `AbiValue` |
| Legacy.Events | `nexa.events/100` | Publish | 4 | [LegacyEventPublish](#legacyeventpublish) | `AbiValue` |
| Legacy.Events | `nexa.events/100` | Unsubscribe | 5 | [LegacyHandle](#legacyhandle) | `AbiValue` |
| Legacy.UI | `nexa.ui/100` | DeclareSurface | 1 | [LegacySurface](#legacysurface) | `AbiValue` |
| Legacy.UI | `nexa.ui/100` | DeclareCommand | 2 | [LegacyCommand](#legacycommand) | `AbiValue` |
| Legacy.UI | `nexa.ui/100` | DeclarePlacement | 3 | [LegacyPlacement](#legacyplacement) | `AbiValue` |
| Legacy.UI | `nexa.ui/100` | DeclareSettings | 4 | [LegacySettings](#legacysettings) | `AbiValue` |
| Legacy.UI | `nexa.ui/100` | PatchState | 5 | [LegacyPatch](#legacypatch) | `AbiValue` |
| Legacy.UI | `nexa.ui/100` | SetCommandState | 6 | [LegacyCommandState](#legacycommandstate) | `AbiValue` |
| Legacy.Plugins | `nexa.interplugin/100` | Describe | 1 | [LegacyServiceQuery](#legacyservicequery) | `AbiValue` |
| Legacy.Plugins | `nexa.interplugin/100` | Bind | 2 | [LegacyServiceRequirement](#legacyservicerequirement) | `AbiValue` |
| Legacy.Plugins | `nexa.interplugin/100` | Call | 3 | [LegacyServiceCall](#legacyservicecall) | `AbiValue` |
| Legacy.Plugins | `nexa.interplugin/100` | Release | 4 | [LegacyHandle](#legacyhandle) | `AbiValue` |
| Legacy.Plugins | `nexa.interplugin/100` | RebindOptional | 5 | [LegacyServiceRequirement](#legacyservicerequirement) | `AbiValue` |
| Legacy.Plugins | `nexa.interplugin/100` | ExportService | 6 | [LegacyServiceDeclaration](#legacyservicedeclaration) | `AbiValue` |
| Legacy.Plugins | `nexa.interplugin/100` | Probe | 7 | [LegacyServiceProbe](#legacyserviceprobe) | `AbiValue` |
| Legacy.Diagnostics | `nexa.diagnostics/100` | Report | 1 | [LegacyDiagnostic](#legacydiagnostic) | `AbiValue` |
| Legacy.Diagnostics | `nexa.diagnostics/100` | ReportFinding | 2 | [LegacyFinding](#legacyfinding) | `AbiValue` |
| Legacy.Diagnostics | `nexa.diagnostics/100` | QueryRegistrations | 3 | [Empty](#empty) | `AbiValue` |
| Legacy.Diagnostics | `nexa.diagnostics/100` | QueryBindingStatus | 4 | [Empty](#empty) | `AbiValue` |
| Legacy.Resources | `nexa.resources/100` | RegisterCleanup | 1 | [LegacyCleanup](#legacycleanup) | `AbiValue` |

## Empty

Encode the empty model; it is not an arbitrary Null payload.

## LegacyHandle

| Field | Type | Required literal |
| --- | --- | --- |
| `Handle` | `ulong` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyEventDeclaration

| Field | Type | Required literal |
| --- | --- | --- |
| `Name` | `string` | No literal fixed by the catalog |
| `PayloadSchemaId` | `string` | No literal fixed by the catalog |
| `PayloadSchemaDigest` | `string` | No literal fixed by the catalog |
| `Delivery` | `string` | BestEffortAtMostOnce |
| `MaxPayloadBytes` | `int` | No literal fixed by the catalog |
| `QueueLimit` | `int` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyEventSubscription

| Field | Type | Required literal |
| --- | --- | --- |
| `SourcePluginId` | `string` | No literal fixed by the catalog |
| `EventName` | `string` | No literal fixed by the catalog |
| `SchemaId` | `string` | No literal fixed by the catalog |
| `Handler` | `ulong` | No literal fixed by the catalog |
| `Required` | `bool` | No literal fixed by the catalog |
| `Concurrency` | `int` | No literal fixed by the catalog |
| `QueueLimit` | `int` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyEventPublish

| Field | Type | Required literal |
| --- | --- | --- |
| `Handle` | `ulong` | No literal fixed by the catalog |
| `Payload` | `AbiValue` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacySurface

| Field | Type | Required literal |
| --- | --- | --- |
| `LocalId` | `string` | No literal fixed by the catalog |
| `Nodes` | `AbiValue` | No literal fixed by the catalog |
| `ResourceIds` | `string[]` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyCommand

| Field | Type | Required literal |
| --- | --- | --- |
| `LocalId` | `string` | No literal fixed by the catalog |
| `Title` | `string` | No literal fixed by the catalog |
| `Handler` | `ulong` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyPlacement

| Field | Type | Required literal |
| --- | --- | --- |
| `LocalId` | `string` | No literal fixed by the catalog |
| `SurfaceId` | `string` | No literal fixed by the catalog |
| `SlotId` | `string` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacySettings

| Field | Type | Required literal |
| --- | --- | --- |
| `LocalId` | `string` | No literal fixed by the catalog |
| `SchemaId` | `string` | No literal fixed by the catalog |
| `SchemaDigest` | `string` | No literal fixed by the catalog |
| `Layout` | `AbiValue` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyPatch

| Field | Type | Required literal |
| --- | --- | --- |
| `Handle` | `ulong` | No literal fixed by the catalog |
| `Revision` | `ulong` | No literal fixed by the catalog |
| `Patch` | `AbiValue` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyCommandState

| Field | Type | Required literal |
| --- | --- | --- |
| `Handle` | `ulong` | No literal fixed by the catalog |
| `Enabled` | `bool` | No literal fixed by the catalog |
| `Visible` | `bool` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyServiceRequirement

| Field | Type | Required literal |
| --- | --- | --- |
| `ProviderPluginId` | `string` | No literal fixed by the catalog |
| `ServiceId` | `string` | No literal fixed by the catalog |
| `MinimumContractVersion` | `uint` | No literal fixed by the catalog |
| `MaximumContractVersion` | `uint` | No literal fixed by the catalog |
| `Required` | `bool` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyServiceQuery

| Field | Type | Required literal |
| --- | --- | --- |
| `ProviderPluginId` | `string` | No literal fixed by the catalog |
| `ServiceId` | `string` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyServiceCall

| Field | Type | Required literal |
| --- | --- | --- |
| `Handle` | `ulong` | No literal fixed by the catalog |
| `MethodId` | `uint` | No literal fixed by the catalog |
| `Payload` | `AbiValue` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyServiceDeclaration

| Field | Type | Required literal |
| --- | --- | --- |
| `ServiceId` | `string` | No literal fixed by the catalog |
| `ContractId` | `string` | No literal fixed by the catalog |
| `ContractVersion` | `uint` | No literal fixed by the catalog |
| `SchemaDigest` | `string` | No literal fixed by the catalog |
| `Methods` | `AbiValue[]` | No literal fixed by the catalog |
| `HealthProbe` | `AbiValue` | No literal fixed by the catalog |
| `Handler` | `ulong` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyServiceProbe

| Field | Type | Required literal |
| --- | --- | --- |
| `Handle` | `ulong` | No literal fixed by the catalog |
| `ProbeId` | `uint` | No literal fixed by the catalog |
| `Payload` | `AbiValue` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyDiagnostic

| Field | Type | Required literal |
| --- | --- | --- |
| `Code` | `string` | No literal fixed by the catalog |
| `Message` | `string` | No literal fixed by the catalog |
| `Severity` | `string` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyFinding

| Field | Type | Required literal |
| --- | --- | --- |
| `Code` | `string` | No literal fixed by the catalog |
| `Message` | `string` | No literal fixed by the catalog |
| `Fatal` | `bool` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.

## LegacyCleanup

| Field | Type | Required literal |
| --- | --- | --- |
| `Callback` | `ulong` | No literal fixed by the catalog |

Fields follow the retained facade contract. A raw integer handle remains owner-scoped; a string schema ID must match its digest. Do not substitute a current DTO merely because it contains similar fields.


## Reserved versus occupied IDs

Resources/1 is the retained cleanup operation listed above. Events/3 is reserved and excluded from the 22 callable legacy operations. A gap is not authority to assign a new operation: published IDs must retain their meaning.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/api/legacy.md) · Apache-2.0.
