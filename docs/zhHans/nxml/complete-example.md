# 综合实验：状态、保留列表与完整构建

验收目标：状态更新后文本变化；按钮只发语义意图；不可用时禁止激活；同一列表条目的输入草稿与选择区在更新/重排后保留；错误候选被拒绝，旧树仍有效。实验同时验证主题与受控函数扩展，展示 XSR 的边界如何协作。

## 完整项目与运行

```text
examples/authoring-lab/
├── Authoring.Lab.csproj
├── Program.cs
├── HostApiRecipes.cs       所有14个Host路由的编译示例，不自动操作真实包
├── HostFixtures.cs         测试回环上的显式函数目标授权
└── Pages/
    ├── StatusCard.c.nxml
    ├── Workspace.nxml
    ├── Row.d.nxml
    └── Workspace.nss
```

另外共享 examples/sidecar/ContractRecipes.cs。源码基线为 A12，文档目录可以位于其他路径。

```sh
dotnet run --project examples/authoring-lab/Authoring.Lab.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- /absolute/path/to/PCLN-Docs
```

## 工程引用为什么这样划分

Compiler/Runtime 提供标记和保留加载，Themes 服务仅验证主题来源/清单，XSR Runtime 仅为明确的 Host API/扩展实验。它不是 Sidecar 作者需要复制的依赖集合；独立 peer 继续只用 Protocol/Transport。
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

工程文件是 MSBuild XML，不是 NXML 页面。复制源码/构建资源由工程显式声明，使用 NativeAOT 时不通过反射扫描程序集。

## 页面、组件和动态片段

Workspace.nxml：
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

StatusCard.c.nxml：
```xml
<nxml-component>
  <StackPanel Class="status-card" Spacing="12" Padding="16" />
</nxml-component>
```

Row.d.nxml：
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

Workspace.nss 为[布局章](./layout-and-style)中的完整基础样式。注意这里用 #TitleMain，而主题 NSS/1 可使用 Text#TitleMain；两者不可混用。

## 组合程序怎样完成目标

Program.cs 的完整工作流程如下。它在一个受控顺序中创建树/状态/组件，检查输入意图，更新事实，追加并相容重载片段，最后执行主题准入和受控 HostFixture。没有原生窗口，没有生产包发现，没有跳过生产签名。
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

实验还运行文档标记检查；该检查器的源码与 HostApiRecipes/HostFixtures 均在同一目录，可直接阅读，不需要私有 SDK。

## 逐条理解结果

| 断言 | 它保护的设计 |
| --- | --- |
| Ready→Updated without IPC | State 驱动本地投影，渲染不查询远程 |
| Activate→example.refresh | 输入发意图，Renderer 不执行业务 |
| enabled=false 无派发 | 真实可用性来自 State |
| 字面量包含 & 和标签 | data 不拼 XML，用户文字不变成标记 |
| 相容 Reload 保留对象/草稿/选择 | 原条目稳定身份，无重复入场 |
| Reorder 保留实体 | 次序变化不等于新逻辑条目 |
| 错 Key/坏语法被拒绝 | 先校验候选，不破坏已有树 |
| 主题准入与两模式编译 | 真实解析而非仅检查 JSON 能打开 |
| NFP 激活/停用还原 | 注册不是执行，权限随寿命退役 |

## NativeAOT 后再运行

```sh
dotnet publish examples/authoring-lab/Authoring.Lab.csproj -c Release -r linux-x64 -p:PublishAot=true -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -o out/lab
out/lab/Authoring.Lab /absolute/path/to/PCLN-Docs
```

其他平台使用对应工具链/RID。成功输出说明这些执行路径在该构建通过，不代表原生窗口、输入法、读屏、材质和媒体输出已在所有 OS 验收。

## 将实验改成自己的功能

先替换验收目标与明确拥有的状态/命令，再改模板和一个动作。保持长任务在业务/组合层、树操作在渲染线程。若目标是第三方发布，返回[能力选择](../development/)使用 NTP 或有限 Sidecar 模块，不将这份 Host 实验当作页面注入包。


## 实现依据

- [docs/xsr/nxml-renderer.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nxml-renderer.md)
- [Nexa.Xsr.Renderer.Nxml.Runtime/NxmlDynamicContent.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Runtime/NxmlDynamicContent.cs)
