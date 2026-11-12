# List instances without leaking handles or losing pages

Use the Minecraft.Instances capability when your feature needs the launcher's
instance inventory. Request its exact read permission and negotiate the contract;
listing arbitrary directories is not equivalent to reading the Host inventory.

## Read a page

Use `Minecraft.Instances.List` with its typed query from the
[operation reference](../api/minecraft-instances.md). Start with no cursor and a
bounded limit. Consume Items, retain the returned NextCursor, and request the next
page with the same query. Stop when NextCursor is absent.

A cursor is opaque and may be tied to query, provider, scope and current load.
Do not decode it, increment it, reuse it for a different filter, or share it with
another plugin. An invalid cursor is a failed request, not the end of the list.
Re-read from the beginning when the Host says the page sequence is no longer valid.

## Keep selection separate

Listing an instance does not select it for the user or authorize launching it.
Keep the returned instance identity for subsequent scoped reads. Use the documented
selection or launch operation only when the feature actually requests that change.
Do not derive an instance ID from its display name or directory basename.

## Display a stable view

Treat Snapshot revisions and observation times as metadata from the Host. A watch
can reduce polling, but it can report gaps. On a gap, obtain a fresh inventory and
reconcile visible selections by identity. If a selected instance disappeared, show
that fact instead of silently choosing another instance for a mutation.

## Verify

Test an empty inventory, multiple pages, an instance removed between requests and
a denied permission. Read failure must remain distinguishable from zero instances.
See [mutations](mutations.md) before adding create, rename or delete controls.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/how-to/read-instances.md) · Apache-2.0.
