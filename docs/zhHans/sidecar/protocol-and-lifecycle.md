# 协议、注册与完整生命周期

实现独立 peer 前先确定：每个阶段谁发送、谁验证、何时发布、失败如何退役。协议常量、头版本与功能位是兼容契约，不是作者可随意调整的配置。

## 启动到激活的时序

```text
Host                        Sidecar
bind 随机端点 → 启动子进程 → 从 stdin 接收一次性证明
认证 IPC 首 32 字节  ←────── Bootstrap.ConnectAsync
HELLO ────────────────────→ 检查 version/features
      ←──────────────────── WELCOME
      ←──────────────────── REGISTER_BEGIN / ITEM* / END
      ←──────────────────── STATE_SNAPSHOT_BEGIN / ITEM* / END
READY ────────────────────→ 注册与初始事实已完整准入
ACTIVATE ─────────────────→ 允许执行已授权业务
```

Host 在全批声明、哈希、引用、目标和完整快照通过前不发布部分镜像。peer 不能在构造/注册阶段启动需要激活权限的行为。没有 State 也发送零项快照。

## 所有功能位

| Feature | 位 | 要求 |
| --- | --- | --- |
| BinaryPayloads | 1 | 二进制 Command/Query/Event 与声明 codec |
| Streams | 2 | Stream 注册与 Open/Chunk/End/Credit |
| Health | 4 | Ping/Pong |
| Unregistration | 8 | Unregister/Unregistered |

WELCOME 确认 HELLO 与 peer 能力的交集；字段缺省是 None，不能假设“version=1 所以 All”。这些位彼此独立：Stream 不额外要求 BinaryPayloads；初始 typed State 也不依赖二进制命令位。UI Toggle 因 Boolean Command 需要 BinaryPayloads。

## 所有注册种类与字段

| Kind | 数值 | 注册作用 |
| --- | --- | --- |
| Command / Query | 1 / 2 | 请求效果 / 一次结果 |
| State / Event | 3 / 4 | 当前事实 / 瞬时事实 |
| UiModule / Resource | 5 / 6 | 已哈希的有限文档 / 资源缓存 |
| UiPatch | 7 | 有限标题补丁 |
| EventCatch / EventListen | 8 / 9 | 获准事件匹配/观察 |
| IntentCatch / IntentWait | 10 / 11 | 获准意图捕获/激活内一次等待 |
| FunctionPatch | 12 | 显式站点的有限函数程序 |
| Stream | 13 | credit 控制的连续结果 |

RegisterItem TLV 字段依次为：1 Kind(U32)、2 SemanticId(Str)、3 Flags(U32)、4 CodecId(U32)、5 Payload(Bytes)、6 ContentHash(Bytes)、7 RequiredResources(Str)、8 TargetSemanticId(Str)、9 ResultCodecId(U32)。后五项按种类使用；缺少结果 codec 保留为 0。

Command/Query 的 CodecId 表示参数，ResultCodecId 表示结果；State/Event 用自己的值 codec；Stream 是打开参数和 chunk codec。扩展 Payload 与 SHA-256、有限 Target 必须和 Host 准入一致。

## 数字 ID 示例

若声明顺序为 Command set、State text、Query echo、State enabled，则 Command set=1、Query echo=1、State text=1、State enabled=2。按种类从 1 递增，不是全批统一递增。后续消息不再发送语义字符串来查找方法。

同一注册表可在停用后重新激活，但新进程/会话必须完整注册和快照，重建所有数字映射。不能把本次 Stream ID 当下一会话仍有效。

## 帧头完整格式

固定 32 字节，小端数值：

| offset | 长度 | 字段 |
| --- | --- | --- |
| 0 | 4 | Magic=`0x53584350`，小端字节为 `50 43 58 53` |
| 4 | 2 | Header version，当前 1 |
| 6 | 2 | Protocol version，当前 1 |
| 8 | 2 | Message type |
| 10 | 2 | Traits/flags |
| 12 | 16 | 已分配的 correlation GUID，使用库的 Guid 字节约定 |
| 28 | 4 | Payload length，最大 16 MiB |

