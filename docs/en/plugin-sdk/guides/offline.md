# Design a plugin that remains useful offline

Separate installation, authorization and normal execution. An SDK download is a
build dependency; a Market entitlement is an admission decision; a network request
made by your feature is runtime behavior. Caching one does not satisfy the others.

## Build offline

Complete one successful template build while connected. Keep the installed compiler,
verified `.sdk` cache and its source archive. Later builds verify that cache and can
compile without a fresh download. A missing or corrupt cache needs the pinned
bundle again; do not fetch a floating branch as a silent fallback.

## Run offline

A Host may retain approved encrypted package bytes and verification material for
later local admission. The SDK does not issue those approvals, hold Market private
keys or override Host expiry/revocation policy. Production Market integration is
not complete in the recorded implementation; do not promise a universal offline
license period that the Host has not defined.

Package static NXML and other required assets with the plugin. Store private user
preferences in authorized storage. Make remote catalogs, account refresh and online
services optional where the feature can operate without them. Show a cached value
with its observation time; do not label it a fresh successful response.

## Reconnect without losing edits

Keep pending local intent distinct from committed remote state. Re-read current
revisions before applying an edit after reconnecting. If they conflict, reconcile
or ask the user to review a new plan. Never replay an unknown remote mutation merely
because connectivity returned.

## Verify

After local admission, disconnect the network and restart the launcher. Check the
plugin's static page and local data, then exercise each remote-dependent feature.
Reconnect and verify that failed reads recover and uncertain writes are not duplicated.
Repeat with a denied permission: offline mode must not become an authorization bypass.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/guides/offline.md) · Apache-2.0.
