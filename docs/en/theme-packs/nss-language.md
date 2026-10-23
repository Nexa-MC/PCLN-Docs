# NSS/1: from rules to computed presentation

NSS/1 is finite, typed, and script-free, not full browser CSS. These files are listed in `theme.json.styles` and compiled by `NssThemeCompiler`. The smaller Host `NssStyleSheet` dialect is explained in [NXML styling](../nxml/layout-and-style).

## Minimal program

```css
/* Tokens are document scoped. */
@tokens { accent: #68a5ff; inset: 12; }
Text#TitleMain { Foreground: var(accent); FontSize: 26; }
Button.capsule:hover { Border: var(accent); BorderWidth: 1; }
```

Declarations are `Property: value;`; comments use `/* ... */`. Style colors accept `#RRGGBB`, `#RRGGBBAA` (alpha last), and `transparent`. Numbers must be finite; ordinary numeric dimensions admit the supported px form, not arbitrary percentages, calc, arithmetic programs, or imports.

## Selector reference

| Form | Meaning | Example |
| --- | --- | --- |
| Type | Authored component Kind | `Text`, `Button` |
| Class | One authored Class | `.capsule` |
| Key | Authored entity key | `#TitleMain` |
| Compound | Same target satisfies all parts | `Button.capsule`, `Text#TitleMain` |
| Attribute | Finite identity fields | `[key="dotted.key"][role=Button]` |
| Descendant | Any descendant | `StackPanel Button` |
| Direct child | Immediate child only | `StackPanel#VersionActions > Button` |
| List | Apply declarations separately | `Text#TitleMain, Button.capsule` |
| Pseudo-class | Host interaction on target | hover, pressed, focus, focus-visible, selected, disabled, checked |

At most eight selector parts. Pseudo-classes observe state, not assign it. Use a quoted key attribute for dotted keys. There are no arbitrary reflective attributes, scripts, pseudo-elements, or callbacks.

## Cascade and source order

Specificity precedes later-rule order; `styles` defines file order. Authored Kind/Key/Class/Role survive computed styles.

```css
Button { BorderWidth: 1; }
Button.capsule { BorderWidth: 2; }
Button.capsule { BorderWidth: 3; }
```

Capsule buttons receive 3. The style-only channel never authorizes overriding protected semantics or Host-owned geometry merely by increasing specificity.

## Tokens versus options

```css
@tokens {
  accent: option(accent);
  outline: var(accent);
}
Text#TitleMain { Foreground: var(--outline); FontSize: option(title-size); }
```

Tokens are top-level and unique across ordered sources; duplicates do not override. The single-statement form is `@token accent: #68a5ff;`. Tokens are declaration values; options are validated manifest inputs. `var(name)` and `var(--name)` resolve identically. There is no `var(name, fallback)` form. Unknown IDs, cycles, and incompatible types reject compilation. Neither mechanism is a State binding or executable program.

Host canonicalizes Text/Select as quoted literals, Boolean/Number/Range/Color as typed literals, and selected file kinds as admitted resource expressions. A text value cannot introduce arbitrary calls.

## Conditions and responsiveness

```css
@when mode = dark {
  Text#TitleMain { Foreground: #edf3fa; }
}
@when platform = linux and option(rounded) = true {
  Button.capsule:focus-visible { BorderWidth: 2; }
}
@supports grid {
  @viewport width >= 700 and width <= 1400 {
    StackPanel#LaunchHomeWorkspace { GridColumns: 1fr 1fr; }
  }
}
```

Modes are light/dark; platforms windows/linux/macos. Finite parentheses, and/or/not, option comparisons, capability checks, and viewport comparisons are supported. Viewport is provided by the Host. Parser acceptance does not prove native material support.

All declarations, tokens, and frames are validated, including inactive branches and unmatched selectors. A false condition cannot hide a protected Command assignment.

## Resource expressions

```css
Text#TitleMain { FontFamily: asset("fonts/Author.ttf"); }
StackPanel#CardAccount {
  BackgroundImage: asset("assets/pattern.svg");
  BackgroundImageFit: tile;
  BackgroundImageOpacity: 0.15;
}
```

Include real files and declare fonts/images/svg capabilities. The compiler collects references; Host prepares resources before commit. Inactive branches do not authorize later unprepared reads. See [resource authority](./styles-and-resources).

## Budgets and troubleshooting

Limits: 1 MiB/64 sources, 4096 rules, 512 tokens, 128 keyframe groups, 128 declarations per rule, 32768 expanded declarations, condition depth 16, token-resolution depth 32, value length 4096.

Check syntax, IDs, typed bounds, resource admission, then selector identity/cascade. A compiled rule with no visible effect usually needs matching/precedence inspection, not additional authority.


## Implementation references

- [docs/xsr/nss-v1.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nss-v1.md)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeCompiler.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeCompiler.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeSelectors.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeSelectors.cs)
