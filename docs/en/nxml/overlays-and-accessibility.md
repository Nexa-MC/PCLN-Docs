# Overlays, anchors, dismissal, accessibility

An overlay needs one coherent drawing/input/keyboard/accessibility/lifetime contract. Paint alone does not create modality; themes cannot redefine ownership.

## Modal layer versus Dialog role

```xml
<Page Key="DialogExample">
  <Button Key="OpenDialog" Label="Open dialog" Command="example.dialog.open" />
  <Node Kind="ModalScrim" Recipe="Element" Role="None" AcceptsChildren="true"
        Key="Scrim" ModalLayer="true" OverlayMotion="DialogScrim"
        IsVisible="{state example.dialogOpen}" Background="#00000080"
        DismissCommand="example.dialog.close">
    <Dialog Key="Confirm" Label="Confirm action" OverlayMotion="Dialog"
            HorizontalAlignment="Center" VerticalAlignment="Center" MaxWidth="520" Padding="24">
      <Text Content="Continue this operation?" />
      <Button Label="Cancel" Content="Cancel" Command="example.dialog.close" />
    </Dialog>
  </Node>
</Page>
```

Declare the Boolean state and command handlers first. ModalLayer requires Element or Overlay Dynamic, not the Dialog StackLayout itself. It suppresses earlier siblings from input/accessibility while the covering root intercepts pointers. Composition owns open/close truth.

## Dismissal and motion

DismissCommand is a semantic intent, not a script. Escape targets must remain alive/visible/unobscured. Destroyed nodes from an old scene cannot receive input. Close through the owner's lifecycle and cancel related work.

OverlayMotion is None/Notification/DialogScrim/Dialog. TransitionKey/OffsetX/Y and optional TransitionMovesSelf express existing finite motion; MovesSelf requires a key. Reduced motion wins. Outgoing pixels do not retain revoked interaction authority.

## Anchored overlay

```xml
<Page Key="AnchoredExample">
  <Button Key="OpenDetails" Label="Details" Command="example.details.open" />
  <Node Kind="DetailsOverlay" Recipe="Element" Role="None" AcceptsChildren="true"
        Key="Details" Anchor="OpenDetails" AnchorGap="4" Width="240">
    <Text Content="Additional details" />
  </Node>
</Page>
```

Resolve a unique key in the nearest scope, never self/descendant. Gap is nonnegative and requires Anchor. Relayout keeps the relationship. Anchor is immutable during compatible reload; anchored fragments cannot Move between slots.

## Notification/live region

```xml
<Notification Key="Notice" Label="Task status" OverlayMotion="Notification"
              LiveSetting="Polite" DismissCommand="example.notice.dismiss">
  <Text Content="Task completed" />
</Notification>
```

Status is normally nonmodal. LiveSetting Off/Polite/Assertive maps through native accessibility. Do not announce per-frame progress assertively; completion events and current State are separate.

## Semantic quality and evidence

Provide meaningful labels for icon buttons/inputs; placeholder is not the accessible name. Project toggle truth rather than local business guesses. Preserve meaningful text when visually trimming, and update labels with captions. Mark user/already-localized data literal.

Test Tab/Shift-Tab/Enter/Space/Escape, mouse/touch, hidden ancestors, navigation, interrupted motion, layered overlays, and destroyed nodes. Native screen-reader evidence requires each OS; portable roles/labels alone do not prove platform automation.


## Implementation references

- [docs/xsr/nxml-renderer.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nxml-renderer.md)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs)
- [Nexa.Xsr.Renderer/XsrUiComponents.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer/XsrUiComponents.cs)
