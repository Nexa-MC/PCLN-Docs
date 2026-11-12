# Add a page and a confirmed action

Start with the project from [the first tutorial](../quickstart.md). This chapter
explains how its three registrations form a working feature and how to change it
without breaking identity, lifecycle or confirmation.

## Follow the initialization chain

Read `wasm/plugin.c` in the template. It uses three buffers: incoming values,
outgoing continuation messages and argument construction. They are separate because
serializing a continuation must not overwrite the argument it is serializing.

During `Initialize`, the guest asks `Files.OpenPackageFile` for `page.nxml`. The
Host returns a `FileRef` to the verified package asset. The next resume call decodes
that reply and constructs `UIPage`, then calls `UI.RegisterPage`. Only after that
reply succeeds does it call `Actions.Register`.

The `step` integer retains which reply is expected. Model views are borrowed from
the input buffer; do not retain a `FileRef` byte view across another resume. Build
the next request while the current view is valid, or copy the required owned data.
A failed registration ends initialization unsuccessfully so the Host can discard
the staged contributions together.

## Connect the button to its action

The complete page is `wasm/page.nxml`. Its button uses this command binding:

```xml
<Button Key="ExamplePluginAction"
        Content="Run action / 执行操作"
        Command="ui.plugin.action"
        Argument="{{PLUGIN_ID}}:hello"
        Width="220" Height="44" />
```

`{{PLUGIN_ID}}` is a template build substitution, not an NXML runtime expression.
`Key` identifies the UI element. `Argument` identifies the registered action.
Changing the visual label does not change the action; changing `Argument` requires
a matching registration. The Host owns rendering, input and command dispatch.

## Understand the action descriptor

The descriptor declares an Empty input schema and TextResult output schema. Its
handler is callback `1`, its effect classification is read-only, and confirmation
is `UserConfirmation`. Read-only means the callback should not perform a mutation;
it does not suppress an explicitly requested confirmation.

When the Host dispatches callback 1, the guest builds a TextResult and returns it
with `nx_handler_success`. Returning another schema is a failure even if its bytes
look like text. The Host supplies the invocation identity and remaining budget.
Do not accept a caller identity from an input field as authority.

## Make a controlled edit

Change the callback string to `Notes action completed`, rebuild, reload, and invoke
the button. Keep the output schema unchanged. Check approval, decline and unload
again. If you add an input field later, update the descriptor, input producer and
handler decoder together; changing only the C decoder leaves an invalid contract.

For a real write action, declare its actual effect and use the relevant business
plan API. Do not classify writes as read-only to avoid idempotency or confirmation.
See [preparing a mutation](../how-to/mutations.md).

## Why no page appears before activation

Initialization stages the page and action. Atomic activation publishes them after
all required participants pass their checks. A page that flashes briefly during a
failed load would expose an incomplete plugin; staging prevents that outcome.
After stop, its registration belongs to a retired load and cannot be reused.

The SDK's `samples/WasmDesktop` is the fixed-identity source behind this example.
`samples/WasmAdvancedUi` adds components and dialogs; build it with
`python eng/build_wasm_sample.py --clang clang` from the SDK repository. Use it only
after the basic page works, so additional permissions and assets have a known baseline.

## Complete source

The following is synchronized with `samples/WasmDesktop/plugin.c` and compiled by SDK CI.

<!-- example:samples/WasmDesktop/plugin.c language:c -->
```c
#include <nexa/abi100.h>
static nx_u8 input[65536], output[65536], arguments[32768];
static int step;
NX_EXPORT("nexa_alloc") nx_u32 nexa_alloc(nx_u32 size) { nx_require(size<=sizeof input); return (nx_u32)(__UINTPTR_TYPE__)input; }
NX_EXPORT("nexa_resume") nx_u64 nexa_resume(nx_u32 address,nx_u32 size) {
 nx_require(address==(nx_u32)(__UINTPTR_TYPE__)input && size<=sizeof input);
 nx_value message=nx_decode(input,size); nx_writer reply={output,0,sizeof output},args={arguments,0,sizeof arguments}; nx_call_options options={0};
 if(nx_is_string(nx_field(message,"kind"),"reply")) {
  if(!nx_reply_success(message)) {step=0;nx_complete_error(&reply,nx_reply_error(message));}
  else if(step==1) {
   nx_FileRef file;nx_require(nx_Files_OpenPackageFile_result(message,&file));
   nx_UIPage page=nx_UIPage_write(&args,nx_literal("example.desktop:home"),file,nx_schema_Empty(&args),nx_QualifiedIdArray_write(&args,0,0));
   options.idempotency_key="page";step=2;nx_UI_RegisterPage(&reply,page,&options);
  } else if(step==2) {
   nx_stringArray strings=nx_stringArray_write(&args,0,0);
   nx_LocalizedText title=nx_LocalizedText_write(&args,nx_literal("Run sample action"),nx_NamedValueArray_write(&args,0,0));
   nx_ActionDescriptor action=nx_ActionDescriptor_write(&args,nx_literal("example.desktop:hello"),nx_schema_Empty(&args),nx_schema_TextResult(&args),strings,strings,nx_IdempotencyMode_ReadOnly,1,0,nx_ConfirmationRequirement_UserConfirmation,nx_QualifiedIdOptional_none(&args),title,nx_ulongOptional_some(&args,1));
   options.idempotency_key="action";step=3;nx_Actions_Register(&reply,action,&options);
  } else {step=0;nx_complete(&reply,1);}
 } else if(nx_is_string(nx_field(message,"kind"),"handler")) {
  nx_require(nx_handler_id(message)==1);nx_TextResult value=nx_TextResult_write(&args,nx_literal("Desktop action completed"));nx_handler_success(&reply,value.value);
 } else if(nx_is_string(nx_field(message,"phase"),"Initialize")) {
  step=1;nx_Files_OpenPackageFile(&reply,nx_PackageFileRequest_write(&args,nx_literal("page.nxml")),&options);
 } else nx_complete(&reply,1);
 return nx_result(&reply);
}
```
<!-- /example -->

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/tutorials/page-and-action.md) · Apache-2.0.
