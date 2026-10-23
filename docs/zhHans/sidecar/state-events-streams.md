# 当前状态、事件与有背压的流

State 让新观察者立即知道当前事实；Event 描述一次发生；Stream 按消费能力提供连续结果。不能把三者都当成随意发送的消息。

## State：完整快照先于增量

假设注册两个 State：`example.note.current`（Utf8String，ID 1）与 `example.note.enabled`（Bool，ID 2）。快照 count=2，每项一次，最后结束：

```csharp
byte[] begin = SidecarStateSnapshot.EncodeBegin(2);
byte[] note = SidecarStateSnapshot.EncodeItem(1,
    SidecarWireCodecs.Encode(SidecarWireCodecs.Utf8String, "Ready"));
byte[] enabled = SidecarStateSnapshot.EncodeItem(2,
    SidecarWireCodecs.Encode(SidecarWireCodecs.Bool, true));
byte[] end = SidecarStateSnapshot.EncodeEnd();
```

按 Begin/Item/Item/End 各自消息类型发出，不是把四个 byte[] 拼成未定义 DTO。Host 核对覆盖、重复、codec 和预算后原子提交。重复一项同时漏另一项不能通过。

Active 后用 `SidecarDataMessages.EncodeStateDelta(contractId, encodedValue)` 更新单项，类型由注册固定。Host 分配本地 revision/availability；Renderer 只读镜像，不逐帧请求。

## 值、可用性与一致性

HasValue、Availability、Revision 是不同信息。Stale/Unavailable 的旧值不代表新鲜成功；停止、失败、注销会使动态事实失效，新会话完整注册/快照后再激活。

只有可替换状态（如进度）可合并到最新值。多个需要同时变化的事实应设计明确 DTO 或有序契约；不能假设独立 StateDelta 是通用多格事务。

## Event：不能取代当前事实

```csharp
var changed = new SidecarBinaryValue(SidecarWireCodecs.Utf8String,
    SidecarWireCodecs.Encode(SidecarWireCodecs.Utf8String, "changed"));
byte[] notification = SidecarDataMessages.EncodeBinaryEvent(1, changed);
```

Event ID=1 是 Event 表序号，需要已注册该事件并协商 BinaryPayloads；兼容文本用 EncodeEvent。Host 事件观察者必须快速返回，重 IO 交给自己的有界队列，不阻塞接收循环。

提交成功可发 Event，当前便签仍用 State。事件不能像进度一样静默丢弃或合并；也不能假定未声明的持久重放和 exactly-once 语义。

## Stream：打开参数与结果类型

```csharp
var declaration = new SidecarRegistrationItem(
    SidecarRegistrationKind.Stream, "example.note.history", 0, SidecarWireCodecs.I32)
    { ResultCodecId = SidecarWireCodecs.Utf8String };
```

这里 I32 参数请求历史条数，chunk 是 UTF-8。Streams 位独立于 BinaryPayloads。Host 打开时默认给 16 credit，每发送一块扣 1，消费后归还；没有 credit 就暂停，不先塞进无限队列。

## 完整序号/credit 时序

```text
Host → StreamOpen(contract=1, argument=2, credit=16), correlation=C
Peer → StreamChunk(sequence=1, value="first"), C      剩余15
Peer → StreamChunk(sequence=2, value="second"), C     剩余14
Host → StreamCredit(1), C                            消费一项后返还
Peer → StreamEnd(nextSequence=3, success=true), C
```

序号从 1 开始；End 是下一预期序号，不是最后一个。流内所有消息保留 C，不能每块创建新 GUID。连续发送 17 块后才等待消费会违反首批 credit。

## Host 组合侧的消费实例

以下假设已经提供已准入的 api、package 和调用者 token：

```csharp
var opened = await api.OpenStreamAsync(new(package,
    XsrSemanticId.Parse("example.note.history"),
    new SidecarBinaryValue(SidecarWireCodecs.I32,
        SidecarWireCodecs.Encode(SidecarWireCodecs.I32, 2))), token);
if (!opened.IsSuccess) return;
await using var stream = opened.Value!;
await foreach (var value in stream.ReadAllAsync(token)) {
    Console.WriteLine((string)SidecarWireCodecs.Decode(value.CodecId, value.Span));
}
var completion = await stream.Completion;
// 检查 completion.IsSuccess / Error，不能以枚举结束自动判断远程成功。
```

一个流只有一个消费者。完整可编译回调版本在 Authoring Lab 的 HostApiRecipes.cs。消费循环属于组合/业务异步任务，不放在 Renderer 帧回调。

## 结束、取消与未读数据

Completion 区分正常结束、远程拒绝、取消、超时和会话丢失。提前退出/放弃消费必须 DisposeAsync，释放排队值并尽力发送 CANCEL。

完成但未读的 chunk 仍占额度，直到读出、释放，或退役时转移给已有句柄；不能无界保留旧流，更不能把旧数据当新激活结果。

## 实际预算与验证

每会话最多 16 流，每流最多 16 排队块，单块 ≤65535 字节，全会话缓冲 ≤4 MiB。默认超时 30s，上限 5 分钟。重复/跳号、错误 codec、超 credit 或超预算属于协议错误，不是可忽略损失。

--recipes 验证编码/边界。真实背压需在受控 Host 中延迟消费者、耗尽额度、取消和断连，观察生产暂停及资源释放；不能把编码回环当长期流压力证据。


## 实现依据

- [Nexa.Sidecar.Protocol/SidecarDataMessages.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarDataMessages.cs)
- [Nexa.Sidecar.Protocol/SidecarStreamMessages.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarStreamMessages.cs)
- [Nexa.Xsr.Runtime/Sidecar/SidecarHostSession.Streams.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Runtime/Sidecar/SidecarHostSession.Streams.cs)
