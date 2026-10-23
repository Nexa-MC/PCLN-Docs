# Complete lab: state, retained lists, build

Acceptance: state-driven text, intent-only buttons, disabled admission, retained drafts/selection across reload/reorder, rejected invalid candidates preserving the tree. Theme and controlled patch exercises demonstrate cooperating XSR boundaries.

## Project and command

```text
examples/authoring-lab/
├── Authoring.Lab.csproj
├── Program.cs
├── HostApiRecipes.cs
├── HostFixtures.cs
└── Pages/
    ├── StatusCard.c.nxml
    ├── Workspace.nxml
    ├── Row.d.nxml
    └── Workspace.nss
```

It also shares sidecar/ContractRecipes.cs. Use A12 source:

```sh
dotnet run --project examples/authoring-lab/Authoring.Lab.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- /absolute/path/to/PCLN-Docs
```

## Explicit dependencies

Compiler/Runtime own markup/retention; Themes validates manifest/source; XSR Runtime serves explicit Host integration tests. This is not the dependency set for an independent peer, which still uses Protocol/Transport only.
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
    <IsAotCompatible>true</IsAotCompatible>
  </PropertyGroup>
  <Target Name="RequireNexaCLSource" BeforeTargets="PrepareForBuild" Condition="'$(NexaCLSourceRoot)' == ''">
    <Error Text="Pass -p:NexaCLSourceRoot=/absolute/path/to/NexaCL (Alpha 12 source)." />
  </Target>
  <ItemGroup>
    <ProjectReference Include="$(NexaCLSourceRoot)/Nexa.Xsr.Renderer.Nxml.Compiler/Nexa.Xsr.Renderer.Nxml.Compiler.csproj" />
    <ProjectReference Include="$(NexaCLSourceRoot)/Nexa.Xsr.Renderer.Nxml.Runtime/Nexa.Xsr.Renderer.Nxml.Runtime.csproj" />
    <ProjectReference Include="$(NexaCLSourceRoot)/Nexa.Services.Themes/Nexa.Services.Themes.csproj" />
    <ProjectReference Include="$(NexaCLSourceRoot)/Nexa.Xsr.Runtime/Nexa.Xsr.Runtime.csproj" />
    <Content Include="Pages/**/*" CopyToOutputDirectory="PreserveNewest" CopyToPublishDirectory="PreserveNewest" />
    <Compile Include="../sidecar/ContractRecipes.cs" Link="ContractRecipes.cs" />
  </ItemGroup>
</Project>
```

This is MSBuild XML, not NXML. Content/reference ownership is explicit, with no reflected assembly scanning.

## Complete markup

Workspace.nxml:
```xml
<nxml-page>
  <Page xmlns="https://nexa.dev/nxml/2026" Key="Workspace">
    <StackPanel Key="Body" Spacing="16" Padding="24">
      <Text Key="TitleMain" Content="NexaCL authoring lab" Localize="false" />
      <StatusCard Key="Summary">
        <Text Key="Status" Content="{state example.status}" Localize="false" />
        <Button Key="Refresh" Class="capsule" Label="Refresh" Content="Refresh"
                Command="example.refresh" Enabled="{state example.enabled}" />
      </StatusCard>
      <Dynamic Key="Results" Orientation="Vertical" Spacing="8" />
    </StackPanel>
  </Page>
</nxml-page>
```

StatusCard.c.nxml:
```xml
<nxml-component>
  <StackPanel Class="status-card" Spacing="12" Padding="16" />
</nxml-component>
```

Row.d.nxml:
```xml
<nxml-dynamic>
  <StackPanel Key="{data key}" Class="result-row" Spacing="6">
    <Text Content="Item: {data title}" Localize="false" />
    <TextInput Key="Draft" Label="Note" Placeholder="{data placeholder}"
               MaximumLength="120" />
    <Button Label="{data action}" Content="{data action}" Command="example.note.set" />
  </StackPanel>
</nxml-dynamic>
```

Use Workspace.nss from [layout](./layout-and-style). Base NSS uses #TitleMain; NSS/1 may use Text#TitleMain.

## Full composition program

The program creates state/tree/components, verifies intent, updates facts, retains dynamic input, then validates themes and controlled Host activation. It opens no native window, discovers no production packages, and bypasses no production signature policy.
```csharp
using System.Text.Json;
using Nexa.Services.Themes;
using Nexa.Xsr;
using Nexa.Xsr.Renderer;
using Nexa.Xsr.Renderer.Nxml;
using Nexa.Xsr.State;

