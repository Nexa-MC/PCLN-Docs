# ABI 100 API reference

Use this reference after building the [first plugin](../quickstart.md). Each group
explains its purpose and normal call sequence, followed by exact operation contracts.
Fields link to their model or enum definitions. Catalog facts are generated;
behavior notes are reviewed source in `eng/reference-notes.json`.

## Read an operation entry

1. Check its recorded Host status and the installed launcher's capabilities.
2. Confirm the exact permission, legal phase and target ownership.
3. Construct the typed request and invocation options.
4. Inspect Success before decoding the result. An OperationRef requires further observation.
5. Handle conflicts, cancellation and resource release using the group guide.

A wrapper does not implement an unavailable operation. SDK-local method IDs are not
transport opcodes. Field types do not imply undocumented defaults or unrestricted
paths. See [models](models.md), [errors](../errors.md), and [Host support](../host-support.md).

| Capability | Contract | Mapped / declared |
| --- | --- | --- |
| [Contracts](contracts.md) | `nexa.contracts/100` | 9 / 9 |
| [Definitions](definitions.md) | `nexa.definitions/100` | 15 / 15 |
| [Predicates](predicates.md) | `nexa.predicates/100` | 3 / 3 |
| [Actions](actions.md) | `nexa.actions/100` | 3 / 3 |
| [Commands](commands.md) | `nexa.commands/100` | 3 / 3 |
| [Workflows](workflows.md) | `nexa.workflows/100` | 12 / 12 |
| [Schedules](schedules.md) | `nexa.schedules/100` | 6 / 6 |
| [Events](events.md) | `nexa.events/100` | 7 / 7 |
| [State](state.md) | `nexa.state/100` | 6 / 6 |
| [UI](ui.md) | `nexa.ui/100` | 19 / 19 |
| [Plugins](plugins.md) | `nexa.interplugin/100` | 8 / 8 |
| [Diagnostics](diagnostics.md) | `nexa.diagnostics/100` | 4 / 4 |
| [Resources](resources.md) | `nexa.resources/100` | 4 / 4 |
| [Minecraft.Instances](minecraft-instances.md) | `nexa.minecraft.instances/100` | 14 / 18 |
| [Minecraft.Install](minecraft-install.md) | `nexa.minecraft.install/100` | 10 / 15 |
| [Minecraft.Java](minecraft-java.md) | `nexa.minecraft.java/100` | 11 / 14 |
| [Minecraft.Launch](minecraft-launch.md) | `nexa.minecraft.launch/100` | 11 / 14 |
| [Minecraft.Processes](minecraft-processes.md) | `nexa.minecraft.processes/100` | 9 / 9 |
| [Minecraft.Content](minecraft-content.md) | `nexa.minecraft.content/100` | 19 / 21 |
| [Minecraft.Worlds](minecraft-worlds.md) | `nexa.minecraft.worlds/100` | 10 / 13 |
| [Minecraft.Servers](minecraft-servers.md) | `nexa.minecraft.servers/100` | 5 / 5 |
| [Catalog](catalog.md) | `nexa.catalog/100` | 15 / 17 |
| [Accounts](accounts.md) | `nexa.accounts/100` | 15 / 17 |
| [Settings](settings.md) | `nexa.settings/100` | 11 / 14 |
| [Themes](themes.md) | `nexa.themes/100` | 11 / 15 |
| [Backups](backups.md) | `nexa.backups/100` | 0 / 14 |
| [Downloads](downloads.md) | `nexa.downloads/100` | 8 / 10 |
| [Tasks](tasks.md) | `nexa.tasks/100` | 9 / 10 |
| [Storage](storage.md) | `nexa.storage/100` | 8 / 8 |
| [Files](files.md) | `nexa.files/100` | 11 / 11 |
| [Network](network.md) | `nexa.network/100` | 8 / 8 |
| [Platform](platform.md) | `nexa.platform/100` | 10 / 10 |
| [Minecraft.Diagnostics](minecraft-diagnostics.md) | `nexa.minecraft.diagnostics/100` | 3 / 4 |

For existing Nexa preview integrations, see [the 22 retained bindings](legacy.md). These are separate from the retired PCL injection SDK.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/api/index.md) · Apache-2.0.
