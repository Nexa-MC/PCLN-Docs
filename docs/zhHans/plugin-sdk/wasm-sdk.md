> 本页保留英文技术原文；中文入门与专题见 [开发文档](index.md)。

# WebAssembly guest SDK

The production code profile is `nexa-wasm-1`: one WebAssembly module with no
imports. All effects go through negotiated public Host capabilities. The managed
SDK is the contract/adapter SDK; ordinary CLR plugin DLLs are not an installable production Desktop profile.

## Build the C example

Use Clang with the WebAssembly target and `wasm-ld` (or the official WASI SDK's
Clang; the build explicitly selects `wasm32-unknown-unknown` and links no WASI):

```sh
python eng/generate_abi100.py --verify
python eng/build_wasm_sample.py --clang /path/to/clang
dotnet run --project tests/Nexa.Plugin.Sdk.Tests -c Release
# Install artifacts/wasm-sample/desktop.zip in a compatible NexaCL development build.
```

`sdk/wasm/include/nexa/guest.h` supplies bounded value views, field access,
writers, continuation calls and lifecycle completion. `abi100_ids.h` is generated
from the same operation catalog as the C# SDK. It contains local method numbers,
not Sidecar transport opcodes. `samples/WasmHello/plugin.c` registers a definition
during Initialize, awaits the Host reply, and propagates registration failure.
The test Host explicitly installs its message schema policy and reads the
published definition; no arbitrary consumer is inferred from registration.

The ZIP is an unsigned **developer artifact**. Production acquisition must
authenticate its bytes through Market and the protected Host identity before
`VerifiedPluginPackage.Parse` is called. Never expose that trusted parsing method
as an unsigned user install route. Tests label development trust explicitly.

## Execution and values

The module exports `memory`, `nexa_alloc(i32)->i32`, and
`nexa_resume(i32,i32)->i64`. The runtime copies the encoded input to the allocated
address, resumes the guest and copies its reply. The result's high 32 bits are
the reply address; the low 32 bits are its length. Allocation and resume share
one fuel allowance. Borrowed views must not survive a resume call. The example
uses 64 KiB buffers; the runtime permits up to 4 MiB per encoded value.

The closed binary codec starts with little-endian UInt32 version `1`:

| Tag | Value |
| --- | --- |
| 0 | Null |
| 1 | Boolean byte, exactly 0 or 1 |
| 2, 3, 4 | Little-endian Int64, UInt64, finite Float64 |
| 5, 6 | Int32 byte length followed by strict UTF-8 or raw bytes |
| 7 | Int32 count followed by values |
| 8 | Int32 count followed by UTF-8 keys (length + bytes) and values |

Limits: 32 levels, 16,384 value nodes, 65,536 characters per string, 4 MiB total.
Negative lengths, duplicate keys, invalid UTF-8 and trailing bytes are rejected
by the runtime. Canonical Host encoding sorts keys ordinally. UUIDs are `D`
strings and timestamps are invariant `O` strings. This is the guest payload,
not a new IPC frame.

Lifecycle input contains `kind=callback`, `phase`, `pluginId`, `loadInstanceId`
and `correlationId`. Output is either:

- `kind=complete`, `value={success: bool, code?: string}`;
- `kind=invoke`, `contract`, `method`, `arguments`, optional `operationId`,
  `idempotencyKey` and `expectedRevision`.

An invoke suspends guest execution while the Host runs asynchronously. The next
input is `kind=reply`, `success`, `value` and structured `error`. Actual identity,
stage, scope and remaining deadline come from the Host. Guests cannot override
these by adding fields. Mutation keys are bound to their inputs; unknown outcomes
must remain explicit.

## Static content

`nexa-content-1` uses `declarativeEntryPath` and no code entry. Its payload is
`AbiValueBinary.Encode(DeclarativeContentPack.Write(pack))`, with
`pack.Schema = Abi100Schemas.DeclarativeContentPack`. The signed manifest must
request `nexa.definitions.write` and require `nexa.definitions` version 1.
`nexa-wasm-1` may include the same entry beside its code. Static and code
registration share context, validation, rollback and group commit.

Schema fingerprints include each model's transitive model/enum closure and
codec/scalar contract version. `Abi100Schemas.Validate` uses static readers and
checks exact ID/version/digest. Custom business schemas still require a trusted
schema policy or a future validated dynamic schema implementation.

## Complete typed bindings

Include `nexa/abi100.h` to use the generated C API. It contains 346 current
operations plus 22 compatibility operations under `nx_Legacy_*`. Each model has
`nx_Type_read`, named field accessors and `nx_Type_write`; arrays have typed
`_count`, `_at`, `_write`, and nullable wrappers have `_has_value`, `_value`,
`_none`, `_some`. Enum values have named C constants and exact wire-name codecs.
Models are borrowed byte views; builders append into caller-owned buffers.
Use separate argument and continuation-output buffers to avoid overwriting an
argument while serializing a call. The example demonstrates this ownership.

`nx_Group_Method(writer, request, options)` writes a continuation.
`nx_Group_Method_result(reply, &result)` decodes a successful typed result or
returns false and clears the output. `nx_reply_error(reply)` preserves the full
structured Host error. No automatic fallback, mutation retry or permission grant
occurs. Initialize options with `{0}` and set named fields:

