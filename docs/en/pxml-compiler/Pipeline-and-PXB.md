# Pipeline, PXIR, and PXB

This is the historical PXML 1.0 toolchain. Use the matching compiler/runtime; current plugin pages use [NXML through ABI 100](../plugin-sdk/).

```text
source buffer
  → on-demand lexer / zero-copy token views
  → arena-backed AST
  → expander
  → compact PXIR (uint32 IDs / interned strings)
  → fused linear optimizer
  → typed blueprint
  → exact PXB layout / one final allocation
```

AST, PXIR, and the compiler blueprint use block bump arenas and are released as a unit. PXIR nodes and properties are fixed-size contiguous arrays; tree relationships are IDs. The optimizer therefore scans linear memory instead of repeatedly walking a pointer tree. String pools and the PXB string table use open addressing.

`pxmlc --full` passes these representations in memory. The standalone programs materialize expanded PXML and optimized PXIR only for diagnostics, testing, and stage-specific profiling.

PXB1 encodes little-endian fields explicitly. Its 32-byte directory addresses 16-byte-aligned `STRS`, `NODE`, `PROP`, `BIND`, `DEPS`, `META`, and optional `SMAP` sections. The writer computes the complete layout, allocates the final binary once, fills the directory in place, and performs one file write.

All six native CI targets compile the same corpus twice and require byte-identical PXB output.

## Diagnose a pipeline failure

Keep the failing input and run the stages independently using the [CLI reference](CLI).
If expansion fails, inspect registered imports, components and build symbols. If
optimized IR fails to load, check the producer version and binary format before
investigating rendering. If compilation succeeds but a runtime rejects PXB, compare
format and fingerprint compatibility rather than silently rebuilding with a different
schema. A fingerprint detects mismatched bytes; it is not a publisher signature.

## Verify deterministic output

Compile the same corpus twice with identical inputs and toolchain, then compare
bytes. Record the compiler revision and flags. Cross-version output need not be
identical merely because both files use PXB1.
