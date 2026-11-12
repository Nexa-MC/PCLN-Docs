# Add state and persistent storage

A page needs a current view of data; a restarted plugin needs a durable record.
These are different requirements. Use owned State for published, revisioned values
and Storage for the plugin's private persisted entries. This chapter uses the complete `samples/WasmStateStorage/plugin.c` example.
It has no page: it restores private data and projects that value into owned State.

## Build the complete example

From the SDK repository root, run:

```sh
python eng/build_wasm_sample.py --clang clang
```

Load `artifacts/wasm-sample/state.zip` in a compatible development Host. During
Initialize the guest opens `example.state:data` and declares `example.state:message`.
After activation it reads the private `message` entry. Only NOT_FOUND initializes
the entry to `Saved by the state tutorial`; other errors fail rather than erasing data.
It then reads State and publishes the stored TextResult using the exact state revision.

The example copies the namespace and stored value into dedicated buffers before
yielding. Keeping a borrowed view into the next resume's input would corrupt the
continuation. It also uses a conditional create: if another writer created the entry,
a stale revision fails instead of overwriting that value.

A runtime integration check loaded the actual Wasm, changed the stored entry through
the authorized API, restarted the Host and verified the changed text was restored
into State. It also rejected a stale write. SDK CI compiles this sample; that compile
alone is not a substitute for the runtime check.

## Define the data before calling the Host

Choose a schema the Host accepts, a qualified state ID in your plugin namespace,
and the exact scope. A generated model schema has a reproducible fingerprint.
An arbitrary custom schema needs a trusted Host schema policy; declaring its hash
does not install a validator. Keep this distinction explicit when designing a notes
feature with fields that are absent from the current closed catalog.

During Initialize, declare the owned state and open the authorized private storage
namespace. Do not assume that opening a namespace permits access to another
plugin's data. Keep the returned handle only for the current admitted load.

## Publish a value without overwriting another writer

The sequence below describes Host calls, not executable C syntax:

```text
State.Read(id, scope) -> current snapshot and revision
construct the next value using the declared schema
State.CompareExchangeOwned(id, scope, next value, expected revision)
if conflict: read again, reconcile the edit, and retry with the new revision
```

Copy the returned revision exactly. It is not a number you can increment.
An initialized but unread state may carry Null and the explicit `uninitialized`
revision; distinguish it from a missing declaration and from a legitimate empty value.
Do not turn a failed read into an empty state and overwrite existing data.

## Persist an edit

Use `Storage.Read` before a conditional update and `Storage.CompareExchange` when
a competing writer must be detected. For a group of related entries, use the
namespace transaction APIs and commit the transaction according to the current
revision. A successful UI update is not proof that the storage write committed.
Decide which result is authoritative and only show “saved” after that result succeeds.

Schema migration is an explicit operation. `Storage.Migrate` invokes an owned,
read-only migration action with the declared migration input/output schemas. The
current implementation bounds the input batch to 256 entries; consult
[runtime services](../runtime-services.md) before selecting this route for a larger store.
Never silently reset a namespace after migration failure.

## Keep a view current

`State.Watch` returns a subscription. Read bounded batches through
`Resources.ReadSubscription`; the read consumes queued items, so retain its
idempotency key while resolving an uncertain reply. If the batch reports a gap,
read a fresh State snapshot and rebuild the view. A notification stream alone is
not a complete source of truth after overflow or restart.

Release the subscription when the view no longer needs it. On plugin stop,
discard local handles and cancel pending calls. A new load obtains new handles,
even when the plugin ID is unchanged.

## Verify the behavior

Test two edits against the same initial revision: only the valid conditional
update should commit. Restart and read the persisted value. Deny storage permission
and confirm that the UI reports an unavailable save rather than a successful one.
Overflow a watch in a controlled integration test and verify snapshot recovery.

For an executable background example, continue with [workflows](workflows.md).
The exact requests and responses are listed under [State](../api/state.md),
[Storage](../api/storage.md), and [Resources](../api/resources.md).

## Complete source

The following is synchronized with `samples/WasmStateStorage/plugin.c` and compiled by SDK CI.

