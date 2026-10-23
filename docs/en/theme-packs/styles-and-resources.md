# Styles, resources and platform adaptation

NSS/1 includes typed tokens/options, bounded selectors and conditions:

```css
@when option(rounded) = true {
  Button.capsule { CornerRadius: 20; }
}
@when mode = dark {
  Button.capsule:hover { Border: #9fc5ff; }
}
```

The [shipped advanced example](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Desktop/Themes/Advanced/styles/main.nss) also demonstrates platform conditions, viewport rules, grids, transforms and finite keyframes. Declare the capabilities actually used. A property accepted by the compiler does not certify native support on every OS.

Themes cannot rewrite commands, enabled/visible/selected/password state, overlay ownership or dismissal. Virtual-list viewport geometry, row identity, scroll anchors and budgets remain host-owned; dedicated item metrics are not interchangeable with container Height.

`asset("fonts/DejaVuSans.ttf")` resolves inside the admitted package. `file()` and `folder()` require explicit host-picker grants bound to the source, resource kind and canonical path. Renaming/reimporting a theme or importing options does not transfer another source's grants.

Bundle actual resources rather than depending on files installed on your development machine. Fonts, images and media have separate native decoding and size limits. Test light/dark modes, narrow windows and reduced motion. Use declared optional-capability fallbacks; text must remain readable without translucent material.

Failed activation retains the last valid theme. Retired generations cannot reattach stale resources. [Resource contract](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-resource-security.md).
