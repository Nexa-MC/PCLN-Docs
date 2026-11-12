# Releases, PGO, and diffs

This is the historical PXML 1.0 toolchain. Use the matching compiler/runtime; current plugin pages use [NXML through ABI 100](../plugin-sdk/).

Publishing a GitHub Release starts native builds for Windows, Linux, and macOS on x86-64 and ARM64. Windows/Linux use LLVM Clang and LLD; macOS uses Apple Clang and the system linker.

```text
-O3 -flto=full -DNDEBUG -fomit-frame-pointer
Windows/Linux: -fuse-ld=lld
```

## Three isolated profiles

The programs never share a synthetic catch-all corpus:

```text
real component/import/slot/build/template authoring → pxml-expand.profdata
real expanded PXML → compact optimized PXIR   → pxml-opt.profdata
real optimized PXIR → PXB                     → pxml-compiler.profdata
```

Each stage executable is rebuilt in its own directory with its own profile. `pxmlc` uses a merge of the three stage profiles so shared hot code receives representative data without creating a fourth generic corpus. `pgo-build.json` records the mapping, raw-profile counts, rounds, and flags.

The release workflow generates and verifies BSDIFF40 patches for all four tools on all six targets. Every patch is applied and compared byte-for-byte before upload. The manifest records tool, target, tags, hashes, and sizes. `SHA256SUMS` covers archives, metadata, patches, and manifests; diffs remain a transport optimization rather than an authenticity mechanism.

## Select and verify a release

Choose the archive for the actual OS and CPU architecture; renaming an executable
cannot change its target. Verify the downloaded archive against the release metadata
before replacing tools. Keep the previous version until the new compiler builds
your corpus successfully.

Apply a delta only to the exact base identified by its manifest, then verify the
resulting full-file digest. If the base or result differs, use the complete verified
archive. Do not treat a smaller download or a matching filename as proof of identity.
PGO changes performance decisions, not the documented language contract; run the
same correctness corpus against optimized releases.
