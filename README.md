# NexaCL developer documentation

[简体中文](README.zh-CN.md) · [Published site](https://docs.pcln.top/en/) · [Plugin tutorial](https://docs.pcln.top/en/plugin-sdk/quickstart)

This repository publishes tutorials, task guides, explanations and references for
plugin authors, derived launcher developers and contributors. The Plugin SDK uses
Bootstrap V1 and ABI 100. Theme, native Sidecar and Host NXML examples have an
explicit Alpha 14 source baseline; PXML is maintained as historical reference.

## Read or contribute

Start with [development routes](docs/en/development/index.md). Plugin documentation
is authored in [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK), then
copied here with source-commit attribution. Edit that source rather than its website
copy. Other site chapters and the versioned authoring examples live here.

Follow [the editorial guide](CONTRIBUTING.md): establish prerequisites, explain a
complete sequence, show the expected result, cover failures and identify the exact
version. Complete examples should be compiled; a snippet or diagram must not be
presented as proof of an implemented product feature.

## Build locally

Use Node 24 and pnpm 11, matching CI:

```sh
pnpm install --frozen-lockfile
pnpm docs:check
pnpm docs:build
pnpm docs:dev
```

The build writes `.vitepress/dist`. The check validates local page links, source
metadata and version/legacy boundaries. VitePress also validates links during build.

## Synchronize the SDK documentation

Keep `NexaCL-Plugin-SDK` next to this checkout, or set `NEXA_PLUGIN_SDK_SOURCE` to its
absolute path. Use a clean, reviewed SDK commit:

```sh
pnpm docs:sync
node scripts/sync-plugin-sdk-docs.mjs --verify
```

The sync replaces only `docs/en/plugin-sdk` and `docs/zhHans/plugin-sdk`, records the
source in `sdk-docs-source.json`, and retains old SDK URLs as migration entry points.
English technical references without a Chinese translation are marked explicitly.
Imported SDK material retains Apache-2.0; other site documentation uses CC BY-SA 4.0.

## Validate executable examples

`authoring-examples.yml` checks out NexaCL `v2.0.0.alpha.14` and runs the protocol,
real IPC, theme packaging, NXML/NSS and NativeAOT examples. SDK CI separately compiles
its Wasm examples and verifies contracts and tutorial/source consistency. The template
repository compiles the installable starter and verifies its ZIP. Read each workflow's
result before claiming platform or runtime acceptance.

## Publish

A push to `main` runs `.github/workflows/cloudflare-pages.yml`, builds the site and
deploys the Cloudflare Pages project `pcln-docs` to `https://docs.pcln.top`.
Deployment credentials are configured in the `cloudflare-pages` environment; do not
put them in documentation or example files. A successful build is not a deployment
confirmation: check the workflow and the live page after publishing.
