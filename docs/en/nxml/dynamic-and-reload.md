# Dynamic templates, stable items, retained updates

Update list content without resetting drafts, scrolling, or motion. Dynamic owns fragments; external business/state composition still owns facts.

## Empty slot

```xml
<Dynamic Key="Results" Orientation="Vertical" Spacing="8" />
```

Key is required and authored children prohibited. Layout is Stack/Overlay/HorizontalPager/VerticalPager, an immutable compatible-reload contract.

## Dynamic fragment
```xml
<nxml-dynamic>
  <StackPanel Key="{data key}" Class="result-row" Spacing="6">
    <Text Content="Item: {data title}" Localize="false" />
    <TextInput Key="Draft" Label="Note" Placeholder="{data placeholder}"
               MaximumLength="120" />
    <Button Label="{data action}" Content="{data action}" Command="example.note.set" />
  </StackPanel>
</nxml-dynamic>
```

One visual root under attribute-free nxml-dynamic. Parameters become literals, never interpolated XML; missing/invalid parameters and metadata mutation reject.

```csharp
var template = new NxmlDynamicTemplate(templateText);
var fragment = template.Compile(new Dictionary<string, string> {
    ["key"] = "row-a", ["title"] = "A & <literal>",
    ["placeholder"] = "Write a note", ["action"] = "Save"
}, components, styles);
var owned = new NxmlDynamicContent(tree, state);
var row = owned.Append(resultsSlot, fragment);
```

resultsSlot is a live loaded slot. Special characters remain data.

## Compatible Reload

Recompile the same logical row and call Reload for changed captions/placeholders/compatible facts. Validation precedes mutation and retains entity/focus/draft/caret/selection/nested slots/motion contracts.

Key/recipe/shape/bindings/password/length/scroll/anchor/transition contracts cannot change arbitrarily. Changing row-a to row-b rejects and preserves the old tree. Host-authorized command reprojection is not theme command authority.

## All owned operations

| Method | Use/ownership |
| --- | --- |
| Append | New logical item/new entity |
| Reload | Compatible retained projection |
| Reorder | Complete unique same-owner permutation |
| Move | Same workspace, no cycles/anchored fragments |
| Replace | New incompatible content, retire prior after preparation |
| Remove | Retire one entire fragment |
| Clear | Retire the collection, not ordinary refresh |

Run mutations on the render thread, not a retained background entity reference.

## Sort and append

```csharp
owned.Reorder(resultsSlot, new[] { secondRow, firstRow });
```

Include every live slot member exactly once. Omitted/duplicate/foreign/dead entities reject. Append pages; Reload existing logical IDs; Remove vanished items. Clear/rebuild on each callback resets input/motion/anchors.

## Local keys and asynchronous results

Resolve repeated child keys within the owned instance/nearest scope. Find(first, Draft) must not locate another row's draft globally. Bind tasks to page/source/version and revalidate ownership before scheduling projection; a reused number/key is not the same lifetime.

## Evidence

The lab edits/selects a draft, reloads title/placeholder, checks reference/value/selection retention, reorders identities, and rejects an incompatible key while preserving the prior tree. Product tests additionally cover scrolling/virtualization/navigation/touch/stale tasks/nested ownership.


## Implementation references

- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlDynamicTemplate.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlDynamicTemplate.cs)
- [Nexa.Xsr.Renderer.Nxml.Runtime/NxmlDynamicContent.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Runtime/NxmlDynamicContent.cs)
- [Nexa.Xsr.Renderer.Nxml.Runtime/NxmlUiLoader.Reload.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Runtime/NxmlUiLoader.Reload.cs)