<!-- example:samples/WasmStateStorage/plugin.c language:c -->
```c
#include <nexa/abi100.h>

/* The namespace and stored value are copied into owned buffers before yielding. */
static nx_u8 input[65536], output[65536], arguments[32768];
static nx_u8 namespace_bytes[2048], value_bytes[4096];
static nx_u32 namespace_size, value_size;
static int step;

NX_EXPORT("nexa_alloc") nx_u32 nexa_alloc(nx_u32 size)
{
    nx_require(size <= sizeof input);
    return (nx_u32)(__UINTPTR_TYPE__)input;
}
static nx_ScopedTarget scope(nx_writer *w)
{
    return nx_ScopedTarget_write(w, nx_literal("nexa:global"),
        nx_EntityIdOptional_none(w), nx_literal("example.state"));
}
static nx_StorageNamespace owned_namespace(void)
{
    nx_value value = {namespace_bytes, namespace_size};
    return nx_StorageNamespace_read(value);
}
static void read_state(nx_writer *reply, nx_writer *args)
{
    nx_call_options options = {0};
    step = 5;
    nx_State_Read(reply, nx_StateReadRequest_write(args,
        nx_literal("example.state:message"), scope(args)), &options);
}
NX_EXPORT("nexa_resume") nx_u64 nexa_resume(nx_u32 address, nx_u32 size)
{
    nx_require(address == (nx_u32)(__UINTPTR_TYPE__)input && size <= sizeof input);
    nx_value message = nx_decode(input, size);
    nx_writer reply = {output, 0, sizeof output};
    nx_writer args = {arguments, 0, sizeof arguments};
    nx_call_options options = {0};
    if (nx_is_string(nx_field(message, "kind"), "reply")) {
        if (!nx_reply_success(message)) {
            /* Only a genuinely absent entry is initialized. All other failures fail. */
            if (step == 3 && nx_is_string(nx_field(nx_reply_error(message), "code"), "NOT_FOUND")) {
                nx_TextResult initial = nx_TextResult_write(&args, nx_literal("Saved by the state tutorial"));
                nx_StorageWrite write = nx_StorageWrite_write(&args, owned_namespace(), nx_literal("message"),
                    initial.value, nx_schema_TextResult(&args), nx_RevisionOptional_none(&args));
                options.idempotency_key = "initialize-message";
                step = 4;
                nx_Storage_CompareExchange(&reply, write, &options);
            } else { step = 0; nx_handler_error(&reply, nx_reply_error(message)); }
        } else if (step == 1) {
            nx_StorageNamespace value;
            nx_require(nx_Storage_OpenNamespace_result(message, &value));
            nx_writer saved = {namespace_bytes, 0, sizeof namespace_bytes};
            nx_StorageNamespace_encode(&saved, value); namespace_size = saved.size;
            nx_StateDescriptor descriptor = nx_StateDescriptor_write(&args,
                nx_literal("example.state:message"), nx_schema_TextResult(&args), scope(&args));
            options.idempotency_key = "define-message"; step = 2;
            nx_State_DefineOwned(&reply, descriptor, &options);
        } else if (step == 2) { step = 0; nx_complete(&reply, 1); }
        else if (step == 3 || step == 4) {
            nx_StorageValue stored;
            if (step == 3) nx_require(nx_Storage_Read_result(message, &stored));
            else nx_require(nx_Storage_CompareExchange_result(message, &stored));
            nx_value value = nx_StorageValue_Value(stored);
            (void)nx_TextResult_read(value);
            nx_writer saved = {value_bytes, 0, sizeof value_bytes};
            nx_AbiValue_encode(&saved, value); value_size = saved.size;
            read_state(&reply, &args);
        } else if (step == 5) {
            nx_StateSnapshot current;
            nx_require(nx_State_Read_result(message, &current));
            nx_value value = {value_bytes, value_size};
            nx_StateUpdate update = nx_StateUpdate_write(&args,
                nx_literal("example.state:message"), scope(&args), value,
                nx_StateSnapshot_Revision(current));
            options.idempotency_key = "publish-message"; step = 6;
            nx_State_CompareExchangeOwned(&reply, update, &options);
        } else if (step == 6) {
            nx_StateSnapshot current;
            nx_require(nx_State_CompareExchangeOwned_result(message, &current));
            (void)nx_TextResult_read(nx_StateSnapshot_Value(current));
            step = 0; nx_complete(&reply, 1);
        } else nx_complete(&reply, 0);
    } else if (nx_is_string(nx_field(message, "phase"), "Initialize")) {
        step = 1;
        nx_Storage_OpenNamespace(&reply, nx_NamespaceRequest_write(&args,
            nx_literal("example.state:data"), 1), &options);
    } else if (nx_is_string(nx_field(message, "phase"), "Activated")) {
        step = 3;
        nx_Storage_Read(&reply, nx_StorageKey_write(&args, owned_namespace(),
            nx_literal("message")), &options);
    } else nx_complete(&reply, 1);
    return nx_result(&reply);
}
```
<!-- /example -->

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/tutorials/state-and-storage.md) · Apache-2.0.
