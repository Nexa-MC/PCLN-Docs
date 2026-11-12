# Shared NXML, standalone pages and onboarding

Connect a negotiated Sidecar UI contract to Host-rendered NXML. Keep page assets, model projection and input intent distinct so a visible control cannot become an undeclared authority path.

**Version scope:** these source-level examples target `v2.0.0.alpha.14`. Use [the Plugin SDK](/en/plugin-sdk/) for current Wasm plugin authoring.

Goal: register a session-owned page, open it from navigation, submit input and restore product navigation when the activation retires. Alpha 14 uses shared NXML schema 3, not XML inside schema 2 or serialized internal IR.

## Negotiation and ownership

Negotiate Nxml=16; Page/OnboardingPage also require Pages=64. Non-string command codecs retain their BinaryPayloads requirement. Use the actual WELCOME intersection, not protocol version as a promise of All.

The peer supplies immutable text files and a complete SHA-256. Host admission validates all sources, bindings and commands and compiles the initial projection before READY. Coalesced background work recompiles mirror changes. Rendering consumes an immutable local projection, never source text or synchronous IPC.

## Encode a page

```csharp
var page = new SidecarNxmlDocument("#ExamplePage", SidecarNxmlOperation.Page,
    "main.nxml", new Dictionary<string, string> {
        ["main.nxml"] = """
            <nxml-page>
              <Page Key="ExamplePage">
                <StackPanel>
                  <TextInput Key="Draft" Label="Note" Height="36" />
                  <Button Key="Submit" Label="Save" Height="36"
                    Command="example.note.set" ArgumentFrom="Draft" />
                </StackPanel>
              </Page>
            </nxml-page>
            """
    });
byte[] payload = SidecarNxmlDocument.Encode(page);
var module = new SidecarRegistrationItem(SidecarRegistrationKind.UiModule,
    "example.note.page", 0, 0, payload,
    System.Security.Cryptography.SHA256.HashData(payload));
```

Register example.note.set as a same-session Command with UTF-8 codec 0. Encoding proves shape only; production requires admission, negotiation, registration and activation. ContractRecipes.cs exercises encoding and large-payload chunking; SidecarNxmlPresentationTests.cs in the launcher exercises actual page presentation.

A second UiModule can target the real product key #navigation-toggle with operation Before:

```xml
<NavigationItem Key="ExampleNavigation" Label="Notes" Content="Local extension"
  Icon="lucide/file-text" Height="42" Command="ui.sidecar.page.open"
  Argument="#ExamplePage" />
```

The page-open intent resolves only a Page in the active invoking module's session. An absent product key does not create a mounting location. Check selectors and layout against the target version.

## Operations and budgets

| Operation | Value | Meaning |
|---|---|---|
| Append / Prepend | 1 / 2 | Insert target children |
| Before / After | 3 / 4 | Insert relative to the matched node |
| Modify | 5 | Overlay ordinary presentation components; keep logical children |
| Replace | 6 | Present a replacement root/subtree; preserve evolving Host logic |
| Page | 7 | Standalone page with a unique single #Key target |
| OnboardingPage | 8 | Onboarding page with a unique single #Key target |

Ordinary selectors support #Key and #Ancestor/#Child, including retained and subsequently created product instances. Module-owned nodes are excluded from target discovery. The latest active layer wins; retirement restores an earlier live layer or current product content.

At most 96 portable relative filenames and 512 KiB UTF-8 source plus file metadata; 32 documents/4 MiB per session, 128 active documents globally, 16384 expanded nodes/document. Names never authorize arbitrary filesystem access. Local .c.nxml files extend an immutable component library and .nss overlays the current stylesheet.

Registration splits payloads into 60 KiB TLV chunks. Use SidecarRegistration.EncodeItem/DecodeItem, hash the complete payload, and retain the source budget. Chunking does not permit a larger single TLV field.

## Data, fragments and input

`{data example.note.current}` reads literal same-session scalar mirror data; it never interpolates XML. Host `{state ...}` remains a separately registered state binding.

A Dynamic slot keyed Rows can consume Rows.d.nxml or files such as Rows/001.d.nxml in ordinal filename order. Retained reload preserves identities, focus, selection, caret, drafts and nested slots.

ArgumentFrom="Draft" reads the local input value. Missing, cyclic or excessive-depth references reject before loading. Normal input/toggle/range intent values retain their semantics. Dispatch rechecks active exposure, codec, cancellation and timeout; retired clicks cannot resurrect a module.

## Onboarding and retirement

Use ui.sidecar.onboarding.continue to resume product onboarding. Continuation/retirement cancels pending exchanges and removes the page and sensitive drafts; visibility is not proof of authentication.

Stop, failure, unload and critical-memory cooperative DEACTIVATE retire activation leases. Recovery may ACTIVATE the same registered session: separate process and activation lifetimes, retain numeric mappings and reuse cached source.

Test missing feature/hash/budget/binding rejection, actual command values, retained drafts, navigation, cancellation, crash cleanup and stale exposure rejection. Codec round trips alone are not UI acceptance.

Sources: [document codec](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.14/Nexa.Sidecar.Protocol/SidecarNxmlDocument.cs), [runtime](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.14/Nexa.Xsr.Runtime/Sidecar/XsrNxmlModuleRuntime.cs), [page tests](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.14/tests/Nexa.Desktop.Tests/SidecarNxmlPresentationTests.cs).

## Check your result

Load a valid page, reject an invalid asset or schema, then deactivate the owner. Its UI contribution must retire without retaining a live input route.
