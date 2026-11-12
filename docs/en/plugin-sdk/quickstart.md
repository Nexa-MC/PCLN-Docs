# Build and load your first plugin

By the end of this tutorial you will have an installable ZIP containing a Wasm
plugin and a Host-rendered page. Clicking its button requests confirmation and
then runs a callback in PluginSidecar. You do not need a private runtime checkout.

## Before you start

Install Git, Python 3.12 or newer, and LLVM Clang with `wasm-ld`. On Debian or Ubuntu,
`clang` and `lld` provide the compiler and linker. On other platforms, use an LLVM
installation with the WebAssembly target or the official WASI SDK compiler.
Despite its name, that compiler can build our import-free, non-WASI guest.

Use a NexaCL development build compatible with the [recorded Host support](host-support.md).
Enable its developer mode to admit a local unsigned package. .NET 10 is only
needed for the optional managed contract example and SDK development tests.

Check your tools before creating the project:

```sh
python --version
clang --version
wasm-ld --version
```

If `clang` is not on PATH, pass its absolute path to the build command below.
A missing linker is a toolchain failure; changing plugin permissions cannot fix it.

## 1. Create the project

Use **Use this template** on
[NexaCL-Plugin-Template](https://github.com/Nexa-MC/NexaCL-Plugin-Template), then clone
your repository. To try the unchanged example instead:

```sh
git clone https://github.com/Nexa-MC/NexaCL-Plugin-Template.git
cd NexaCL-Plugin-Template
```

Run all commands in this tutorial from that directory. `wasm/plugin.c` owns
lifecycle and action callbacks; `wasm/page.nxml` describes the page;
`plugin.config.json` supplies identity and permissions. `sdk.lock.json` pins the
public SDK release, commit, byte length and SHA-256.

## 2. Give the plugin an identity

In `plugin.config.json`, change `id`, `version` and `title`. For example, use
`example.notes`, `0.1.0` and `Instance notes`. Keep the other fields for this first
build. Use an ID you control before distributing the plugin.

The build passes this ID into C as `PLUGIN_ID` and substitutes it into the NXML
asset. Both registrations then belong to the same namespace. Editing only an
individual action ID would leave the page pointing at a different action.

## 3. Compile and verify

```sh
python eng/build.py --clang clang
python eng/verify_package.py
```

The first command downloads and verifies the pinned SDK, compiles the guest, hashes
its payloads and writes `artifacts/plugin.zip`. The second verifies the manifest,
entry identities and payload hashes. A successful build contains exactly:

```text
plugin.json
plugin.wasm
page.nxml
```

The optional `managed-contract/` project is not inside that ZIP. Its DLL illustrates
the Bootstrap contract; it is not the production executable plugin profile.

A later build can reuse the verified `.sdk` cache offline. If verification detects
changed cached files, the consumer repairs the cache from its verified archive.
Do not disable verification to make a modified SDK look like the pinned release.

## 4. Load and observe

Open plugin management in the compatible launcher, select the ZIP and review the
identity, digest and permissions. Admit the package using the available developer
loading option. Open its page and click **Run action**. The Host asks for approval;
approval invokes the callback, which returns `Desktop action completed`.

Repeat the action and decline confirmation. The callback must not run. Stop or
unload the plugin and verify that its page is removed. These checks establish the
Host boundary that compiling alone cannot test.

If loading fails, retain the load report and follow [troubleshooting](errors.md).
An unsupported required capability requires a compatible Host or a smaller feature
set; it is not fixed by adding arbitrary permissions.

## 5. Make a visible change

Edit the heading in `wasm/page.nxml`, rebuild and reload the new ZIP. Verify the
changed heading. Editing the source does not modify an already admitted package.
Never edit an archived asset without regenerating its manifest hashes.

Continue with [the page and action walkthrough](tutorials/page-and-action.md), which
explains the exact calls you have just run.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/quickstart.md) · Apache-2.0.