string docsRoot = Path.GetFullPath(args.Length == 1 ? args[0] : Directory.GetCurrentDirectory());
string pages = Path.Combine(AppContext.BaseDirectory, "Pages");
var definitions = Directory.GetFiles(Path.Combine(AppContext.BaseDirectory, "Ui", "Components"), "*.c.nxml")
    .ToDictionary(path => Path.GetFileName(path)[..^7], File.ReadAllText, StringComparer.Ordinal);
definitions.Add("StatusCard", File.ReadAllText(Path.Combine(pages, "StatusCard.c.nxml")));
var components = new NxmlComponentLibrary(definitions);
var styles = NssStyleSheet.Parse(File.ReadAllText(Path.Combine(pages, "Workspace.nss")));
var tree = new XsrUiTree();
var bridge = new XsrUiStateBridge(tree);
var builder = new XsrStateStoreBuilder();
builder.Cell<string>(XsrSemanticId.Parse("example.status"), "Example");
builder.Cell<bool>(XsrSemanticId.Parse("example.enabled"), "Example");
var store = builder.Build(bridge);
store.Publish(store.Resolve(XsrSemanticId.Parse("example.status")), "Ready");
store.Publish(store.Resolve(XsrSemanticId.Parse("example.enabled")), true);
var ir = NxmlCompiler.Compile(NxmlParser.Parse(File.ReadAllText(Path.Combine(pages, "Workspace.nxml"))), components, styles);
var root = NxmlUiLoader.LoadDetached(ir, tree, store);
var intents = new XsrUiIntentBuffer();
var renderer = new XsrUiRenderer(tree, store, sink: intents, stateBridge: bridge) { Viewport = new(960, 640) };
renderer.SetRoot(root);
Check(renderer.Render().Nodes.Any(node => node.Text == "Ready"), "initial local state projection");
Check(renderer.Activate(Find(root, "Refresh")), "command input activation");
Check(intents.Drain() is [{ Command.Value: "example.refresh" }], "renderer emits semantic intent without executing business work");
store.Publish(store.Resolve(XsrSemanticId.Parse("example.enabled")), false);
renderer.Render();
Check(!renderer.Activate(Find(root, "Refresh")) && intents.Count == 0, "bound disabled state rejects activation");
store.Publish(store.Resolve(XsrSemanticId.Parse("example.enabled")), true);
store.Publish(store.Resolve(XsrSemanticId.Parse("example.status")), "Updated without IPC");
Check(renderer.Render().Nodes.Any(node => node.Text == "Updated without IPC"), "revision-driven state projection");

var template = new NxmlDynamicTemplate(File.ReadAllText(Path.Combine(pages, "Row.d.nxml")));
var owned = new NxmlDynamicContent(tree, store);
var slot = Find(root, "Results");
var first = owned.Append(slot, Row("row-a", "A & <literal>", "Write a note"));
var second = owned.Append(slot, Row("row-b", "B", "Another note"));
Check(renderer.Render().Nodes.Any(node => node.Text == "Item: A & <literal>"), "dynamic values remain literal rather than XML source");
var input = Find(first, "Draft");
renderer.SetTextInputValue(input, "unsubmitted draft");
renderer.SetTextSelection(input, 2, 5);
var draft = tree.GetComponent<XsrUiTextInput>(input)!;
owned.Reload(first, Row("row-a", "A updated", "New placeholder"));
Check(ReferenceEquals(draft, tree.GetComponent<XsrUiTextInput>(input))
    && draft.ReadDraft() == "unsubmitted draft" && draft.SelectionStart == 2 && draft.SelectionEnd == 5,
    "compatible reload retains input identity, draft and selection");
owned.Reorder(slot, new[] { second, first });
Check(tree.Children(slot).SequenceEqual(new[] { second, first }), "owned reorder preserves entities");
Throws<NxmlLoadException>(() => owned.Reload(first, Row("different-key", "Bad", "Bad")), "identity-changing reload is rejected");
Check(tree.IsAlive(first) && draft.ReadDraft() == "unsubmitted draft", "failed reload preserves prior tree");
Check(owned.Remove(second) && !tree.IsAlive(second), "owned removal retires an entire fragment");
Throws<NxmlParseException>(() => NxmlParser.Parse("<Text>mixed text</Text>"), "mixed XML text rejected");
Throws<NxmlCompileException>(() => NxmlCompiler.Compile(NxmlParser.Parse("<Text Unknown=\"true\"/>"), components), "unknown property rejected");
Throws<NxmlCompileException>(() => NssThemeCompiler.Compile("@when mode = dark { Button { Command: example.unsafe; } }"), "protected NSS declaration rejected even in inactive branch");

