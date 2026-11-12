# Layout and sizing

Choose layout constraints that remain valid for long text, changing content and smaller windows. Measurement is owned by the matching runtime, not by the compiler.

**Version scope:** historical PXML 1.0 and its matching runtime. For current plugins, use [ABI 100](/en/plugin-sdk/).

PCL.UI.Next Runtime computes PXML layout incrementally; it does not delegate its core Measure/Arrange contract to Avalonia.

## Row and Column

```xml
<Column Padding="20" Gap="12">
  <Text Text="Downloads" />
  <Row Gap="8" Align="Center">
    <Text Text="Current version" />
    <Button Text="Refresh" Command="{cmd Versions.Refresh}" />
  </Row>
</Column>
```

Column arranges along the vertical axis; Row uses the horizontal axis. `Gap` appears only between adjacent children, `Padding` is inside the container, and `Margin` is outside a node.

## Constraints

| Syntax | Meaning |
|---|---|
| `Width="120"` | fixed logical pixels |
| `Width="50%"` | half the parent available width |
| `Width="auto"` | content measured under the parent constraint |
| `Width="1*"` | weighted remaining track space |
| `MinWidth` / `MaxWidth` | lower/upper measure bounds |

Percentage and star values resolve only after the parent provides an available constraint. Wrapped text therefore uses its actual allocated content width and remeasures when the viewport changes.

## Choosing a container

- Row/Column: one-dimensional content.
- Grid: two-dimensional fixed/auto/percentage/star tracks. Constrained star tracks redistribute space iteratively.
- Overlay: children share one layout region; it does not create a modal interaction barrier by itself.
- Absolute: local canvases and anchored decoration, not ordinary responsive pages.
- Scroll: small scrollable content.
- VirtualList: large dynamic collections; never precreate thousands of children in Scroll.

Grid track declarations are validated by the target UI profile's component schema. Do not treat an unregistered ad-hoc track string as portable syntax.

## Text wrapping

```xml
<Column Width="50%" Padding="12">
  <Text Text="{bind Article.Summary}" />
</Column>
```

Layout Measure passes the actual available content width to text shaping. Viewport shrink changes line count, desired height, and LayoutRect in the same layout convergence—never estimate height from character count.

Next: [Bindings, commands, and events](./Binding-and-Commands).

## Check your result

Test minimum width, expanded text and overflow in the compatible runtime.