使用 `SidecarFrameCodec`，跨语言实现按库样本逐字节比较，不能把 UUID 文本或另一种字节顺序直接放入头。例如 GUID `00112233-4455-6677-8899-aabbccddeeff` 在线上是 `33 22 11 00 55 44 77 66 88 99 aa bb cc dd ee ff`。--recipes 验证这个固定样本。每一帧都需要非零相关 ID，控制帧也一样。头校验先于载荷分配。

Compressed/Final 是当前已定义的 traits；Transport 不实现自动压缩解压。未知消息编号、版本或未定义 bit 被拒绝。“未知 TLV 可跳过”不等于未知帧类型也能执行。

## TLV 与所有消息编号

每个字段为 u16 ID、u8 tag、u16 长度及内容，字段 ID 严格递增且唯一。未知字段按长度跳过，必需字段与已知类型仍校验。单个字符串/Bytes/value 最多 65535 字节，不能因为帧上限 16 MiB 就发送 16 MiB 单值。

字段 tag 编号为 Boolean=1、U32=2、U64=3、I64=4、F64=5、Str=6、Bytes=7、Id128=8；它们与值 codec 0–6 是不同编号空间，不要混用。已知字段使用错误 tag 会失败。

| 消息 | 数值 |
| --- | --- |
| Hello/Welcome | 1/2 |
| RegisterBegin/Item/End | 8/9/10 |
| Ready/Activate/Deactivate | 11/12/13 |
| StateSnapshotBegin/Item/End | 14/15/18 |
| HealthPing/HealthPong | 16/17 |
| Cancel | 19 |
| Unregister/Unregistered | 20/21 |
| Crash/Error/Shutdown | 24/25/30 |
| CommandRequest/Result | 64/65 |
| QueryRequest/Result | 66/67 |
| StateDelta/Event/HookSignal | 72/73/74 |
| StreamChunk/Open/End/Credit | 80/81/82/83 |

JSON 可用于配置和诊断，不作为生产数据面；不传 CLR 对象、反射方法名或固定内存 struct。

## 预算、超时与背压

| 项目 | 默认 / 上限 |
| --- | --- |
| 发现/原生文件/签名 | 64 项 / 512 MiB / 64 KiB |
| Supervisor 启动准入 | 每候选 30s |
| Session 握手/注册/关闭 | 10s / 30s / 2s |
| 注册项/语义 ID/注册载荷 | 4096 / 256 字符 / 合计 32 MiB |
| 初始快照 | 独立 32 MiB，精确覆盖全部 State |
| Transport 待写 | 64 |
| Command/Query 待定 | 默认 1024 |
| Command/Query 截止时间 | 默认 30s，可指定正值，受 .NET timer 上限约束 |
| Stream/Health 超时 | 默认 30s/5s，上限 5 分钟 |
| Stream | 每会话 16、每流 16 排队 chunk、合计 4 MiB 缓冲 |
| Health | 最多 32 待定检查，同时受共享交换准入限制 |
| CANCEL/credit 最佳努力发送 | 独立 100ms |

Host 可以降低预算，peer 不能自行加大。请求截止时间覆盖发送与等待，不仅覆盖“开始等结果之后”。

## 关闭与故障

停用先撤销本地执行/展示授权，再按有界顺序发送 DEACTIVATE；支持注销时交换 UNREGISTER/UNREGISTERED，最后 SHUTDOWN 并等待退出。仅调用同步 Dispose 不代表异步退出已完成，需要完成证据时等待相应 ShutdownAsync/DisposeAsync。

取消发生在写锁等待或 IO 准入前，不会破坏尚未使用的连接；一旦帧 IO 已开始，中断可能留下半帧，Transport 关闭连接而不是继续复用。Crash 是会话终止；结构化 Error 可只结束相关交换。所有终止路径完成待定工作，旧结果不能恢复已关闭会话。


## 实现依据

- [Nexa.Sidecar.Protocol/SidecarProtocol.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarProtocol.cs)
- [Nexa.Sidecar.Protocol/SidecarFrameCodec.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarFrameCodec.cs)
- [Nexa.Sidecar.Protocol/SidecarRegistration.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarRegistration.cs)
- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
