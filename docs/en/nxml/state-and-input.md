# State bindings, drafts, intent

Local facts drive presentation; UI requests effects. Renderer performs no Sidecar/HTTP/service calls. Host composition owns asynchronous work.

## Declare typed ownership first

Given compiled ir from the previous chapter:

```csharp
var tree = new XsrUiTree();
var bridge = new XsrUiStateBridge(tree);
var builder = new XsrStateStoreBuilder();
builder.Cell<string>(XsrSemanticId.Parse("example.status"), "Example");
builder.Cell<bool>(XsrSemanticId.Parse("example.enabled"), "Example");
var state = builder.Build(bridge);
state.Publish(state.Resolve(XsrSemanticId.Parse("example.status")), "Ready");
state.Publish(state.Resolve(XsrSemanticId.Parse("example.enabled")), true);
var intents = new XsrUiIntentBuffer();
var root = NxmlUiLoader.LoadDetached(ir, tree, state);
var renderer = new XsrUiRenderer(tree, state, sink: intents, stateBridge: bridge);
renderer.SetRoot(root);
```

Declare cells before Build seals the registry. Markup does not create missing state. Unknown IDs/type mismatch fail; availability is separate from retained value.

## Supported bindings

```xml
<StackPanel>
  <Text Content="{state example.status}" Localize="false" />
  <Button Key="Refresh" Label="Refresh" Content="Refresh"
          Enabled="{state example.enabled}" Command="example.refresh" />
</StackPanel>
```

| Property | Type/scope |
| --- | --- |
| Content | string on Text/CommandInput |
| Label | string semantic label |
| IsVisible | bool |
| Enabled/Clickable | bool on supported input recipes |
| Value | double on Progress only |
| TransitionKey | string transition fact |

Width/Command/Role/Placeholder/Checked/Selected/RangeValue are not arbitrary State bindings. Use finite Host data projection/reload; dynamic placeholder text is not a state getter.

## Intent, not service execution

```csharp
renderer.Render();
renderer.Activate(refreshEntity);
foreach (var intent in intents.Drain()) {
    Console.WriteLine(intent.Command.Value);
}
```

The loaded Refresh entity emits example.refresh; disabled binding prevents it. IntentBuffer is a test/composition buffer, not an unlimited production queue. Composition validates source lifetime, calls explicit async ports, and publishes authoritative state. No service construction/query/blocking in rendering.

## Input drafts

```xml
<TextInput Key="NoteInput" Label="Note" Placeholder="Write a note"
           MaximumLength="120" Enabled="{state example.enabled}" />
```

Label is required; Content is prohibited, including password seeding. MaximumLength defaults2048, range1–32768. IsPassword preserves secret semantics; PreserveTabs is for explicit trusted editors.

ReadDraft belongs at a trusted Host submit boundary. Drafts/secrets stay out of scene/diagnostics. SetTextInputValue/Selection/Preedit are Host presentation/input APIs, not business dependencies. Compatible reload retains draft/caret/selection/IME.

## Boolean controls

```xml
<nxml-dynamic>
  <CheckBox Key="UseFeature" Label="Use feature" Command="example.feature.toggle"
            Checked="{data checked}" />
</nxml-dynamic>
```

Pass true/false data, emit intent, execute business, then reload projected truth. Private toggle state is not business authority; Checked is not two-way State binding.

## Slider versus Progress

Slider uses Minimum/Maximum/Step/RangeValue with finite increasing limits, positive step, absolute bounds≤1e12 and at most1e9 increments. Progress Value is a double presentation binding; Ring/Indeterminate make a loading ring. Do not transfer Progress binding semantics to other controls.

## Localization and teardown

Localize static vocabulary; mark user/file/already-localized values false. CompileLocalized translates the format before inserting literal data and preserves parameter names. Navigation cancels work/retires sources; restore from current State rather than querying away old drafts.

Continue with [owned dynamic content](./dynamic-and-reload).


## Implementation references

- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlNodeSchema.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlNodeSchema.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs)
- [Nexa.Xsr.Renderer/XsrUiStateBridge.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer/XsrUiStateBridge.cs)
- [Nexa.Xsr.Renderer/XsrUiTextInput.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer/XsrUiTextInput.cs)
