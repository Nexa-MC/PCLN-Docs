@tokens { accent: option(accent); }
Text#TitleMain { Foreground: var(accent); FontSize: option(title-size); FontFamily: option(font-family); }
Button.capsule { Border: var(accent); BorderWidth: 1; }
@when option(rounded) = true { Button.capsule { CornerRadius: 18; } }
@when option(density) = "compact" { Button.capsule { Padding: 10 6; } }
@when mode = dark { Text#TitleMain { Foreground: #d6e7ff; } }
