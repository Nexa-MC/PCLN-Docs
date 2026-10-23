# Your first theme

Install Python 3. Check out NexaCL at `v2.0.0.alpha.12` and this documentation repository. The complete sample is `examples/themes/twilight`:

```text
twilight/
├── mimetype
├── theme.json
└── styles/main.nss
```

The literal mimetype is `application/x-nexa-theme`. The manifest lists every stylesheet in load order; the host does not discover arbitrary NSS files automatically.

```css
@tokens { accent: option(accent); }
Text#TitleMain { Foreground: var(accent); FontSize: option(title-size); }
Button.capsule:hover { Border: var(accent); BorderWidth: 1; }
```

TitleMain is a current host element key, not permission to create an element. Recheck selectors when updating to another host version.

From the NexaCL source directory, place the output outside the theme source:

```sh
python eng/themes/pack.py ../PCLN-Docs/examples/themes/twilight --output ../twilight-1.0.0.ntp
```

Open Settings → Appearance and themes, import the `.ntp`, preview it and select it for use. Change the accent, drag the title-size slider and toggle rounded buttons. Package creation does not replace runtime manifest, capability, resource and NSS admission. Development-directory watching is an explicit operation; editing a source file does not update an already installed archive.
