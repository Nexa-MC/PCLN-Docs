# Third-party development guide

Use this guide to add appearance, interaction, or independently owned behavior to NexaCL. The implementation baseline is **Firefly Alpha 12, `v2.0.0.alpha.12`**. Examples refer to that tag; architectural roadmap items are not presented as available APIs.

You should be able to read C#, JSON, XML, and shell commands. We skip general variables, loops, classes, and JSON syntax. **NTP, NSS, NXML, and Sidecar-specific syntax and semantics are taught explicitly.** Each route includes complete files, steps, expected outcomes, failure handling, and verification.

## Choose an extension by the outcome

| User outcome | Route | Available work | Boundary |
| --- | --- | --- | --- |
| Change colors, spacing, fonts, runtime icons, or motion | NTP/1 theme | NSS, generated option controls, packaged resources, authorized media | No commands, NXML replacement, or executable code |
| Own new behavior/state and expose a finite resource-page form | Sidecar | Commands, queries, state, events, streams, admitted UI modules | Separate process, publisher trust, and explicit Host grants |
| Learn or contribute Host pages, layout, bindings, or dynamic lists | NXML | Host components, owned fragments, state projection, input semantics | Host authoring language, not arbitrary theme/Sidecar injection |
| Change an admitted caption or observe exposed search signals | Sidecar extensions | Caption patch, Event/Intent bindings, finite Function Patch | Exact Host targets and ABIs, not arbitrary method interception |
| Develop a legacy `.pnp` plugin | Legacy SDK documentation | The corresponding legacy product contracts | Separate from `.nsc`, NXML, and NTP/1 |

“A nice status panel” is not yet a technical decision. Ask whether you only change appearance or own new state, who executes the action, and whether the Host exposes the required slot. Those answers select the implementation.

## Reading route

1. [Develop toward an observable goal](./goal-first): write acceptance outcomes first.
2. [XSR architecture and author responsibilities](./xsr-architecture): distinguish messages, state, and process ownership.
3. Follow [themes](../theme-packs/), [Sidecar](../sidecar/), or [NXML](../nxml/) for your actual goal.
4. Use the [worked design](./walkthrough) to include failure, cancellation, and retirement in the first implementation.
5. Build the sample, verify on the target OS, then publish the package, compatibility range, and evidence.

You do not need the complete frame protocol to change a theme. A visible form, however, does not establish correct state ownership or lifecycle behavior.

## What is available now

This repository provides the Host, portable `Nexa.Sidecar.Protocol` / `Nexa.Sidecar.Transport`, and finite UI contracts. The independent Plugin SDK, executor, and package/UI-IR freeze belong to another project. Project-reference examples here teach **source-level protocol integration**; they do not invent a ready-to-install general SDK NuGet package.

The production launcher requires a trusted publisher signature. Local protocol tests do not need production keys, but are not production installation authorization. Non-executable themes use separate format and resource admission.

## Working with examples

The [examples directory](https://github.com/Nexa-MC/PCLN-Docs/tree/main/examples) contains complete buildable files. Partial snippets identify their insertion context. Run a complete example first, then change one contract at a time. Record “input → expected output → command → actual result.”

A successful test, production installation, and authorization for an extension target are different claims. State them separately. A local screenshot does not replace platform, cancellation, or lifecycle evidence.


## Implementation references

- [docs/xsr/nxml-renderer.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nxml-renderer.md)
- [docs/xsr/ntp-v1.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/ntp-v1.md)
- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
