# NXML syntax, components, identity

Learn NXML-specific authoring rules rather than general XML syntax.

## Root and namespace

```xml
<nxml-page>
  <Page xmlns="https://nexa.dev/nxml/2026" Key="ExamplePage">
    <Text Content="Hello NexaCL" Localize="false" />
  </Page>
</nxml-page>
```

One root; nxml-page has no ordinary attributes and wraps one visual root. A direct Page root also works. Namespace may be omitted; if present it must be the exact URI, not N. Attributes are unqualified and case-sensitive. DTDs/entities/foreign namespaces/duplicate attributes reject. WPF/Avalonia x:Class/Binding/event handlers are not this language.

## Attribute-only text

Text uses Content; buttons Content/Label. Mixed child text and CDATA reject; whitespace/comments are allowed.

```xml
<Text Content="A &amp; B &lt; C" Localize="false" />
```

Escape static XML normally. Bind business values as literal dynamic data, never interpolate XML source.

## Three value sources

| Form | Timing | Purpose |
| --- | --- | --- |
| Literal Height=40 | Typed compilation | Fixed finite fact |
| `{state example.status}` | Resolve declared cell, then local projection | Supported reactive slots |
| `{data title}` | Dynamic compilation | Literal fragment parameters |

Only Content/Label/Placeholder accept mixed data text. Other parameters occupy the full attribute. Data cannot modify primitive metadata/Layout. Braces are not arbitrary C#/getter/call expressions. Inverse `{data !flag}` is only for IsVisible. Pass brace-containing user text as a complete data value.

## Reusable component

StatusCard.c.nxml:
```xml
<nxml-component>
  <StackPanel Class="status-card" Spacing="12" Padding="16" />
</nxml-component>
```

One visual root under nxml-component. Reference attributes override root defaults and children append:

```xml
<StatusCard Key="Summary" Spacing="16">
  <Text Content="Ready" />
</StatusCard>
```

Spacing becomes16, Padding remains16. This is external expansion, not CLR inheritance/setters/callbacks. Load/register components explicitly; no assembly scanning.

## Recipes and roles

Components expand to finite Node recipes/semantic roles. References cannot override Recipe/Role/Kind/AcceptsChildren/Required. Define a new finite wrapper when needed:

```xml
<nxml-component>
  <Node Kind="Switch" Recipe="CommandInput" Role="Switch"
        Clickable="true" Focusable="true" Checked="false" AcceptsChildren="false" />
</nxml-component>
```

It emits intent instead of owning business state and cannot instantiate arbitrary CLR controls.

## Stable identity

Key is unique in the expanded document, 1–128 without whitespace/controls. Class contains up to64 finite space-separated identifiers. Avoid fixed internal keys in multiply instantiated components; use classes or controlled per-instance template parameters. Position is not identity.

## Compilation and failure

```csharp
var components = NxmlComponentLibrary.LoadDirectory(componentDirectory);
var document = NxmlParser.Parse(markup);
var ir = NxmlCompiler.Compile(document, components, NssStyleSheet.Empty);
```

The directory needs every referenced component, not just StatusCard without StackPanel. The lab merges defaults with its custom definition. Cycles/unknowns/duplicate keys/required facts/budget overflow reject before attachment. Never attach a half-valid tree.


## Implementation references

- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlParser.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlParser.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlComponentLibrary.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlComponentLibrary.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs)
