@tokens { accent: option(accent); }
Text#TitleMain { Foreground: var(accent); FontSize: option(title-size); }
Button.capsule:hover { Border: var(accent); BorderWidth: 1; }
@when option(rounded) = true {
  Button.capsule { CornerRadius: 20; }
}
@when mode = dark {
  Button.capsule:hover { Border: #9fc5ff; }
}
