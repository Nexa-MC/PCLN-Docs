# Business provider callbacks

The alpha.9 contract, retained by standalone SDK `0.2.0-alpha.12`, adds `BusinessProviderCall` without changing existing
operation IDs, `ProviderDescriptor`, or model fingerprints. A Host must explicitly
implement each provider family. Registering a descriptor does not create a generic
permission to intercept arbitrary launcher operations.

A read provider registers a callback in `OnPreInitialize` and submits its descriptor
during `OnInitialize`. Set `SchemaHash` to
`Abi100Schemas.BusinessProviderCall.Digest`, `Configuration` to
`Abi100Schemas.Empty`, `ContractVersion` to `100`, and `SupportedScopes` to
`["application"]`. The ID belongs to the plugin's namespace; built-in IDs cannot
be replaced. Capabilities are exact method names from the Host's documented table.

The callback decodes `BusinessProviderCall`, checks its `Kind`, `Method`,
`InputSchema` and `OutputSchema`, decodes `Inputs` using the stated model, and
returns the encoded output model directly. Page results use generated helpers such
as `Abi100Schemas.PageOfCatalogProject`. Do not return another envelope.

The current read-provider boundary supports `ExplicitRequest` selection and
`Queue`, `RejectDuplicate`, or `Parallel` concurrency. Parallel execution is
bounded to four active calls; queued admission is bounded to 32. The descriptor's
1–30000 ms deadline includes queue time and is capped by the caller's budget.
Cancellation propagates from both caller and provider retirement. The registration
cannot be released while a callback holds it. Nested Host mutations are rejected.

`FailOperation` retains a callback's error code. `Unavailable` maps failed callback
replies to `PROVIDER_UNAVAILABLE`. Invalid output still fails schema validation.
`RetryBounded` and `ReplacePending` are rejected until a family defines their exact
semantics. A caller must not infer retry safety from an error.

Providers remain invisible until atomic activation and disappear on stop/abort.
The Host validates the result's schema and must additionally validate domain
identity, scope, pagination and provenance before consuming it.

## Implement the current catalog family

Use provider kind `nexa:catalog`. The Host accepts the following closed method table:

| Method | Input | Successful output |
| --- | --- | --- |
| Search | CatalogSearch | Page of CatalogProject |
| ReadProject | ResourceRef | CatalogProject |
| ListVersions | CatalogVersionQuery | Page of CatalogVersion |
| ReadVersion | ResourceVersionRef | CatalogVersion |
| ReadChangelog | ResourceVersionRef | TextResult |
| ResolveFiles | ResourceVersionRef | Page of CatalogFile |
| ResolveDependencies | ResourceVersionRef | Page of CatalogDependency |

Declare only methods you implement. Use a separate consumer plugin to exercise the
provider: calling back into the same provider can trigger the runtime's callback
cycle guard. A self-call conflict is not evidence that the registered provider is
missing.

The callback receives a BusinessProviderCall, validates the envelope, dispatches
one of these methods and returns that method's output directly. Use
`Abi100Schemas.PageOfCatalogProject`, `PageOfCatalogVersion`, `PageOfCatalogFile`
and `PageOfCatalogDependency` for collection results. A schema for one item is
not a schema for a page of those items.

## Preserve provenance and pagination

Every returned project must identify the selected provider. Version results must
identify the exact requested resource; do not reuse a cached version from another
project because its version string matches. The current Host checks project and
version IDs for nonempty bounded text and rejects control characters.

Search currently requires exactly one custom provider. The Host wraps provider
cursors with caller/query scope. Keep the same query while paging; a cursor from
another caller, filter or version query is a conflict. The current boundary accepts
page limits from 1 to 256, at most that many returned items, revision strings of
1–256 characters and provider cursors up to 4096 UTF-8 bytes.

File results require a plain filename of 1–256 characters, excluding path separators,
`.`/`..` and control characters. Size must be nonnegative. Sources must be absolute
HTTPS URLs without user information or fragments. A nonempty SHA-256 must contain
64 hexadecimal characters. These checks establish a valid descriptor; they do not
make custom-provider installation available.

## Verify the provider as a consumer would

Test every declared method through another admitted plugin, including an empty page
and a second page. Return a foreign provider identity, an invalid filename and a
cursor from another query and verify rejection. Stop the provider while a query is
queued and confirm cancellation; its descriptor must disappear from discovery.

The implementation and integration cases are in the public NexaCL repository:
[Catalog provider owner](https://github.com/Nexa-MC/NexaCL/blob/195083d16/src/app/Nexa.Services.Composition/Composition/Plugins/PluginBusinessRoutes.CatalogProviders.cs).
The [support snapshot](host-support.md) records the full source revision. Availability
of these seven reads does not imply custom favorites, installation, mixed-provider
search or other provider families are implemented.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/business-providers.md) · Apache-2.0.
