# Host implementation snapshot

Use this page to distinguish a declared SDK operation from an implemented launcher
route. The recorded development Host maps **358/358** ABI 100 operations.
**0 operations remain unmapped.**
Source revision: `3cefcbaa360e105cee949f181f90285fe118994e`.

NexaCL development main integration; no new launcher Alpha is implied.

## What the count means

A mapping still requires permission, legal phase, ownership, supported platform and
business preconditions. It does not promise complete provider families or every
option in a request. The SDK deliberately describes the complete catalog so
compatible Hosts can implement more routes. Older released Alphas can map fewer.

The current custom catalog provider supports seven read methods. Custom catalog
installation and favorites are not implied. Java providers use verified ZIP archives; managed Mojang offers use the separate
multi-file distribution path. Provider families, supported fields and budgets are
documented in the [business provider guide](business-providers.md).
Production Market delivery is a separate unfinished integration boundary.

## Before requiring a capability

Check the actual Host's negotiated capabilities, then handle per-call unavailability.
Make a nonessential feature optional and explain why its UI is unavailable. Do not
replace a failed operation with a successful empty result or a private implementation
that bypasses Host ownership. Source mappings are recorded in
`contracts/host-support.json`; update them only from implementation evidence.
The ABI catalog contains no per-Host status. The retained C/C# descriptor field
`HostBinding` has the neutral value `HostDefined` for compatibility; it is not
a runtime support flag.

## Gaps by capability group

No groups have unmapped operations in this Host revision.

## Unmapped operations

None in the recorded Host revision.

[API reference](api/index.md) · [Migration](migration.md)

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/host-support.md) · Apache-2.0.
