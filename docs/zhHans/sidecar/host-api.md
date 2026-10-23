# 数据编码与 Host API

## 数值与结果

| Codec ID | 内容 |
|---|---|
| 0 | 严格 UTF-8 字符串 |
| 1 | 一个字节的 Boolean，只能为 0/1 |
| 2 / 3 / 4 | 小端 Int32 / Int64 / Float64 |
| 5 | Bytes |
| 6 | 有明确架构契约的 DTO blob |

用 `SidecarBinaryValue` 和 `SidecarWireCodecs` 验证并持有数据；数据面不传 JSON、CLR 对象或反射调用。DTO 的编码必须由双方共享的稳定契约定义。

```csharp
var value = new SidecarBinaryValue(SidecarWireCodecs.I32,
    SidecarWireCodecs.Encode(SidecarWireCodecs.I32, 42));
byte[] request = SidecarDataMessages.EncodeBinaryRequest(1, value);
// 通过 SidecarConnection 发送 QueryRequest；接收端回复同一个 correlation ID。
```

命令和查询使用独立数字表。错误结果不能混成成功空字符串；稳定错误包括 `xsr.timeout`、`xsr.cancelled`、`xsr.sidecar_failed`、`xsr.contract_mismatch`、`xsr.handler_faulted`。远程错误不实例化为 CLR 异常类型。

## Host 组合侧路由

下表是 **Host 的 SidecarHostApi**，供启动器组合层使用，不是 Sidecar 可任意调用的文件系统或业务服务 RPC。`TryResolve` 一次后使用返回的数字 route ID。

| Command route | 请求 |
|---|---|
| `sidecar.command` | SidecarCommandCall |
| `sidecar.binary.command` | SidecarBinaryCall |
| `sidecar.stop` / `sidecar.restart` | SidecarPackageCall |
| `sidecar.reload` | SidecarReloadCall |

| Query route | 结果 |
|---|---|
| `sidecar.query` | string |
| `sidecar.binary.query` | SidecarBinaryValue |
| `sidecar.state.read` | SidecarStateRead |
| `sidecar.resource.read` / `sidecar.ui.read` | SidecarCachedContent |
| `sidecar.catalog` | IReadOnlyList&lt;SidecarPackageSnapshot&gt; |
| `sidecar.session` | SidecarSessionInfo |
| `sidecar.health` | TimeSpan |
| `sidecar.stream.open` | SidecarHostStream |

同步的 state/resource/ui/session 读取是已注册本地缓存读取，不发 IPC。异步接口接受取消；timeout、correlation 和会话身份共同决定请求生命周期。binary Command 路由返回普通命令完成语义，直接 SendBinaryCommandAsync 才额外携带已准入的二进制结果。

## 状态、事件和流

State 以匹配声明 codec 的初始快照和 StateDelta 更新；可替换状态允许合并至最新值，事件不能静默合并。流需要 Streams 位和 Stream 注册；StreamOpen 默认给 16 个 credit，chunk sequence 从 1 开始，StreamEnd 使用下一个期望序号。消费 chunk 后归还 credit，不得无限排队。

`ReadAllAsync` 只有一个消费者；必须观察 Completion，区分正常结束、取消、超时和会话失败。释放或取消需要清理已持有数据，并尽力发送 CANCEL。

完整请求类型、方法签名、预算及兼容入口见 [Host API 参考](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)。
