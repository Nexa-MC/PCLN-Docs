# Platform capabilities and runtime data

Alpha 14 features must be consumed according to observed platform availability. A field's existence does not prove a measurement exists on this device. Product features below do not automatically create new Sidecar permissions or Host APIs.

## Resource governance

Windows/Linux provide explicit CPU policy, CPU Sets/affinity and QoS. Linux adds user-level systemd/cgroup CPU, memory and I/O quotas and optional GameMode. Settings are captured for the next launch; defaults preserve OS policy. Unsupported or unauthorized explicit requests fail rather than pretending success. Custom wrappers cannot promise the owned JVM lifecycle.

Critical memory pressure reclaims caches and cooperatively DEACTIVATEs Sidecars. Recovery can reuse the same registered session. Cancel activation-owned work, retire UI leases and support ACTIVATE again; a still-running process is not permission to continue deactivated work. Disk latency, metered networks, battery and thermal facts constrain background admission.

Minecraft memory estimation remains disabled and does not participate in startup preflight or automatic heap sizing. Runtime sampling and OS pressure policy are distinct from estimation.

## Local integration and backup

Windows provides taskbar download progress and native screenshot sharing. macOS supplies Quick Look/APFS clone; macOS13+ bundles Spotlight/App Intents. Linux offers explicit Steam/Gamescope registration. Steam Input, Siri and device features depend on the user's system configuration; CI is not physical-device acceptance.

Btrfs/ZFS snapshots are read-only backup capture leases requiring an exact eligible subvolume/dataset, no descendants and existing permissions. The product does not sudo or create datasets; unsupported cases use verified copies. Restores create a new directory, never arbitrary live-world rollback.

## Runtime telemetry

Diagnostic launch schema1 captures allowlisted configuration, mods schema2 bounded metadata pages, run periodic samples, and run-summary schema1 actual terminal observations. A random per-run ID is not a user identity.

Configured heap_mib is not measured heap; private bytes is neither native nor commit. -1 means unavailable and 0 can be observed zero; exit_observed disambiguates exit codes. Mod declarations/nested candidates/hashes do not establish activation. Missing pages/timeouts/budget truncation stay incomplete. No account tokens, personal paths, save content or raw logs are uploaded.

Per-run retention is30 days, daily aggregates/error groups90 days, explicitly submitted questionnaires180 days. Necessary/diagnostic tiers, prerelease diagnostic policy and stable revocation remain. Every30th primary UI start invites a dismissible questionnaire; announcements are plain text. Dismissing a survey does not authorize submission.

See the source repository's [platform guide](https://github.com/Nexa-MC/NexaCL/blob/main/docs/platform-integration.md) and [runtime diagnostics](https://github.com/Nexa-MC/NexaCL/blob/main/docs/runtime-diagnostics.md). LAN handoff/streaming, AI backends and later display adaptations remain deferred.