- `operation_id`: optional UUID; the runner assigns one when absent;
- `idempotency_key`: required for catalog mutation operations;
- `expected_revision`: optional optimistic concurrency token;
- `experiment_id`: explicit negotiated experiment, never a stable-call fallback;
- `budget_milliseconds`: optional positive duration up to 300,000 ms. Zero omits
  it. The adapter forwards the smaller requested/remaining callback budget.

`nx_operation_count/at` provide operation metadata. `nx_schema_Type` writes the
same schema reference/fingerprint as `Abi100Schemas.Type` in C#.
`nx_has_capability/permission/experiment` inspect the negotiated snapshot, not
live authorization. A positive result cannot override a revoked grant.

## Typed callbacks

C# authors can use `ICallbacksV1.Register<TInput,TOutput>` from `TypedCallbacks`.
The lease exposes the callback handle and releases it exactly once on Dispose.
Input/output use static codecs, malformed input never reaches the handler, and
structured handler failures are preserved. Registration is inert; a separate
ABI subscription/provider/action registration connects the handler to business
work.

The execution adapter's `IPluginInvocationV1.InvokeHandler` accepts a trusted
Host-supplied context, handler ID, input and invocation scope. Wasm receives
`kind=handler`, `handler`, `input`, `invocationId`, `correlationId`, `causationId`,
remaining `budgetMilliseconds`, and negotiated `abi` metadata. Use
`nx_handler_id/input` and return `nx_handler_success` or `nx_handler_error`.
Handler failures may supply code, message key, parameters and details; identity
and correlation are assigned by the adapter. Normal ABI continuations may be
issued before returning the handler result. Calls before activation, after stop,
or with a foreign context/instance are rejected. Stopping cancels in-flight
business callbacks. This port does not authorize arbitrary external dispatch;
the embedding Host still owns service/event scheduling and target authorization.

## Verification and distribution

`eng/build_wasm_sample.py` builds the example, every generated binding, a callback
fixture and malformed-codec fixture. PluginSidecar integration CI loads these fixtures and exercises all 368 operations for success and
failure, 300 model/collection shapes, typed callbacks, Unicode/NUL/exact 64-bit
values and malformed data rejection. Standalone SDK CI compiles the fixtures and runs its own contract tests. Fixture Host replies prove SDK contract
behavior, not the availability of real launcher features. PluginSidecar CI repeats runtime conformance inside NativeAOT executables on Windows, Linux and macOS.

`eng/package_sdk.py` creates a reproducible standalone header/schema/example ZIP
with file digests. It is a developer SDK artifact, not a signed plugin package.
The C# NuGet package also contains the schemas and C headers. The additive
`IPluginInvocationV1` interface preserves existing Bootstrap assembly identity;
older entries can still implement only the original Bootstrap interface.

## Runnable workflow example

`samples/WasmWorkflow/plugin.c` uses generated schema fingerprints and builders to
register an action, a persistent queued workflow, an interval schedule and cleanup.
Its Initialize callback chains four asynchronous Host replies; Activated starts a
workflow, and handler 1 returns a typed TextResult. Handler 2 is the cleanup path.
Borrowed model views are never retained across a Host continuation.

`eng/build_wasm_sample.py` builds `workflow.wasm` and a deterministic developer
`workflow.zip` alongside the simple definition example. These unsigned ZIPs are
explicit test/development input, not Market grants. Both managed and NativeAOT
suites load the real package, wait for the activation run, manually trigger the
schedule and verify the compiled cleanup after business callbacks are stopped.
The standalone C/Wasm SDK archive includes both example sources.

## State and storage example

`samples/WasmStateStorage/plugin.c` opens a private namespace during Initialize,
restores a TextResult after activation, initializes only a genuinely missing entry,
and projects the stored value into State with compare-and-exchange. It copies
borrowed namespace/value bytes into owned buffers before yielding. Build `state.zip`
from the current SDK source checkout; this tutorial example was added after the
original alpha.10 bundle and is not present in that immutable older archive.

The current C source examples preserve a failed Host reply in the callback failure envelope
using `nx_complete_error`. This is a source-compatible alias of `nx_handler_error`; the success/error envelope is
also accepted for lifecycle completion. The Host retains authoritative identity and
correlation; plugin-supplied fields do not override them.


## Canonical maps and optional fields

`nx_decode` validates map keys in strictly increasing **UTF-16 ordinal** order,
matching the Host encoder. Duplicate or out-of-order keys are malformed. C writers
must emit keys in that order; `nx_map` and `nx_key` do not sort them. The decoder
visits each value once and charges nested values to the same 16,384-node budget.
Its key-validation cost is linear in the encoded key bytes. `nx_field` remains a
linear lookup; cache fields if you repeatedly inspect a large map.

A missing field and an explicit ABI null are different values:

```c
nx_value value = nx_field(reply, "optionalField");
if (nx_is_missing(value)) {
    /* No such field: enforce the model's required/optional-field rule. */
} else if (nx_is_null(value)) {
    /* The field exists and contains an encoded null. */
} else {
    /* Decode the expected type. */
}
```

Missing is the sentinel `{0, 0}` and cannot be encoded with `nx_raw`. Null has a
one-byte payload with tag zero. Neither should be dereferenced before checking
presence. Use the generated model reader when a schema is available; it rejects
missing required fields instead of silently treating them as null.

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/zh-CN/wasm-sdk.md) · Apache-2.0.
