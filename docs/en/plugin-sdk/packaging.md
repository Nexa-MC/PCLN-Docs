# Package format and distribution

A plugin package binds identity, executable profile, capability requests and payload
bytes into a reviewable artifact. Build it from source; do not hand-edit a ZIP after
its payload hashes have been computed.

## Container layout

The template emits this root layout:

```text
plugin.json
plugin.wasm
page.nxml
```

Do not wrap these files in another directory. Each declared payload has a normalized
relative path, exact byte length and SHA-256. Duplicate entries, traversal paths,
symlinks and undeclared replacement assets must not become a way to change verified
bytes. The actual admission policy is owned by the Host.

## Manifest fields used by the executable example

| Field | Meaning and author action |
| --- | --- |
| manifestVersion | Container manifest schema; the current example uses 1 |
| pluginId / pluginVersion | Stable author-controlled identity and package version; keep qualified registration IDs consistent |
| bootstrapVersion | Loading contract version, currently 1; not the SDK package version |
| entry | Managed entry descriptor retained in the schema; the Wasm example leaves assembly/type empty |
| target | Runtime profile plus OS/architecture restrictions; the example uses nexa-wasm-1 |
| declaredAbiCandidates | Stable ABI candidates; the example declares [100] |
| requiredDependencies / optionalDependencies | Dependency declarations used during admission and group coordination |
| conflicts | Declared incompatibilities; do not silently assume conflicting loads can coexist |
| requestedPermissions | Exact permissions the plugin asks the Host to grant |
| requiredCapabilities / optionalCapabilities | Contract IDs and minimum versions needed for mandatory/optional features |
| webAssemblyEntryPath | Relative path of the executable module |
| declarativeEntryPath | Optional declarative content entry for the supported content profile |
| payloads | Paths, sizes and digests computed from the actual payload bytes |

`eng/build_wasm_sample.py` in the SDK and `eng/build.py` in the template are the
executable examples of constructing these fields. The template deliberately exposes
a smaller `plugin.config.json`; its builder fills the complete manifest. If you
need new dependency or target metadata, extend the builder and validation together.

## Profiles and assets

`nexa-wasm-1` is an import-free WebAssembly module. Static assets are opened through
verified package file references. `nexa-content-1` uses a declarative content entry
without a code entry. A managed DLL does not become an allowed production profile
by changing its extension or manifest string.

The guest binary format and declarative schema are documented in [Wasm SDK](wasm-sdk.md).
A plugin archive and an SDK bundle are different artifacts: do not install the SDK
bundle as a plugin or include its NuGet packages in the guest package.

## Consume an immutable SDK bundle

The public SDK release includes two NuGet packages, headers, contracts, examples
and documents. `sdk-manifest.json` identifies the source and package versions;
`SHA256.json` covers its other members. Consumers pin the release filename, commit,
size and outer digest, then validate the member digests and manifest identity.

Use the bundle's `packages/` directory as a local NuGet source alongside nuget.org
when compiling managed contract code. Publication on GitHub Releases does not imply
those packages are available from nuget.org. No private Sidecar checkout is required.

## Separate integrity from trust

Checksums establish byte identity, not publisher authenticity. Local unsigned
packages need explicit developer admission. Production Market delivery additionally
needs authenticated acquisition, publisher/entitlement verification and Host policy.
The SDK cannot manufacture those approvals or hold Market private keys.

Approved cached content can support offline use only under the Host's actual
policy. See [offline design](guides/offline.md) and [test and release](tutorials/test-and-release.md)
before describing your package's distribution guarantees.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/packaging.md) · Apache-2.0.
