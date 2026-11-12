# Motion, interaction, and accessibility

Describe interaction and motion using the runtime’s finite data contract. Include keyboard and reduced-motion behavior when designing the visual transition.

**Version scope:** historical PXML 1.0 and its matching runtime. For current plugins, use [ABI 100](/en/plugin-sdk/).

Motion and interaction state lower to Runtime component data, not arbitrary callback objects.

## Transitions and FLIP

```xml
<Node
  Opacity="{bind IsVisible ? 1 : 0}"
  Transition.Opacity="{motion Standard}" />

<Card x:AnimateLayout="true" x:LayoutMotion="{motion Standard}" />
```

The compiler validates property, solver, continuity, and token compatibility. Incompatible policies are errors. Reduced Motion still publishes reliable lifecycle completion. Layout animation computes tree-aware local FLIP deltas so nested animated entities do not double-apply ancestor compensation; LayoutRect remains final static geometry.

## Behavior and focus

```xml
<Node Behaviors="Hover Press Focus Click" />
<Column Focus.Scope="true" Focus.Trap="true" Focus.Restore="true">
  <Button Text="Confirm" />
</Column>
```

Behaviors become component sets. Effective Enabled/Visible state propagates through ancestors, and a focused entity that becomes disabled or loses Focusable is invalidated. Focus, Tab traversal, pointer capture, and gestures are isolated per Window/InputRoot.

## Accessibility

```xml
<Button
  Text="Install"
  AccessibleRole="Button"
  AccessibleName="{loc Download.Install}"
  AccessibleDescription="{loc Download.InstallDescription}"
  AccessibleActions="Invoke Focus"
  Command="{cmd Download.Install}" />
```

Semantic Tree is independent of Render Tree. A modal removes out-of-scope semantics and rejects their Invoke/Focus requests through the shared interaction policy.

Check that visual transforms and hit testing agree, icon buttons have localized names, Disabled blocks every activation path, focus order matches reading order, and Reduced Motion completes navigation/overlay lifecycles.

Next: [Overlays, navigation, and NativeHost](./Overlays-Navigation-and-NativeHost).

## Check your result

Test focus navigation, reduced motion and interruption of an active transition.
