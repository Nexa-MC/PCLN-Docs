# Create your first UI

Compile a small PXML page and inspect the resulting blueprint. The compiler produces a PXB file; a compatible runtime is still needed to display it.

**Version scope:** historical PXML 1.0 and its matching runtime. For current plugins, use [ABI 100](/en/plugin-sdk/).

## 1. Write the page

Create `Hello.pxml`:

```xml
<?pxml version="1.0" strict="true"?>
<Page xmlns="pcl://ui" xmlns:x="urn:pcl:pxml:x">
  <Column Padding="16" Gap="8">
    <Text Text="Hello, PXML!" />
    <Button Text="Continue" Command="{cmd Navigation.Continue}" />
  </Column>
</Page>
```

`Page` is the page root, `Column` arranges children vertically, `Text` displays content, and `Button` delegates activation to the `Navigation.Continue` command. PXML does not execute arbitrary code from a UI file.

## 2. Validate the source

```bash
pxmlc check Hello.pxml --strict
```

A successful check exits with code `0`. Syntax, type, and structural diagnostics include their source path, line, and column.

## 3. Build the PXB

```bash
pxmlc --full Hello.pxml -o Hello.pxb --release --strict
```

`--full` performs expansion, optimization, and compilation in one process without writing intermediate PXML or PXIR. `--release` omits the debug source map.

## 4. Inspect the artifact

```bash
pxmlc inspect Hello.pxb
pxmlc dump Hello.pxb
```

`inspect` reports the PXB header and sections; `dump` emits a readable structure for checking nodes and properties. PCL.UI.Next Runtime loads the generated `Hello.pxb`; the compiler itself does not create a test window.

Continue with the [CLI reference](/en/pxml-compiler/CLI) and [pipeline and PXB guide](/en/pxml-compiler/Pipeline-and-PXB).

## Check your result

Check the source, build the binary and inspect its sections; do not interpret successful compilation as a displayed window.