foreach (string theme in Directory.GetDirectories(Path.Combine(docsRoot, "examples", "themes")).Order())
{
    using var json = JsonDocument.Parse(File.ReadAllText(Path.Combine(theme, "theme.json")));
    string[] capabilities = json.RootElement.GetProperty("requiredCapabilities").EnumerateArray().Select(item => item.GetString()!).ToArray();
    string data = Path.Combine(Path.GetTempPath(), "nexa-docs-theme-" + Guid.NewGuid().ToString("N"));
    try
    {
        using var service = new ThemePackageService(data, null, capabilities);
        var admission = await service.PrepareAsync(new(theme, ThemeSourceKind.Directory));
        Check(admission.IsSuccess, "manifest/source admission: " + Path.GetFileName(theme) + " " + admission.Error?.Message);
        var candidate = admission.Value!;
        var options = candidate.Options.ToDictionary(pair => pair.Key, pair => Literal(pair.Value), StringComparer.Ordinal);
        foreach (string mode in new[] { "light", "dark" })
        {
            var program = NssThemeCompiler.Compile(candidate.Styles.Select(style => style.Text).ToArray(),
                new() { Options = options, Platform = "linux", Mode = mode, Capabilities = capabilities.ToHashSet(StringComparer.Ordinal) });
            renderer.ApplyTheme(program, renderer.ThemeActivationGeneration + 1, new("linux", mode == "dark"));
            renderer.Render();
        }
        Console.WriteLine("PASS: admitted theme and compiled NSS in light/dark: " + Path.GetFileName(theme));
    }
    finally { if (Directory.Exists(data)) Directory.Delete(data, true); }
}
await HostFixtures.RunAsync();
DocumentationChecks.Run(docsRoot, components);
Console.WriteLine("PASS: NXML components, state projection, literal data, retained reload/reorder/removal and negative grammar cases.");
Console.WriteLine("This portable scene exercise does not open a native window or prove platform material/media decoding.");

NxmlHostIr Row(string key, string title, string placeholder) => template.Compile(new Dictionary<string, string>
    { ["key"] = key, ["title"] = title, ["placeholder"] = placeholder, ["action"] = "Save" }, components, styles);
XsrUiEntityId Find(XsrUiEntityId ancestor, string key)
{
    XsrUiEntityId found = default;
    tree.Walk(ancestor, entity => { if (tree.Name(entity) == key) found = entity; return true; });
    if (!found.IsAssigned) throw new InvalidOperationException("Missing entity: " + key);
    return found;
}
static string Literal(ThemeOptionValue value) => value.Kind switch
{
    ThemeOptionKind.Boolean or ThemeOptionKind.Number or ThemeOptionKind.Range or ThemeOptionKind.Color => value.Value,
    ThemeOptionKind.Files => "[]", // Empty sample defaults; no external grants are created by this lab.
    _ => JsonSerializer.Serialize(value.Value, JsonContext.Default.String)
};
static void Check(bool condition, string reason) { if (!condition) throw new InvalidOperationException(reason); }
static void Throws<T>(Action action, string reason) where T : Exception
{
    try { action(); }
    catch (T) { Console.WriteLine("PASS: " + reason); return; }
    throw new InvalidOperationException("Expected " + typeof(T).Name + ": " + reason);
}

[System.Text.Json.Serialization.JsonSerializable(typeof(string))]
internal partial class JsonContext : System.Text.Json.Serialization.JsonSerializerContext;
```

The project also checks documentation markup; source for that checker and both Host helper files is included alongside the program.

## What each result demonstrates

| Check | Design |
| --- | --- |
| Local text update | State projection without query/IPC |
| Activation intent | Renderer does not execute business |
| Disabled rejection | Availability is authoritative |
| Literal markup characters | No XML interpolation |
| Retained reload | Stable entity/draft/selection |
| Reorder | Position is not identity |
| Rejected key/grammar | Validate before changing current tree |
| Real theme admission/modes | More than syntactic JSON validation |
| Patch activation/retirement | Registration is not execution |

## NativeAOT execution

```sh
dotnet publish examples/authoring-lab/Authoring.Lab.csproj -c Release -r linux-x64 -p:PublishAot=true -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -o out/lab
out/lab/Authoring.Lab /absolute/path/to/PCLN-Docs
```

Use native tools/RIDs on other OSes. Success proves these paths, not all native windows/IME/accessibility/material/media across platforms.

## Extend by outcome

Change the goal and owned state/command first, then one template/action. Keep long work in business/composition and tree mutations on the render thread. For third-party distribution return to [capability selection](../development/), rather than treating this Host lab as an injectable page package.


## Implementation references

- [docs/xsr/nxml-renderer.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nxml-renderer.md)
- [Nexa.Xsr.Renderer.Nxml.Runtime/NxmlDynamicContent.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Runtime/NxmlDynamicContent.cs)
