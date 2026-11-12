# Permissions, ownership and confirmation

A plugin can call a capability only when its contract, permission, lifecycle phase
and target scope all permit the call. Passing one check does not imply the others.
Use this page when deciding what to put in a manifest or explaining a denied feature.

## Declare a feature's actual requirements

The manifest requests permissions and names required or optional capabilities.
The Host decides what to grant. Put a capability in the required set only if the
plugin cannot provide its core behavior without it. For an optional feature,
check negotiation and display an unavailable state when the capability is absent.

The API reference lists the exact permission and legal phases for each operation.
Do not infer a write permission from a successful read, or assume a group-level
wrapper makes every operation available. Revocation can invalidate cached access;
handle a denied call even after a positive availability check.

## Keep identities in their ownership scope

IDs, revisions, cursors, file grants, plans, subscriptions and registrations are
opaque. They belong to an admitted load and the domain that issued them. Preserve
them exactly and obtain fresh handles after reload. Never build an ID from a path,
increment a revision, cast one handle type to another or share a cursor with a
second plugin.

A plugin ID names its namespace. It does not make every load with the same ID the
same live owner. A stopped load cannot keep modifying resources through saved
views while a replacement load is starting.

## Let the Host confirm effects

For operations with a preparation step, request a plan, present the actual summary
through the Host-owned confirmation flow, and execute the exact approved plan.
The Host rechecks state after confirmation. A changed target can require a new
plan and renewed review; do not substitute new inputs into an approved request.

A declined dialog must not dispatch the effect. Missing confirmation UI must fail
rather than imply consent. Retain the idempotency key and inputs while inspecting
an uncertain result; a fresh key can represent a second effect.

## Respect each domain's authority

File grants do not automatically include siblings, parents or resolved paths
outside their scope. Public account metadata does not contain bearer tokens or
launch credentials. A network capability remains subject to destination policy.
A read-provider callback cannot perform nested Host mutations.

Registering a provider descriptor does not authorize intercepting arbitrary
launcher activity. Its family, schema, callback, selection and result provenance
must match a supported Host mapping. See [business providers](business-providers.md).

## Verify a denied path

Remove one permission from a test package, rebuild it and repeat the affected action.
Confirm that the failure remains explicit and no fallback bypasses the denied route.
Then stop the plugin and try an old handle in an integration test. The new load
must obtain its own handle instead of inheriting the old load's authority.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/permissions.md) · Apache-2.0.
