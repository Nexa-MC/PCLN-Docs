using System.Buffers.Binary;
using System.Security.Cryptography;
using Nexa.Sidecar.Protocol;

// Wire recipes, separate from the small IPC peer. They do not grant production targets.
internal static class ContractRecipes
{
    internal static void Run()
    {
        var codec = new NoteCodec();
        var original = new Note(42, "A & <literal>");
        var dto = SidecarWireCodecs.Encode(codec, original);
        Check(SidecarWireCodecs.Decode(codec, dto) == original, "explicit versioned DTO");
        byte[] request = SidecarDataMessages.EncodeBinaryRequest(1, dto);
        var decoded = SidecarDataMessages.DecodeBinaryRequest(request);
        Check(decoded.ContractId == 1 && SidecarWireCodecs.Decode(codec, decoded.Value) == original, "binary request");
        byte[] reply = SidecarDataMessages.EncodeBinaryResult(true, dto, null);
        Check(SidecarDataMessages.DecodeBinaryResult(reply).Success, "binary result");

        // Full snapshot and deltas use the registered State codec, not a DTO envelope of their own.
        byte[] state = SidecarWireCodecs.Encode(SidecarWireCodecs.I32, 42);
        Check(SidecarStateSnapshot.DecodeBegin(SidecarStateSnapshot.EncodeBegin(1)) == 1, "snapshot count");
        var item = SidecarStateSnapshot.DecodeItem(SidecarStateSnapshot.EncodeItem(1, state));
        Check(item.ContractId == 1 && (int)SidecarWireCodecs.Decode(SidecarWireCodecs.I32, item.EncodedValue) == 42, "snapshot value");
        Check(SidecarDataMessages.DecodeStateDelta(SidecarDataMessages.EncodeStateDelta(1, state)).ContractId == 1, "state delta");
        var changed = new SidecarBinaryValue(SidecarWireCodecs.Utf8String,
            SidecarWireCodecs.Encode(SidecarWireCodecs.Utf8String, "changed"));
        Check(SidecarDataMessages.DecodeBinaryEvent(SidecarDataMessages.EncodeBinaryEvent(1, changed)).ContractId == 1, "event");

        var open = SidecarStreamMessages.DecodeOpen(SidecarStreamMessages.EncodeOpen(1,
            new(SidecarWireCodecs.I32, SidecarWireCodecs.Encode(SidecarWireCodecs.I32, 2)), 16));
        Check(open.ContractId == 1 && open.InitialCredit == 16, "stream open credit");
        for (ulong sequence = 1; sequence <= 2; sequence++)
        {
            var chunk = SidecarStreamMessages.DecodeChunk(SidecarStreamMessages.EncodeChunk(sequence, changed));
            Check(chunk.Sequence == sequence && chunk.Value.CodecId == SidecarWireCodecs.Utf8String, "ordered stream chunk");
        }
        Check(SidecarStreamMessages.DecodeEnd(SidecarStreamMessages.EncodeEnd(3, true, null)).NextSequence == 3, "stream end next sequence");
        Check(SidecarStreamMessages.DecodeCredit(SidecarStreamMessages.EncodeCredit(1)) == 1, "credit return");

        var document = new SidecarUiDocument("ui.resources.extension-card.v1", "Resource note", "A finite form.",
            new SidecarUiNode[] {
                new(1, 0, SidecarUiNodeKind.Stack, "Note panel"),
                new(2, 1, SidecarUiNodeKind.Text, "Current note", ValueState: "example.note.current"),
                new(3, 1, SidecarUiNodeKind.TextInput, "Edit note", Command: "example.note.set",
                    ValueState: "example.note.current", EnabledState: "example.note.enabled"),
                new(4, 1, SidecarUiNodeKind.Toggle, "Enabled", Command: "example.note.enable", ValueState: "example.note.enabled"),
                new(5, 1, SidecarUiNodeKind.Row, "Actions"),
                new(6, 5, SidecarUiNodeKind.Button, "Reset", Command: "example.note.set", Argument: "Ready")
            });
        byte[] uiBytes = document.Encode();
        var module = new SidecarRegistrationItem(SidecarRegistrationKind.UiModule,
            "example.note.panel", 0, 0, uiBytes, SHA256.HashData(uiBytes));
        var moduleCopy = SidecarRegistration.DecodeItem(SidecarRegistration.EncodeItem(module));
        Check(moduleCopy.Payload is not null && moduleCopy.ContentHash!.SequenceEqual(SHA256.HashData(moduleCopy.Payload))
            && SidecarUiDocument.Decode(moduleCopy.Payload).Nodes.Count == 6, "hashed schema-2 module");
        Check(SidecarUiCaptionPatch.Decode(SidecarUiCaptionPatch.Encode("Search notes")) == "Search notes", "caption patch");

        var signal = new SidecarHookSignal(Guid.NewGuid(), SidecarRegistrationKind.EventListen, 1, 1, "success");
        Check(SidecarHookSignal.Decode(signal.Encode()) == signal, "activation-owned signal");
        byte[] function = TitleSuffixProgram(" [example]");
        Check(function.AsSpan(0, 4).SequenceEqual("NFP1"u8), "finite function program");
        Check(CountIncrementProgram().AsSpan(0, 4).SequenceEqual("NFP2"u8), "primitive function program");

        var correlation = new SidecarCorrelationId(Guid.Parse("00112233-4455-6677-8899-aabbccddeeff"));
        var frame = new SidecarFrame(SidecarProtocol.Version, SidecarMessageType.QueryRequest,
            SidecarFrameTraits.None, correlation, request);
        byte[] buffer = new byte[SidecarFrameCodec.GetFrameSize(request.Length)];
        SidecarFrameCodec.Encode(frame, buffer);
        Check(buffer.AsSpan(0, 4).SequenceEqual(new byte[] { 0x50, 0x43, 0x58, 0x53 }), "published little-endian frame magic bytes");
        Check(buffer.AsSpan(12, 16).SequenceEqual(Convert.FromHexString("33221100554477668899AABBCCDDEEFF")), "cross-language GUID byte convention");
        Check(SidecarFrameCodec.Decode(buffer).CorrelationId == correlation, "framed correlation");
        Reject(() => new SidecarBinaryValue(SidecarWireCodecs.Bool, new byte[] { 2 }), "invalid Boolean");
        Check(double.IsNaN((double)SidecarWireCodecs.Decode(SidecarWireCodecs.F64,
            SidecarWireCodecs.Encode(SidecarWireCodecs.F64, double.NaN))), "wire F64 preserves IEEE NaN; business schemas must validate finiteness");
        Reject(() => new SidecarBinaryValue(SidecarWireCodecs.F64, new byte[4]), "wrong-sized F64");
        Reject(() => SidecarStreamMessages.EncodeCredit(17), "oversized stream credit");
        Reject(() => new SidecarUiDocument("ui.resources.extension-card.v1", "Bad", "Bad",
            new[] { new SidecarUiNode(2, 0, SidecarUiNodeKind.Text, "not contiguous") }), "invalid node identity");
        Console.WriteLine("PASS: codec, DTO, frames, state/event, stream credit/sequence, finite UI, signals and negative contracts.");
        Console.WriteLine("Codec checks do not prove Host target grants, UI execution, publisher trust or real flow control.");
    }

