# PXML

This is the historical PXML 1.0 toolchain. Use the matching compiler/runtime; current plugin pages use [NXML through ABI 100](../plugin-sdk/).

This section brings together the PXML UI tutorials and the official compiler documentation.

## PXML UI tutorials

Start with the [tutorial overview](/en/pxml-compiler/ui-tutorial/) and learn page structure, layout, text, buttons, commands, and the complete `.pxml` to `.pxb` build path.

## PXML Compiler

PXML Compiler is the official native C17 toolchain for PXML 1.0. It turns authoring PXML into deterministic PXB blueprints at build time, so the runtime needs neither an XML parser nor reflection-driven component discovery.

Repository: [PCL-N-Edition/PXML-Compiler](https://github.com/PCL-N-Edition/PXML-Compiler)  
Downloads: [GitHub Releases](https://github.com/PCL-N-Edition/PXML-Compiler/releases)

Every release archive contains four programs, five static libraries, public headers, three target-specific PGO profiles, and format documentation. Native builds cover Windows, Linux, and macOS on both x86-64 and ARM64. Windows/Linux use LLVM Clang; macOS uses Apple Clang.

- `pxml-expand` expands components, properties, slots, and build conditions.
- `pxml-opt` lowers expanded PXML to compact PXIR and optimizes it.
- `pxml-compile` validates optimized PXIR and emits PXB.
- `pxmlc --full` runs all stages in one process without materializing intermediate files; it is the recommended IDE/build entry point.

The implementation uses bump arenas, interned 32-bit IDs, contiguous PXIR, linear optimizer passes, open-addressed tables, and exact binary layout. Hot scanning primitives dispatch to AVX2 on supported x86-64 Clang builds; ARM64 uses NEON.

The parser rejects DTDs, external entities, and arbitrary processing instructions. PXIR/PXB readers validate structure and fingerprints. The current fingerprint detects corruption and nondeterminism; it is not a release signature.

## Start or maintain a project

New NexaCL plugin authors should use the [plugin template](../plugin-sdk/quickstart).
For an existing PXML application, begin with the [first-page tutorial](ui-tutorial/First-Page),
then follow syntax, layout, bindings and components. Preserve the matching runtime
version alongside the compiler. The compiler emits a blueprint; it does not open
a test window or implement application commands.
