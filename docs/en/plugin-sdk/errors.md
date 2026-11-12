# Diagnose a failed load or operation

Start with the first structured failure and its phase. A later cleanup error can
hide the initiating problem if logs only retain the final exception. Preserve both
without treating an empty/default result as success.

## Record enough context

Capture the plugin ID and version, SDK version, launcher build, phase, error code,
operation/correlation ID and relevant load report. Include the smallest source or
package that reproduces the issue. Remove account tokens, grants, private file
contents and encrypted delivery keys before sharing logs.

`AbiReply<T>.Success` determines whether Value may be used. In C/Wasm, test
`nx_reply_success` before the generated result reader and preserve
`nx_reply_error` when decoding fails. Do not replace a failed list call with an
empty list: that tells the user data is absent when access actually failed.

## Find the failing boundary

| Observation | Check first | Recovery |
| --- | --- | --- |
| Compiler cannot find wasm-ld | LLVM installation and PATH | Install/select the linker; do not change manifest permissions |
| SDK cache or ZIP digest mismatch | Pinned release and actual bytes | Rebuild or restore verified bytes; do not skip integrity checks |
| Required capability unavailable | Host build and negotiated contract/version | Use a compatible Host or reduce the required feature set |
| Permission denied | Exact per-operation permission and target grant | Explain the denied feature; request access through the supported Host flow |
| STAGE_FROZEN or wrong phase | Saved view, callback stage and invocation lifetime | Move work to the permitted callback; obtain the current scope |
| Invalid schema | Declared schema, model encoder and fingerprint | Update producer and consumer together |
| Invalid/foreign handle | Issuing load, handle type and resource lifetime | Reacquire in the current load; never fabricate a replacement |
| Revision conflict | Target changed after read/preview | Re-read, reconcile and prepare a fresh plan |
| Callback never runs | Activation, handler ID, registration and confirmation outcome | Verify the descriptor chain; decline is a valid non-dispatch outcome |
| Provider unavailable | Provider activation, deadline and family support | Keep feature unavailable or select an explicitly supported provider |
| Watch reports a gap | Queue overflow, retention or restart | Read an authoritative snapshot and resume from a valid cursor |
| OUTCOME_UNKNOWN | Operation record and external state | Reconcile; do not automatically replay the effect |

Exact codes and details come from the Host error. The table describes diagnostic
categories, not an assertion that every Host emits one identical code for each row.

## Separate timeout from failure of the effect

A deadline bounds waiting and execution admission. An external effect may already
have occurred when a reply is lost or the callback is interrupted. Inspect the
owned task or journal. Preserve unknown outcomes until evidence resolves them.
Cancellation requests termination; it does not prove rollback.

## Reproduce the smallest failing sequence

Start with the unchanged template on the same Host. If it works, add the failing
capability and one call with the same permission and scope. Test the successful
path, then the precise denied/conflicting/cancelled case. For UI issues, verify the
package asset and action ID before investigating rendering internals.

The SDK tests establish codecs and facade behavior. Runtime and Desktop integration
tests establish execution and application behavior. Report which layer you tested
so a passing mock response is not mistaken for a working launcher feature.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/errors.md) · Apache-2.0.
