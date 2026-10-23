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
