# Complete NXML component/property reference

This inventory follows A12 external components/compiler. Names are not CLR types. Required fields come from definitions, and property support depends on recipe.

## Every built-in component
| Component | Recipe | Role | Children | Required |
| --- | --- | --- | --- | --- |
| Button | CommandInput | Button | true | — |
| CheckBox | CommandInput | CheckBox | false | — |
| ContentHost | Element | Content | true | — |
| Dialog | StackLayout | Dialog | true | — |
| Dynamic | DynamicSlot | None | false | Key |
| HorizontalPager | HorizontalPager | Content | true | — |
| Image | Image | Image | false | Source |
| Navigation | StackLayout | Navigation | true | — |
| NavigationItem | CommandInput | NavigationItem | false | Label,Command |
| Notification | StackLayout | Status | true | — |
| Page | Element | Page | true | — |
| Progress | Progress | ProgressBar | false | — |
| ProgressRing | Progress | ProgressBar | false | — |
| Shell | StackLayout | Page | true | — |
| Slider | RangeInput | Slider | false | — |
| StackPanel | StackLayout | None | true | — |
| Text | Text | Text | false | — |
| TextInput | TextInput | TextInput | false | Label |
| TitleBar | StackLayout | TitleBar | true | — |
| VerticalPager | VerticalPager | Content | true | — |

Author-defined StatusCard/Switch must be explicitly registered. Leaf recipes reject children; Dynamic must be empty.

## Identity/metadata

| Property | Contract |
| --- | --- |
| Key | 1–128, no whitespace/controls, unique after expansion |
| Class | ≤64 identifiers, ≤128 each, alphanumeric/underscore/hyphen |
| Kind | Original style identity, primitive definition only |
| Recipe | Element1/StackLayout2/Text3/CommandInput4/Image5/VerticalPager6/TextInput7/Progress8/HorizontalPager9/DynamicSlot10/RangeInput11 |
| Role | None/Text/Button/Page/List/ListItem/Image/ProgressBar/Dialog/TitleBar/Navigation/NavigationItem/Content/TextInput/Status/Switch/CheckBox/RadioGroup/RadioButton/Slider |
| AcceptsChildren/Required | Primitive metadata only |

References cannot override metadata. Host IR numbers are not plugin ABI.

## Layout/content

| Properties | Contract |
| --- | --- |
| Dimensions/min/max/Weight | Finite doubles |
| Alignments | Stretch/Start/Center/End |
| Margin/Padding | One or four comma values, L/T/R/B |
| Orientation/Spacing/StretchLastChild | Stack/Dynamic |
| Layout | Dynamic only: Stack/Overlay/HorizontalPager/VerticalPager |
| Content | Text/CommandInput, string State/data format |
| Label | Semantic text, string State/data format |
| Source/Icon | Image/CommandInput source, not IO authority |
| Localize | Boolean literal policy |
| MaxLines/TrimOverflow | Text/CommandInput, 0–4096/Boolean |

## Input/state/motion

| Properties | Contract |
| --- | --- |
| IsVisible | Bool literal/State |
| Enabled/Clickable | Bool literal/State on supported recipes |
| Focusable | Literal Boolean |
| Command | Semantic literal/data, no method/script |
| Selected | CommandInput literal/data |
| Checked | CheckBox/Switch CommandInput literal/data |
| SelectionRequired | Stack selection policy |
| SegmentThumb | Same-document unique transition thumb |
| SegmentWidth | Positive command-control width |
| Placeholder | Input literal/data, no State |
| IsPassword/MaximumLength/PreserveTabs | Fixed input contract; length1–32768/default2048 |
| Minimum/Maximum/Step/RangeValue | RangeInput finite ordered bounds/positive step/in-range value |
| Value | Progress double literal/State |
| Ring/Indeterminate | Progress; indeterminate requires ring |
| TransitionKey/OffsetX/Y/MovesSelf | Key string/State, finite offsets, fixed Boolean requiring key |

## Scroll/overlay

| Properties | Contract |
| --- | --- |
| Scroll | Stack/Dynamic; horizontal capsule only with authored HoverExpand |
| Vertical indicator/StickToEnd/ScrollGesture | Scroll on Stack/Dynamic Stack, not capsule |
| Horizontal indicator/wheel routing | Admitted Scroll including capsule |
| StableContent | Finite annotation, not logical identity |
| ModalLayer | Element/Overlay Dynamic |
| OverlayMotion | None/Notification/DialogScrim/Dialog |
| LiveSetting | Off/Polite/Assertive |
| DismissCommand | Semantic intent |
| Anchor/AnchorGap | Local scoped key/nonnegative gap, no self/descendant |

## Base visual fields

Background/Foreground/Border/Hover colors; Opacity0–1; finite radius/border/blur/font size/weight; TextAlignment Start/Center/End; WrapText/HoverExpand/NavigationLayout Boolean; Surface None/Solid/Translucent/Glass.

Theme-only GridColumns/Transform/FontFamily etc. are not automatically NXML attributes. See [NSS/1](../theme-packs/layout-and-motion).

## Budgets

| Input | Limit |
| --- | --- |
| NXML text/read file | 1 Mi characters/4 MiB bytes |
| XML nodes/elements | 65536/16384 |
| Depth/attributes | <128/128 per element |
| Component library | 256/8 Mi characters |
| Expanded nodes/depth | 16384/<128 |
| Dynamic data | 256 parameters/1 Mi characters, separate1 Mi expansion |
| Mixed placeholders | 256 per format |
| Base NSS | 1 Mi characters/4096 rules/128 declarations per block |

Reject rather than truncate. Sidecar UI's64 nodes/32KiB is separate, not expandable by this table.

## Failure types

ParseException covers XML/namespace/DTD/text/binding grammar; CompileException covers components/types/structure/styles; LoadException covers state resolution/ownership/reload/runtime-tree contracts. Fix the owning phase; do not mask failure as an empty successful page or swallow unrelated Host exceptions.


## Implementation references

- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlNodeSchema.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlNodeSchema.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlParser.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlParser.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlComponentLibrary.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlComponentLibrary.cs)
