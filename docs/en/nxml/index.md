# NXML Host UI tutorial

Learn NexaCL's authoring language from first principles for XSR presentation, Host contributions, and controlled composition tests. **NTP cannot replace pages and Sidecar uses separate schema1/2. Learning NXML does not grant product-tree injection.**

## Goal and runtime model

NXML declares nodes/layout/state inputs/intent outputs. Services execute and publish facts. Renderer never interprets C# or discovers services reflectively.

```text
External .nxml/.c.nxml + base .nss
 → bounded parse/expansion → typed Host IR
 → predeclared State resolution → retained UI tree
 → local projection/layout/hit testing/drawing
Input → semantic intent → composition → business/State
```

Runtime finite markup compilation is not CLR JIT or dynamic C# generation; it works with NativeAOT. Internal Host IR is not the stable serialized plugin ABI.

## Run the lab

[Authoring Lab](https://github.com/Nexa-MC/PCLN-Docs/tree/main/examples/authoring-lab) includes page/component/fragment/base-style/composition code. It inspects semantic scenes, not native windows or a third-party page installer.

```sh
dotnet run --project examples/authoring-lab/Authoring.Lab.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- /absolute/path/to/PCLN-Docs
```

## Learning route

1. [Syntax/components](./syntax-and-components): roots, attributes, namespace, expansion, identity.
2. [Layout/style](./layout-and-style): sizing, containers, scroll, base NSS versus NSS/1.
3. [State/input](./state-and-input): declared cells, bindings, intent, drafts, controls.
4. [Dynamic/reload](./dynamic-and-reload): parameterized owned fragments and retained operations.
5. [Overlays/accessibility](./overlays-and-accessibility): modal/anchor/dismiss/live/retirement.
6. [Reference](./reference): every built-in component, property group, binding, budget.
7. [Complete example](./complete-example): actual project, negative checks, AOT.

Each chapter starts with an outcome and ownership. A working page includes correct state/input/teardown/stale-result isolation, not only pixels.


## Implementation references

- [docs/xsr/nxml-renderer.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nxml-renderer.md)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlParser.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlParser.cs)
- [Nexa.Xsr.Renderer.Nxml.Runtime/NxmlUiLoader.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Runtime/NxmlUiLoader.cs)
