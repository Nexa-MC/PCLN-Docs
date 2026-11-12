> 本页为英文技术参考；字段、编号与支持状态直接来自同一契约源。中文学习路线见 [开发文档](../index.md)。

# Models, containers and enumerations

This reference records the exact fields used by generated ABI 100 codecs. A field
without `?` is required by its model; nullable values must be encoded as the model
expects. Empty strings, empty arrays, Null and a failed reply have different meanings.
No unspecified default, numeric bound or filesystem authority should be inferred
from a C# type. Operation/domain policy can impose additional constraints.

## Containers

| Type | Fields | Interpretation |
| --- | --- | --- |
| `Page<T>` | Items, NextCursor, Revision | Bounded result sequence; reuse a cursor only for the same query and owner |
| `Snapshot<T>` | Value, Revision, SchemaVersion, ObservedAt | Value plus exact revision, schema version and observation time |
| `AbiReply<T>` | Success, Value, Error | Read Value only after Success; failure is not an empty successful result |

QualifiedId, EntityId, Revision, FileRef and related handles are not interchangeable.
Schemas include transitive model/enum fingerprints. Codecs reject malformed or oversized
values; passing codec validation does not establish business authorization.

## Enumerations

Enum spelling is part of the wire contract. The presence of a member does not mean
every operation or provider family accepts it. See the operation's behavior notes.

### RegistrationState

`Staged`, `Active`, `Retired`

### OperationState

`Pending`, `Running`, `CancellationRequested`, `Completed`, `Failed`, `Cancelled`, `OutcomeUnknown`

### ConfirmationRequirement

`None`, `UserConfirmation`

### CapabilityAvailability

`Supported`, `Unavailable`, `Denied`, `Unsupported`

### IdempotencyMode

`ReadOnly`, `RequiredKey`, `OutcomeMayBeUnknown`

### SelectionPolicy

`UserSelection`, `ObjectOwnership`, `ExplicitRequest`, `ContractPriority`

### MergePolicy

`Add`, `Merge`, `Replace`, `Mask`

### OrderingPolicy

`ExplicitConstraints`, `UserSelection`, `RejectAmbiguity`

### ActivationPolicy

`GroupCommit`

### OwnershipPolicy

`OwnerOnly`, `AuditedOverlay`

### PredicateOutcome

`True`, `False`, `Unknown`, `Error`

### WorkflowNodeKind

`Sequence`, `If`, `Switch`, `ForEach`, `Parallel`, `Action`, `Subflow`, `Delay`, `WaitEvent`, `Retry`, `Try`, `Finally`, `Compensate`, `AskUser`, `Checkpoint`, `Return`, `Fail`

### ConcurrencyPolicy

`Parallel`, `Queue`, `RejectDuplicate`, `ReplacePending`

### ScheduleTrigger

`Interval`, `AtTime`, `Event`

### MissedSchedulePolicy

`Skip`, `Coalesce`, `ReplayBounded`

### DeliveryGuarantee

`BestEffortAtMostOnce`, `AtLeastOnce`

### UIContributionMode

`Append`, `Prepend`, `Wrap`, `Hide`, `Replace`

### DrawCommandKind

`Line`, `Rectangle`, `Ellipse`, `Path`, `Text`, `Image`, `Clip`, `Transform`

### InputEventKind

`Pointer`, `Key`, `Text`, `Focus`

### ProviderFailurePolicy

`Unavailable`, `RetryBounded`, `FailOperation`

### DiagnosticSeverity

`Trace`, `Info`, `Warning`, `Error`

### LaunchArgumentScope

`Jvm`, `Game`

### SignInState

`Pending`, `Challenge`, `Completed`, `Failed`, `Cancelled`

### FilePickKind

`File`, `Directory`, `SaveFile`

### ExtensionMode

`Advisory`, `Required`

### DeletionPolicy

`FreezeReferences`, `RejectWhileReferenced`, `FailSubsequentCalls`

### ParallelCompletion

`All`, `AnySuccess`

### SubscriptionLifetime

`Transient`, `Resumable`

### ReentryPolicy

`Reject`, `Queue`, `AllowBounded`

