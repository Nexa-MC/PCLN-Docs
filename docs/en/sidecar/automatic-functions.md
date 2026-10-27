# NFP3 and automatic function catalogs

Alpha 14 instruments owned product assemblies after C# lowering and before trimming/NativeAOT. Each assembly ships a matching .nfp catalog. Sidecars still submit bounded programs: no CLR loading, runtime IL rewriting or synchronous IPC during execution.

## Select a verified target

Start with the exact argument/result behavior you need. Read the target build's catalog, require Instrumented status, check phase and parameter/result shapes, and negotiate AutomaticFunctions=32. Abstract, runtime-provided and infrastructure entries do not advertise executable bodies. Do not treat a signature-derived ID as a permanently stable public API.

The catalog is Brotli-compressed NPC1 binary with ID, canonical signature, result shape/traits, status, slot and parameters. An ID is function.auto. followed by the first 16 SHA-256 bytes of assembly-name and canonical signature, lowercase hex. Preserve overload and modifier identity rather than guessing.

NFP3 header: ASCII NFP3, ABI byte 1, phase byte, little-endian u16 instruction count. Phases are Head=1, Args=2, Tail=3, Return=4, Replace=5.

| Opcode | Operand | Behavior |
|---|---|---|
| 1 | u16 argument | Load typed argument |
| 2 | none | Load successful result |
| 3 | kind/u16 length/bytes | Primitive constant |
| 4 | none | Checked same-type add or bounded string concatenation |
| 5 | u16 argument | Store matching argument in Args |
| 6 | none | Store exactly matching result |
| 7 | none | Skip original in Head/Replace; supply non-void result first |
| 8 | none | Final End, empty stack, no trailing bytes |
| 9 | u16 argument | Load typed reference |
| 10 | none | Load typed-default marker |
| 11 | none | Compare known same-type primitives, produce Bool |

Constant kinds: String0, Bool1, I32-2, I64-3, Double4, Byte8, SByte9, I16-10, U16-11, U32-12, U64-13, Single14, Char15. Floating constants must be finite. No jumps, loops, calls, I/O, object deserialization, arbitrary addresses or casts exist.

## Example: add one to an Int64 result

Use only a catalog-confirmed Int64 result target supporting Return:

```csharp
using var bytes = new MemoryStream();
using (var writer = new BinaryWriter(bytes, System.Text.Encoding.UTF8, leaveOpen: true))
{
    writer.Write("NFP3"u8); writer.Write((byte)1); writer.Write((byte)4);
    writer.Write((ushort)5);
    writer.Write((byte)2);
    writer.Write((byte)3); writer.Write((byte)3);
    writer.Write((ushort)8); writer.Write(1L);
    writer.Write((byte)4); writer.Write((byte)6); writer.Write((byte)8);
}
byte[] program = bytes.ToArray();
```

Register FunctionPatch with this Payload, its complete SHA-256 and the exact catalog TargetSemanticId. Encoding grants no publisher trust or shape admission. NFP1/NFP2 recipes remain compatible with their explicit sites, not an equivalent description of automatic targets.

## Limits and retirement

16 KiB payload, 128 instructions, stack16, 4 KiB constant, 4096-character concatenation; 256 programs/session, 32/session/target, 64 active/pending hooks/target and 4096 total hooks.

Opaque managed values remain inside Host and can only be forwarded as exactly matching types. Byref-like/pointer/reference returns use compiler-owned typed tokens, never fabricated addresses. Constructors preserve CLR initialization. Async kickoff and MoveNext are distinct entries; a Task is not an awaited result.

Activation publishes an atomic batch flag. Deactivation clears it first; in-flight uncommitted changes from a retired program are discarded. Nonfatal program faults roll back that program and disable it for the activation. Original exceptions/cancellation retain their semantics and skip successful-return phases.

Verify catalog consistency, positive/negative shape cases, exceptions, cancellation, retirement races, unpatched allocation costs and real NativeAOT execution. A byte-encoding sample alone proves none of those execution properties.

Full contract: [automatic function instrumentation](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.14/docs/xsr/automatic-function-instrumentation.md).
