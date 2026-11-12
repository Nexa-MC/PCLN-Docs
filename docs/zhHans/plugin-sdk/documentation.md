> 本页保留英文技术原文；中文入门与专题见 [开发文档](index.md)。

# How to read and improve these documents

These documents serve plugin authors, developers of derived launchers, and
contributors to the SDK. A tutorial teaches a reproducible path; a task guide
solves one problem; an explanation describes the underlying rules; a reference
states the contract. Read the tutorial first if you have not built a plugin.

## Versions and evidence

SDK package versions identify published artifacts. Bootstrap versions identify the
loading interface. ABI versions identify negotiated capability families. A Host
source commit identifies an implementation snapshot. None substitutes for another.
Documentation labels unsupported operations explicitly and links to the recorded
Host snapshot rather than promising that every Alpha implements the catalog.

Code described as complete lives in a linked source file and is compiled by CI.
Fragments explain part of that code and retain its names. Pseudocode or call
sequences are labelled; do not paste them into a C file expecting a complete guest.
A successful compile proves syntax and linkage. A Host integration test is needed
to prove permission checks, confirmation, cancellation and visible UI behavior.

## Editorial standard

Start each page with the task or question it answers. Establish prerequisites
before commands. State the working directory, files to edit, expected output and
the next useful step. Explain why an ordering rule exists at the point the reader
needs it. Prefer a concrete failure and recovery action over “handle errors”.

A reference must distinguish required values, omitted values and empty values.
Explain units and bounds only when the implementation establishes them. Do not
invent defaults from a type name. Preserve opaque IDs and revision tokens exactly.
When a Host-specific policy is unknown, identify it as Host-defined.

Use one term consistently: Host owns application authority; PluginSidecar executes
plugins; an action is a registered operation; a task records work; a plan describes
a proposed change. Avoid using “service”, “task” and “provider” interchangeably.
English is the source language; Chinese guides preserve identifiers and commands.
Translate explanations, not wire names or error codes.

## Contributing a correction

Edit the SDK source document, not its copied website page. Update examples first
when a behavior changes, then update prose and the support snapshot. Run
`python eng/verify_docs.py` and compile affected examples. Generated references
come from the catalog and reference annotations; regenerate them rather than
editing their output. A review should follow the instructions from a clean folder
and verify one failure path as well as the successful outcome.

The organization draws on the learning paths and explicit prerequisites used by
[Django](https://docs.djangoproject.com/en/stable/) and
[Forge](https://docs.minecraftforge.net/en/latest/gettingstarted/).
The NexaCL contracts and examples remain specific to this project.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/documentation.md) · Apache-2.0.