## Model index

| Model | Fields |
| --- | --- |
| [Empty](models/empty.md) | 0 |
| [TextResult](models/textresult.md) | 1 |
| [BooleanResult](models/booleanresult.md) | 1 |
| [PageRequest](models/pagerequest.md) | 2 |
| [EntityRequest](models/entityrequest.md) | 1 |
| [QualifiedRequest](models/qualifiedrequest.md) | 1 |
| [RegistrationRequest](models/registrationrequest.md) | 1 |
| [WatchRequest](models/watchrequest.md) | 3 |
| [SubscriptionRef](models/subscriptionref.md) | 4 |
| [FileRef](models/fileref.md) | 3 |
| [RootRef](models/rootref.md) | 2 |
| [BlobRef](models/blobref.md) | 4 |
| [CredentialRef](models/credentialref.md) | 3 |
| [LaunchGrant](models/launchgrant.md) | 3 |
| [SchemaRef](models/schemaref.md) | 3 |
| [Reference](models/reference.md) | 2 |
| [NamedValue](models/namedvalue.md) | 2 |
| [LocalizedText](models/localizedtext.md) | 2 |
| [RegistrationRef](models/registrationref.md) | 5 |
| [ValidationIssue](models/validationissue.md) | 4 |
| [ValidationReport](models/validationreport.md) | 2 |
| [MutationPlan](models/mutationplan.md) | 6 |
| [PlanRequest](models/planrequest.md) | 3 |
| [OperationRef](models/operationref.md) | 2 |
| [OperationRequest](models/operationrequest.md) | 1 |
| [OperationRecord](models/operationrecord.md) | 8 |
| [OperationFailure](models/operationfailure.md) | 5 |
| [RetentionPolicy](models/retentionpolicy.md) | 3 |
| [ScopedTarget](models/scopedtarget.md) | 3 |
| [CapabilityDescription](models/capabilitydescription.md) | 5 |
| [PublicContract](models/publiccontract.md) | 4 |
| [ServiceMethod](models/servicemethod.md) | 7 |
| [ContractQuery](models/contractquery.md) | 2 |
| [ProviderKindDefinition](models/providerkinddefinition.md) | 3 |
| [ExtensionPointDefinition](models/extensionpointdefinition.md) | 10 |
| [ConsumerDefinition](models/consumerdefinition.md) | 4 |
| [SchemaValidationRequest](models/schemavalidationrequest.md) | 2 |
| [CompatibilityRequest](models/compatibilityrequest.md) | 3 |
| [RegistryDescriptor](models/registrydescriptor.md) | 13 |
| [Definition](models/definition.md) | 5 |
| [DefinitionBatch](models/definitionbatch.md) | 1 |
| [DefinitionQuery](models/definitionquery.md) | 2 |
| [DefinitionSearch](models/definitionsearch.md) | 3 |
| [DefinitionUpdate](models/definitionupdate.md) | 2 |
| [DefinitionRemove](models/definitionremove.md) | 3 |
| [TagDefinition](models/tagdefinition.md) | 5 |
| [TagResolution](models/tagresolution.md) | 2 |
| [OverlayDefinition](models/overlaydefinition.md) | 7 |
| [ResolutionReport](models/resolutionreport.md) | 5 |
| [PredicateDefinition](models/predicatedefinition.md) | 4 |
| [PredicateRequest](models/predicaterequest.md) | 3 |
| [PredicateResult](models/predicateresult.md) | 3 |
| [ActionDescriptor](models/actiondescriptor.md) | 12 |
| [ActionRequest](models/actionrequest.md) | 5 |
| [WorkflowDefinition](models/workflowdefinition.md) | 9 |
| [WorkflowNode](models/workflownode.md) | 12 |
| [WorkflowRequest](models/workflowrequest.md) | 3 |
| [WorkflowRunRequest](models/workflowrunrequest.md) | 3 |
| [WorkflowStepRequest](models/workflowsteprequest.md) | 4 |
| [WorkflowTrace](models/workflowtrace.md) | 3 |
| [WorkflowStep](models/workflowstep.md) | 4 |
| [ScheduleDefinition](models/scheduledefinition.md) | 10 |
| [ScheduleState](models/schedulestate.md) | 4 |
| [EventDescriptor](models/eventdescriptor.md) | 6 |
| [EventSubscribeRequest](models/eventsubscriberequest.md) | 10 |
| [EventEnvelope](models/eventenvelope.md) | 11 |
| [StateDescriptor](models/statedescriptor.md) | 3 |
| [StateReadRequest](models/statereadrequest.md) | 2 |
| [StateSnapshot](models/statesnapshot.md) | 5 |
| [StateUpdate](models/stateupdate.md) | 4 |
| [UIPage](models/uipage.md) | 4 |
| [UIComponent](models/uicomponent.md) | 3 |
| [UIContribution](models/uicontribution.md) | 7 |
| [UIViewReplacement](models/uiviewreplacement.md) | 4 |
| [UIViewContract](models/uiviewcontract.md) | 7 |
| [UINavigation](models/uinavigation.md) | 4 |
| [UICommand](models/uicommand.md) | 3 |
| [UIShortcut](models/uishortcut.md) | 4 |
| [UIDialog](models/uidialog.md) | 3 |
| [UIDialogRef](models/uidialogref.md) | 2 |
| [UINavigateRequest](models/uinavigaterequest.md) | 2 |
| [UINotification](models/uinotification.md) | 3 |
| [UIModelUpdate](models/uimodelupdate.md) | 4 |
| [UIViewWatch](models/uiviewwatch.md) | 3 |
| [DrawingSurfaceRequest](models/drawingsurfacerequest.md) | 4 |
| [DrawingSurfaceRef](models/drawingsurfaceref.md) | 3 |
| [DrawCommand](models/drawcommand.md) | 5 |
| [DrawSubmission](models/drawsubmission.md) | 3 |
| [InputSubscription](models/inputsubscription.md) | 3 |
| [ProviderDescriptor](models/providerdescriptor.md) | 13 |
| [ServiceDefinition](models/servicedefinition.md) | 4 |
| [ServiceLookup](models/servicelookup.md) | 5 |
| [ServiceBinding](models/servicebinding.md) | 5 |
| [ServiceCall](models/servicecall.md) | 5 |
| [ServiceProbe](models/serviceprobe.md) | 3 |
| [LoadReport](models/loadreport.md) | 5 |
| [DiagnosticReport](models/diagnosticreport.md) | 5 |
| [DiagnosticSpan](models/diagnosticspan.md) | 4 |
| [SpanRef](models/spanref.md) | 1 |
| [CleanupRequest](models/cleanuprequest.md) | 1 |
| [InstanceSummary](models/instancesummary.md) | 6 |
| [InstanceDetails](models/instancedetails.md) | 4 |
| [InstanceListRequest](models/instancelistrequest.md) | 2 |
| [RootRequest](models/rootrequest.md) | 1 |
| [RootRegistration](models/rootregistration.md) | 2 |
| [InstanceCreateRequest](models/instancecreaterequest.md) | 5 |
| [InstanceCloneRequest](models/instanceclonerequest.md) | 4 |
| [InstanceRenameRequest](models/instancerenamerequest.md) | 3 |
| [InstanceDeleteRequest](models/instancedeleterequest.md) | 3 |
| [EffectiveSetting](models/effectivesetting.md) | 4 |
| [GameVersion](models/gameversion.md) | 3 |
| [LoaderVersionRequest](models/loaderversionrequest.md) | 3 |
| [LoaderVersion](models/loaderversion.md) | 4 |
| [InstallerInspection](models/installerinspection.md) | 4 |
| [InstallDraft](models/installdraft.md) | 6 |
| [InstallDraftUpdate](models/installdraftupdate.md) | 2 |
| [InstallPlan](models/installplan.md) | 3 |
| [InstallStep](models/installstep.md) | 4 |
| [RecoveryRecord](models/recoveryrecord.md) | 4 |
| [InstallTemplate](models/installtemplate.md) | 5 |
| [JavaRuntime](models/javaruntime.md) | 6 |
| [JavaRequirements](models/javarequirements.md) | 4 |
| [JavaSelection](models/javaselection.md) | 4 |
| [JavaDistribution](models/javadistribution.md) | 5 |
| [JavaInstallRequest](models/javainstallrequest.md) | 2 |
| [LaunchProfile](models/launchprofile.md) | 9 |
| [LaunchArgument](models/launchargument.md) | 3 |
| [LaunchProfileWrite](models/launchprofilewrite.md) | 3 |
| [LaunchProfileSelection](models/launchprofileselection.md) | 3 |
| [LaunchIntent](models/launchintent.md) | 4 |
| [LaunchTarget](models/launchtarget.md) | 2 |
| [LaunchPlan](models/launchplan.md) | 5 |
| [LaunchAttempt](models/launchattempt.md) | 6 |
| [LaunchContributionRegistration](models/launchcontributionregistration.md) | 4 |
| [LaunchContributionReport](models/launchcontributionreport.md) | 3 |
| [GameSession](models/gamesession.md) | 4 |
| [LogRangeRequest](models/lograngerequest.md) | 3 |
| [LogChunk](models/logchunk.md) | 4 |
| [SessionMetrics](models/sessionmetrics.md) | 4 |
| [ContentItem](models/contentitem.md) | 7 |
| [ContentQuery](models/contentquery.md) | 3 |
| [ContentChangeRequest](models/contentchangerequest.md) | 4 |
| [ContentDependencyGraph](models/contentdependencygraph.md) | 4 |
| [ContentDependency](models/contentdependency.md) | 4 |
| [ContentPlan](models/contentplan.md) | 3 |
| [ContentTransaction](models/contenttransaction.md) | 5 |
| [IntegrityReport](models/integrityreport.md) | 4 |
| [ContentTransfer](models/contenttransfer.md) | 4 |
| [WorldSummary](models/worldsummary.md) | 5 |
| [WorldMetadata](models/worldmetadata.md) | 3 |
| [WorldCopyRequest](models/worldcopyrequest.md) | 4 |
| [WorldRenameRequest](models/worldrenamerequest.md) | 3 |
| [DataPackSelection](models/datapackselection.md) | 4 |
| [ServerRecord](models/serverrecord.md) | 4 |
| [ServerList](models/serverlist.md) | 2 |
| [ServerStatus](models/serverstatus.md) | 6 |
| [ServerJoinRequest](models/serverjoinrequest.md) | 2 |
| [ResourceRef](models/resourceref.md) | 2 |
| [ResourceVersionRef](models/resourceversionref.md) | 2 |
| [CatalogSearch](models/catalogsearch.md) | 6 |
| [CatalogProject](models/catalogproject.md) | 5 |
| [CatalogVersionQuery](models/catalogversionquery.md) | 3 |
| [CatalogVersion](models/catalogversion.md) | 5 |
| [CatalogFile](models/catalogfile.md) | 4 |
| [CatalogDependency](models/catalogdependency.md) | 3 |
| [FavoriteChange](models/favoritechange.md) | 3 |
| [CatalogInstallRequest](models/cataloginstallrequest.md) | 3 |
| [ResourceCollection](models/resourcecollection.md) | 3 |
| [AccountPublic](models/accountpublic.md) | 5 |
| [SignInRequest](models/signinrequest.md) | 2 |
| [SignInChallenge](models/signinchallenge.md) | 5 |
| [SignInContinue](models/signincontinue.md) | 3 |
| [LaunchEligibility](models/launcheligibility.md) | 3 |
| [GrantRequest](models/grantrequest.md) | 2 |
| [Wardrobe](models/wardrobe.md) | 4 |
| [Cape](models/cape.md) | 3 |
| [SkinRequest](models/skinrequest.md) | 3 |
| [CapeSelection](models/capeselection.md) | 2 |
| [SettingSchema](models/settingschema.md) | 4 |
| [SettingQuery](models/settingquery.md) | 2 |
| [SettingChange](models/settingchange.md) | 4 |
| [SettingMigration](models/settingmigration.md) | 5 |
| [SettingsProfile](models/settingsprofile.md) | 4 |
| [SettingsOverlay](models/settingsoverlay.md) | 2 |
| [ThemeSummary](models/themesummary.md) | 4 |
| [ThemePreparation](models/themepreparation.md) | 3 |
| [ThemeOptions](models/themeoptions.md) | 3 |
| [ThemeOptionChange](models/themeoptionchange.md) | 2 |
| [ThemeTransfer](models/themetransfer.md) | 2 |
| [ThemeResource](models/themeresource.md) | 3 |
| [BackupSummary](models/backupsummary.md) | 5 |
| [BackupStatistics](models/backupstatistics.md) | 3 |
| [BackupCapture](models/backupcapture.md) | 4 |
| [BackupRestore](models/backuprestore.md) | 3 |
| [BackupTransfer](models/backuptransfer.md) | 2 |
| [BackupPrune](models/backupprune.md) | 3 |
| [BackupRetention](models/backupretention.md) | 3 |
| [DownloadPlan](models/downloadplan.md) | 4 |
| [DownloadSource](models/downloadsource.md) | 3 |
| [DownloadState](models/downloadstate.md) | 6 |
| [TaskCreate](models/taskcreate.md) | 4 |
| [TaskProgress](models/taskprogress.md) | 4 |
| [TaskCompletion](models/taskcompletion.md) | 4 |
| [TaskFailure](models/taskfailure.md) | 3 |
| [NamespaceRequest](models/namespacerequest.md) | 2 |
| [StorageNamespace](models/storagenamespace.md) | 4 |
| [StorageKey](models/storagekey.md) | 2 |
| [StorageValue](models/storagevalue.md) | 3 |
| [StorageWrite](models/storagewrite.md) | 5 |
| [StorageQuery](models/storagequery.md) | 3 |
| [StorageTransaction](models/storagetransaction.md) | 3 |
| [StorageCommit](models/storagecommit.md) | 2 |
| [StorageMigration](models/storagemigration.md) | 4 |
| [FilePick](models/filepick.md) | 3 |
| [FileQuery](models/filequery.md) | 2 |
| [FileStat](models/filestat.md) | 6 |
| [FileRead](models/fileread.md) | 3 |
| [FileWrite](models/filewrite.md) | 3 |
| [FileMove](models/filemove.md) | 3 |
| [FileDelete](models/filedelete.md) | 3 |
| [NetworkRequest](models/networkrequest.md) | 5 |
| [NetworkResponse](models/networkresponse.md) | 4 |
| [NetworkConnectionRequest](models/networkconnectionrequest.md) | 4 |
| [NetworkConnection](models/networkconnection.md) | 4 |
| [NetworkSend](models/networksend.md) | 3 |
| [NetworkReceive](models/networkreceive.md) | 2 |
| [NetworkPacket](models/networkpacket.md) | 3 |
| [PlatformDescription](models/platformdescription.md) | 1 |
| [ClipboardContent](models/clipboardcontent.md) | 2 |
| [PowerState](models/powerstate.md) | 3 |
| [DisplayInfo](models/displayinfo.md) | 4 |
| [ArchitectureInfo](models/architectureinfo.md) | 2 |
| [DiagnosticAnalysis](models/diagnosticanalysis.md) | 3 |
| [RepairRequest](models/repairrequest.md) | 3 |
| [DeclarativeContentPack](models/declarativecontentpack.md) | 3 |
| [StorageEntry](models/storageentry.md) | 2 |
| [SubscriptionRead](models/subscriptionread.md) | 2 |
| [SubscriptionBatch](models/subscriptionbatch.md) | 2 |
| [PackageFileRequest](models/packagefilerequest.md) | 1 |
| [EventSubscriptionRegistration](models/eventsubscriptionregistration.md) | 2 |
| [ManagedJavaOffer](models/managedjavaoffer.md) | 9 |
| [ManagedJavaInstallRequest](models/managedjavainstallrequest.md) | 2 |
| [StorageMigrationInput](models/storagemigrationinput.md) | 4 |
| [StorageMigrationOutput](models/storagemigrationoutput.md) | 1 |
| [BusinessProviderCall](models/businessprovidercall.md) | 6 |


---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/api/models.md) · Apache-2.0.
