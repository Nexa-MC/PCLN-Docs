using System.Text.Json;
using System.Text.RegularExpressions;
using Nexa.Xsr.Renderer.Nxml;

// Compiles complete examples and explicitly supplied fragment context. It never opens
// a resource referenced by an illustrative NSS snippet or invents a native capability.
internal static partial class DocumentationChecks
{
    internal static void Run(string docsRoot, NxmlComponentLibrary components)
    {
        var options = new Dictionary<string, string>(StringComparer.Ordinal);
        using var manifest = JsonDocument.Parse(File.ReadAllText(Path.Combine(docsRoot, "examples/themes/workshop/theme.json")));
        foreach (var option in manifest.RootElement.GetProperty("options").EnumerateArray())
        {
            string kind = option.GetProperty("kind").GetString()!;
            var value = option.GetProperty("default");
            options.Add(option.GetProperty("id").GetString()!, kind is "Boolean" or "Number" or "Range"
                ? value.GetRawText() : kind == "Color" ? value.GetString()! : value.GetRawText());
        }
        var inputs = new NssThemeCompileInputs { Options = options, Platform = "linux", Mode = "light",
            Capabilities = new HashSet<string>(new[] { "grid", "styles.basic", "tokens", "options", "selectors", "conditions", "viewport", "images", "fonts", "svg", "keyframes" }, StringComparer.Ordinal) };
        int xml = 0, css = 0, json = 0;
        foreach (string locale in new[] { "zhHans", "en" })
        foreach (string area in new[] { "development", "theme-packs", "sidecar", "nxml" })
        foreach (string file in Directory.EnumerateFiles(Path.Combine(docsRoot, "docs", locale, area), "*.md"))
        foreach (Match block in Blocks().Matches(File.ReadAllText(file)))
        {
            string language = block.Groups[1].Value, source = block.Groups[2].Value;
            try
            {
                if (language == "json") { using var parsed = JsonDocument.Parse(source); json++; }
                else if (language == "xml")
                {
                    if (source.TrimStart().StartsWith("<Project", StringComparison.Ordinal)) continue; // MSBuild is compiled separately.
                    var document = NxmlParser.Parse(source);
                    if (document.Root.Name == "nxml-dynamic")
                    {
                        var data = new Dictionary<string, string>(StringComparer.Ordinal);
                        foreach (Match parameter in Parameters().Matches(source))
                        {
                            string name = parameter.Groups[1].Value;
                            data[name] = name is "checked" or "flag" or "visible" or "enabled" ? "true"
                                : name == "key" ? "documentation-row" : "Literal & <data>";
                        }
                        _ = new NxmlDynamicTemplate(source).Compile(data, components);
                    }
                    else _ = NxmlCompiler.Compile(document, components);
                    xml++;
                }
                else
                {
                    if (area == "nxml") _ = NssStyleSheet.Parse(source);
                    else
                    {
                        // A rule fragment may refer to the previously introduced accent token.
                        if ((source.Contains("var(accent)", StringComparison.Ordinal) || source.Contains("var(--accent)", StringComparison.Ordinal))
                            && !AccentDeclaration().IsMatch(source)) source = "@tokens { accent: #68a5ff; }\n" + source;
                        _ = NssThemeCompiler.Compile(source, inputs);
                        _ = NssThemeCompiler.Compile(source, inputs with { Mode = "dark" });
                    }
                    css++;
                }
            }
            catch (Exception error) when (error is NxmlParseException or NxmlCompileException or JsonException)
            { throw new InvalidOperationException($"Invalid {language} example in {Path.GetRelativePath(docsRoot, file)}: {error.Message}", error); }
        }
        Console.WriteLine($"PASS: documentation examples: {xml} NXML blocks, {css} NSS blocks, {json} JSON blocks.");
    }

    [GeneratedRegex("^```(xml|css|json)[^\\r\\n]*\\r?\\n(.*?)^```[ \\t]*$", RegexOptions.Multiline | RegexOptions.Singleline | RegexOptions.CultureInvariant)]
    private static partial Regex Blocks();
    [GeneratedRegex("\\{data !?([A-Za-z0-9_.-]+)\\}", RegexOptions.CultureInvariant)]
    private static partial Regex Parameters();
    [GeneratedRegex("(?<![A-Za-z0-9_-])accent\\s*:", RegexOptions.CultureInvariant)]
    private static partial Regex AccentDeclaration();
}
