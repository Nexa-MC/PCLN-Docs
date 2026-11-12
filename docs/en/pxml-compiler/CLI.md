# PXML compiler command reference

Use these commands with the historical PXML 1.0 toolchain. They produce blueprints
for its matching runtime, not NXML assets for current NexaCL plugins. Install the
compiler tools and put them on PATH before running commands from your page directory.

## Compile a complete pipeline

```sh
pxmlc --full Hello.pxml -o Hello.pxb --release --strict
```

This expands, optimizes and compiles in one process. Intermediate PXML and PXIR stay
in memory. `--strict` requires the `pcl://ui` namespace and rejects unknown properties.
`--release` omits the SMAP source-map section. Keep a debug build when you need to
relate runtime diagnostics to source locations.

## Run stages independently

```sh
pxml-expand Hello.pxml -o Hello.expanded.pxml
pxml-opt Hello.expanded.pxml -o Hello.pxir
pxml-compile Hello.pxir -o Hello.pxb --strict
```

Use this form to inspect a failing stage. The optimizer consumes expanded PXML and
writes compact binary PXIR. The compiler consumes that IR; it does not expand or
parse the original source again. Feeding the wrong intermediate format to a stage
cannot be repaired by renaming the file extension.

| Option | Meaning |
| --- | --- |
| `-o FILE` | Output path for the selected stage |
| `--component FILE` | Register a component input; repeat for multiple inputs |
| `--import FILE` | Register an allowed import; no implicit arbitrary-path lookup |
| `-D SYMBOL` | Define a build symbol; repeat as needed |
| `--debug` | Retain stage-specific debugging information where supported |
| `--strict` | Require the strict source/property contract |
| `--warn-as-error` | Fail when diagnostics include warnings |
| `--release` | Full-pipeline release output without SMAP |

Component/import/symbol options apply to expansion or the full pipeline; do not
pass every option indiscriminately to all stage executables.

## Validate and inspect

```sh
pxmlc check Hello.pxml --strict
pxmlc inspect Hello.pxb
pxmlc dump Hello.pxb
```

`check` diagnoses source without proving runtime rendering. `inspect` reports binary
header/sections; `dump` gives a readable structure. `format` is also available for
source formatting. Successful commands exit 0; source/semantic/binary diagnostics
exit 1; invalid CLI usage exits 2. In CI, stop on a failed stage and retain its
actual diagnostic rather than attempting to install an old output file.

Continue with [the first page](ui-tutorial/First-Page) and
[the pipeline explanation](Pipeline-and-PXB).