    // NFP1 RETURN: load current result; load suffix; concatenate; store result; end.
    internal static byte[] TitleSuffixProgram(string suffix)
    {
        byte[] text = SidecarWireCodecs.Encode(SidecarWireCodecs.Utf8String, suffix);
        if (text.Length > 1024) throw new ArgumentOutOfRangeException(nameof(suffix));
        using var bytes = new MemoryStream();
        bytes.Write("NFP1"u8); bytes.WriteByte(1); bytes.WriteByte(4);
        Span<byte> length = stackalloc byte[2];
        BinaryPrimitives.WriteUInt16LittleEndian(length, 5); bytes.Write(length);
        bytes.WriteByte(2); bytes.WriteByte(3);
        BinaryPrimitives.WriteUInt16LittleEndian(length, checked((ushort)text.Length)); bytes.Write(length); bytes.Write(text);
        bytes.WriteByte(4); bytes.WriteByte(6); bytes.WriteByte(8);
        return bytes.ToArray();
    }

    // NFP2 RETURN: one I64 argument/result, then result + I64(1), store result, end.
    internal static byte[] CountIncrementProgram()
    {
        using var bytes = new MemoryStream();
        bytes.Write("NFP2"u8);
        bytes.Write(new byte[] { 1, 4, 1, 3, 3, 5, 0 });
        bytes.Write(new byte[] { 2, 3, 3, 8, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 6, 8 });
        return bytes.ToArray();
    }

    private static void Check(bool valid, string name) { if (!valid) throw new InvalidDataException(name); }
    private static void Reject(Action action, string name)
    {
        try { action(); }
        catch (SidecarProtocolException) { Console.WriteLine("PASS: rejected " + name); return; }
        throw new InvalidOperationException("Expected rejection: " + name);
    }
}

internal sealed record Note(long Revision, string Text);

// Explicit DTO v1: field 1 schema U32, field 2 revision I64, field 3 text Str.
internal sealed class NoteCodec : ISidecarBinaryCodec<Note>
{
    public uint CodecId => SidecarWireCodecs.GeneratedDto;
    public byte[] Encode(Note value)
    {
        if (value.Revision < 0 || value.Text.Length > 120) throw new SidecarProtocolException("Invalid note.");
        using var writer = new SidecarPayloadWriter();
        writer.WriteUInt32(1, 1); writer.WriteInt64(2, value.Revision); writer.WriteString(3, value.Text);
        return writer.ToArray();
    }
    public Note Decode(ReadOnlySpan<byte> bytes)
    {
        var reader = new SidecarPayloadReader(bytes);
        uint schema = 0; long revision = -1; string? text = null;
        while (reader.HasMore)
        {
            var field = reader.ReadNext();
            switch (field.Id)
            {
                case 1: schema = field.ReadUInt32(); break;
                case 2: revision = field.ReadInt64(); break;
                case 3: text = field.ReadString(); break;
            }
        }
        if (schema != 1 || revision < 0 || text is null || text.Length > 120)
            throw new SidecarProtocolException("Unsupported or invalid note DTO.");
        return new(revision, text);
    }
}
