# 协议与生命周期

## 启动顺序

```text
Host 先绑定随机、当前用户可访问的 IPC
  → 启动 .nsc --nexa-sidecar --endpoint <endpoint>
  → stdin 交付 32 字节一次性挑战，Sidecar 经 IPC 回显
  → Host HELLO / Sidecar WELCOME
  → REGISTER_BEGIN / ITEM* / END
  → STATE_SNAPSHOT_BEGIN / ITEM* / END
  → Host READY / ACTIVATE
  → ACTIVE
  → DEACTIVATE / UNREGISTER / UNREGISTERED / SHUTDOWN
```

用 `SidecarBootstrap.ConnectAsync(endpoint, Console.OpenStandardInput(), token)` 完成连接与证明；不要把挑战写进参数、环境变量、日志或 UI。

WELCOME 必须回复 HELLO 的 correlation ID，协商协议版本与 feature 交集。当前可选位：BinaryPayloads=1、Streams=2、Health=4、Unregistration=8。只宣布自己真正实现的位；未协商的接口不能发送请求字节。

## 帧与注册

使用 `SidecarFrame`、`SidecarConnection.SendAsync/ReceiveAsync` 和协议 codec，不自行拼一个固定 CLR 结构体作为 ABI。帧包含版本、消息类型、flags、correlation 和 payload 长度；字段采用可扩展编码，未知可选字段按 codec 规则跳过。

| Kind | 数字 | 内容 |
|---|---|---|
| Command / Query / State / Event | 1 / 2 / 3 / 4 | 业务契约及 codec |
| UiModule / Resource | 5 / 6 | 内联内容与 SHA-256 |
| UiPatch | 7 | 宿主允许的展示补丁 |
| EventCatch / EventListen | 8 / 9 | 显式授予的事件目标 |
| IntentCatch / IntentWait | 10 / 11 | 显式授予的 intent 目标 |
| FunctionPatch | 12 | 有限函数补丁 ABI |
| Stream | 13 | 输入、输出 codec 与流协商 |

数字 ID 按 kind 在每个会话中分配；重连后重新解析。所有声明及快照完整验证后才发布镜像，失败不能留下半套注册。无 State 也必须发送 BEGIN(0)/END。

## 激活、取消、恢复

构建与注册阶段保持轻量，不提前执行 Host 能力。业务工作从 ACTIVATE 开始；DEACTIVATE 后停掉工作和流。按 correlation ID 管理每个在途操作；收到 CANCEL 时取消对应工作，不取消整个进程的其他请求。

会话断开会退役其缓存、镜像与展示租约。重启要重新验签、握手和注册，不能复用旧实体、缓存引用或数字 ID。超时和协议错误是会话失败，不应转成某个成功空结果。

[协议说明](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-protocol.md) · [引导与签名](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nsc-and-regional-policy.md)。
