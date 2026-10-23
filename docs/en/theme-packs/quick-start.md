# Build your first adjustable theme

Start with [goal-first development](../development/goal-first) and [XSR ownership](../development/xsr-architecture). Acceptance: heading color/size and button rounding are editable, committed values survive reopening, and malformed styles preserve the last valid theme. No new behavior or external reads are introduced.

## 1. Get the complete project

Use Git, Python 3, and an A12 launcher. Clone the launcher for its production packager and the docs for samples; keep them as sibling directories.

```sh
git clone --branch v2.0.0.alpha.12 --depth 1 https://github.com/Nexa-MC/NexaCL.git
git clone https://github.com/Nexa-MC/PCLN-Docs.git
```

```text
PCLN-Docs/examples/themes/twilight/
├── mimetype
├── theme.json
└── styles/main.nss
```

`mimetype` contains UTF-8 `application/x-nexa-theme`, optionally followed by one newline. Keep it and `theme.json` at the container root, not inside an extra enclosing folder.

## 2. Save the full manifest
```json
{
  "format": "NTP/1",
  "id": "example.twilight",
  "version": "1.0.0",
  "name": {
    "zh-CN": "暮色示例",
    "en-US": "Twilight example"
  },
  "styleApi": 1,
  "nss": "NSS/1",
  "styles": [
    "styles/main.nss"
  ],
  "requiredCapabilities": [
    "styles.basic",
    "tokens",
    "options",
    "selectors",
    "conditions"
  ],
  "optionalCapabilities": [],
  "optionsVersion": 1,
  "options": [
    {
      "id": "accent",
      "kind": "Color",
      "default": "#689fff",
      "label": {
        "zh-CN": "强调色",
        "en-US": "Accent"
      }
    },
    {
      "id": "title-size",
      "kind": "Range",
      "control": "Slider",
      "default": 26,
      "min": 20,
      "max": 32,
      "step": 1,
      "label": {
        "zh-CN": "标题字号",
        "en-US": "Title size"
      }
    },
    {
      "id": "rounded",
      "kind": "Boolean",
      "control": "Switch",
      "default": true,
      "label": {
        "zh-CN": "圆角按钮",
        "en-US": "Rounded buttons"
      }
    }
  ],
  "appearance": {
    "accentColor": "#315b92",
    "splashMotion": "fade",
    "resources": {}
  }
}
```

`styles` defines explicit source order; there is no directory scan. The three options persist a color string, number, and Boolean. `kind` is the value contract; `control` only selects a finite Host editor.

`appearance.accentColor` is a literal Host appearance field. The `accent` option styles selected elements through NSS below. Similar names do not automatically synchronize every color.

## 3. Save `styles/main.nss`
```css
@tokens { accent: option(accent); }
Text#TitleMain { Foreground: var(accent); FontSize: option(title-size); }
Button.capsule:hover { Border: var(accent); BorderWidth: 1; }
@when option(rounded) = true {
  Button.capsule { CornerRadius: 20; }
}
@when mode = dark {
  Button.capsule:hover { Border: #9fc5ff; }
}
```

`@tokens` declares values, `option(accent)` reads this manifest, `Text#TitleMain` matches the existing Host heading, and `:hover` observes Host interaction. The theme does not create that heading or execute button actions.

## 4. Package and import

From the parent containing both clones, place output outside the theme directory:

```sh
python NexaCL/eng/themes/pack.py PCLN-Docs/examples/themes/twilight --output twilight-1.0.0.ntp
```

Import the file in Settings → Appearance and themes, preview it, then choose it. Release the size slider at 30, edit the color, and toggle rounding. Complete values apply automatically; an incomplete color preserves the draft and last valid appearance.

Packaging does not replace runtime manifest/capability/source/NSS admission. Development-directory watching is explicit; changing a source folder does not rewrite an already imported ZIP.

## 5. Verify the outcome

| Action | Expected | First check |
| --- | --- | --- |
| Switch light/dark | Readable text and active dark rule | Conditions, later rules, target Key |
| Release size slider | Heading changes without losing the gesture | Bounds and step |
| Enter only `#` | Draft retained, valid appearance unchanged | Partial input is not a complete value |
| Reopen/restart | Committed values retained | Source identity/optionsVersion |
| Put `Command` in NSS | Candidate rejected, valid theme retained | Behavior is protected |

The optional [portable authoring lab](/en/nxml/complete-example) exercises real manifest admission and NSS compilation with .NET 10:

```sh
dotnet run --project PCLN-Docs/examples/authoring-lab/Authoring.Lab.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- /absolute/path/to/PCLN-Docs
```

Continue with the [manifest reference](./manifest-and-options) and [control workshop](./options-recipes).


## Implementation references

- [eng/themes/pack.py](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/eng/themes/pack.py)
- [Nexa.Services.Themes/ThemeManifestReader.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Services.Themes/ThemeManifestReader.cs)
- [docs/xsr/theme-live-options.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-live-options.md)
