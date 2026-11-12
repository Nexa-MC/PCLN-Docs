# PXML UI tutorials

Learn the historical PXML 1.0 authoring pipeline from source to PXB. Use the matching compiler and PCL.UI.Next runtime; this syntax is not the current plugin NXML format.

**Version scope:** historical PXML 1.0 and its matching runtime. For current plugins, use [ABI 100](/en/plugin-sdk/).

These tutorials cover the complete PXML 1.0 UI authoring contract for developers building PCL.UI.Next interfaces. Every example keeps the build path visible and verifiable:

```text
PXML source → validation → expansion and optimization → PXB → PCL.UI.Next Runtime
```

## Learning path

1. [Create your first UI](./First-Page): write, validate, compile, and inspect a PXB.
2. [Syntax, nodes, and properties](./Syntax-and-Properties): namespaces, primitives, components, literals, and markup expressions.
3. [Layout and sizing](./Layout-and-Sizing): Row, Column, Grid, Overlay, Absolute, Scroll, and constraints.
4. [Bindings, commands, and events](./Binding-and-Commands): pure state reads and explicit side-effect boundaries.
5. [Conditions, lists, and virtualization](./Structure-and-Lists): choose If, Switch, For, or VirtualList and maintain stable keys.
6. [Components, templates, and slots](./Components-and-Templates): compile-time reuse without a runtime control object graph.
7. [Styles, themes, and resources](./Styles-and-Resources): PXSS, theme tokens, resources, and localization.
8. [Motion, interaction, and accessibility](./Motion-Interaction-and-A11y): transitions, FLIP, behaviors, focus, and semantics.
9. [Overlays, navigation, and NativeHost](./Overlays-Navigation-and-NativeHost): lifecycle, barriers, pages, and platform controls.
10. [Build, debug, and release](./Build-Debug-and-Release): reproducible source-to-PXB integration.
11. [Complete page example](./Complete-Example): combine the concepts into a download page.

## Conventions

- XML snippets describe PXML 1.0 language semantics. The standalone compiler and target Runtime profile must both support the referenced nodes, properties, and ABI.
- `bind` reads state and performs pure computation; business side effects go through `cmd`.
- Components, templates, PXSS selectors, and resource names resolve at build time. Runtime keeps no XML DOM and does not discover controls through reflection.
- The compiler transforms build inputs. PCL.UI.Next Runtime owns windows, input, layout, animation, rendering, and platform NativeHost controls.

Follow the chapters in order for a complete path, or use the sidebar and search as a reference.

## Check your result

Build the first page and inspect its output before continuing to bindings or reusable components.
