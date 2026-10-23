# Host API 完整参考

SidecarHostApi 属于 **Host 组合层**：启动器调用已准入 Sidecar。它不是子进程任意调用 Host 账户、文件或安装服务的 RPC。Renderer 不持有此 API；独立 peer 只引用 Protocol/Transport。

本页最后给出覆盖全部 14 条路由的完整可编译代码。例子中 api 由组合层提供，package 为已准入的文件名去掉 .nsc，不是任意路径或显示名称。

## 构造与一次解析

构造函数为 `SidecarHostApi(SidecarSupervisor supervisor, IXsrDispatchObserver? observer = null)`，暴露 Commands、Queries、PackageSnapshots。将语义路由用 TryResolve 解析为 XsrCommandId/XsrQueryId，真实组合可在封闭注册后缓存；这些数字不等于 peer 的逐种类 ID。

## 全部路由、类型与字段

| 路由 | 请求类型 | 响应/效果 |
| --- | --- | --- |
| sidecar.command | SidecarCommandCall | 文本命令，XsrResult |
| sidecar.binary.command | SidecarBinaryCall | 二进制命令，路由保留普通动作完成语义 |
| sidecar.stop | SidecarPackageCall | 停止并关闭自动恢复 |
| sidecar.restart | SidecarPackageCall | 重新验证并建立新会话 |
| sidecar.reload | SidecarReloadCall | 重扫原目录 |
| sidecar.query | SidecarQueryCall | string |
| sidecar.binary.query | SidecarBinaryCall | SidecarBinaryValue |
| sidecar.state.read | SidecarContractCall | SidecarStateRead |
| sidecar.resource.read | SidecarContractCall | SidecarCachedContent |
| sidecar.ui.read | SidecarContractCall | SidecarCachedContent |
| sidecar.catalog | SidecarCatalogQuery | IReadOnlyList&lt;SidecarPackageSnapshot&gt; |
| sidecar.session | SidecarPackageCall | SidecarSessionInfo |
| sidecar.health | SidecarHealthCall | TimeSpan 往返时延 |
| sidecar.stream.open | SidecarBinaryCall | SidecarHostStream |

| 请求 | 全部字段 |
| --- | --- |
| SidecarCommandCall / SidecarQueryCall | PackageName、XsrSemanticId Contract、可选 string Argument、可选 TimeSpan Timeout |
| SidecarBinaryCall | PackageName、Contract、可选 SidecarBinaryValue Argument、可选 Timeout |
| SidecarContractCall | PackageName、Contract |
| SidecarPackageCall | PackageName |
| SidecarHealthCall | PackageName、可选 Timeout |
| SidecarCatalogQuery / SidecarReloadCall | 无字段 |

省略参数不会自动制造契约所需的 I32/Bool 值。异步接口接受取消；参数、结果 codec 与注册必须一致。

## 1. 文本命令

SendCommandAsync 直接返回最终 XsrResult。经 Commands.Dispatch 调用则返回 XsrCommandDispatch，其中 Acceptance 为立即准入、Completion 为最终动作完成、CorrelationId 用于关联。只检查 Acceptance 会漏掉执行失败；不等待业务完成也不能丢弃其错误。

对应完整代码的 RoutedTextCommandAsync：先解析路由，检查 Acceptance，再等待 Completion。它提交便签，不伪装成 Query。

## 2. 二进制命令

SendBinaryCommandAsync 直接返回 XsrResult&lt;SidecarBinaryValue&gt;，可以得到已准入的返回值。sidecar.binary.command **路由**只保留普通 XsrResult 动作完成语义；需要二进制结果时使用直接方法。该差异是设计，不要改成另一种返回泛型来绕过。

BinaryCommandAsync 使用 Bool 参数调用 example.note.enable，需要已注册 Boolean 输入与正确结果 codec，并协商 BinaryPayloads。

## 3–4. 文本与二进制查询

SendQueryAsync 返回 string；SendBinaryQueryAsync 返回 SidecarBinaryValue。例子 TextQueryAsync 请求一次摘要，EchoAsync 发送 Int32 42。结果应在 IsSuccess 后读取；错误不是空值成功。

查询有取消/超时，只用于一次性结果。持续显示的数据应为 State；不要每帧执行摘要或健康查询。

## 5. 本地状态读取

ReadState 返回 SidecarStateRead：Revision、Availability、HasValue、可选 Value。没有 IPC，也不执行远程属性 getter。读取旧值时仍检查可用性，不能把 Stale 的最后值描述为本次操作成功。

CurrentNote 的输入是 State 语义 ID，不是 Query ID。路由 sidecar.state.read 也是同一已登记镜像读取。

## 6–7. 资源与 UI 缓存

ReadResource、ReadUiModule 只查当前注册缓存，不打开任意文件，也不向 peer 请求页面。SidecarCachedContent 提供 Length、只读 Span、SHA-256 ContentHash、复制型 ToArray。

缓存字节已通过注册来源/哈希/预算检查。mutable byte[] 兼容入口返回副本，不能修改已准入存储。读取 UI 字节不等于取得展示授权；执行模块仍需 UiModuleAdmission 与有效会话。

## 8. 目录监督状态

PackageSnapshots 或 sidecar.catalog 本地返回不可变目录观测。每项含 PackageName、Status、可选 SessionId/ProcessId、RecoveryAttempts、FailureCode，不含业务载荷。

Status 为 Discovered、Starting、Active、Stopped、Failed、Recovering、Quarantined、Removed。CatalogAsync 展示 QueryAsync 的明确请求/响应类型；真实组合在初始化时解析并缓存 catalogId。

## 9. 会话观测

ReadSession 返回 SessionId、State、协商 Features、不可变 Contracts 与 Metrics。用于当前诊断，不表示下一次重启仍沿用同一映射。新的 SessionId 必须触发上层旧结果隔离。

## 10. 健康检查

PingAsync 返回 nonce 相关的往返时延，默认 5s、最多 5 分钟、最多 32 待定检查并受共享额度约束。Pong 只证明控制循环能响应，不证明某个网络服务可用或所有业务成功。

## 11. 打开流

OpenStreamAsync 返回具有所有权的 SidecarHostStream，要求 Streams 与对应注册。一个 ReadAllAsync 消费者，检查 Completion，await using 释放。完整代码允许异步 consume 回调，避免重工作堵接收路径。详见[流时序](./state-events-streams)。

## 12. 停止包

StopAsync 停止已准入包并禁用自动恢复，直至显式重启。不存在与当前不可用是不同错误。此操作不是给任意 peer 发送名为 stop 的文本命令。

## 13. 重启包

RestartAsync 停止旧实例，重新验证原生文件与签名，完成新会话/注册/快照。旧 UI exposure 与数字 ID 退役。不能因先前验证成功就跳过新文件检查。

## 14. 重新发现

ReloadAsync 重扫最初绑定的发现目录，没有新的 peer 路径参数。新包、移除身份、重名/歧义和签名失败按监督规则处理，不能用重扫绕过 trust。

## 完整可编译应用代码

该文件编入 Authoring Lab，**实验程序不会自动调用这些方法操作真实包**。在自己的 Host 组合项目中提供已授权依赖；Sidecar 端不能照抄成直接服务访问。
```csharp
using Nexa.Sidecar.Protocol;
using Nexa.Xsr;
using Nexa.Xsr.Runtime;

// Compilable Host-side integration snippets. The portable lab never automatically stops,
// restarts, reloads or invokes real packages. A child Sidecar does not receive this API.
public static class HostApiRecipes
{
    public static async ValueTask<XsrResult> RoutedTextCommandAsync(
        SidecarHostApi api, string package, CancellationToken token)
    {
        if (!api.Commands.TryResolve(SidecarHostRoutes.Command, out var route))
            return XsrResult.Failure(XsrRuntimeErrors.RouteNotFound());
        var dispatch = api.Commands.Dispatch(route,
            new SidecarCommandCall(package, XsrSemanticId.Parse("example.note.set"), "Ready"),
            cancellationToken: token);
        if (!dispatch.Acceptance.IsSuccess) return dispatch.Acceptance;
        return await dispatch.Completion;
    }

    public static ValueTask<XsrResult<string>> TextQueryAsync(SidecarHostApi api, string package, CancellationToken token) =>
        api.SendQueryAsync(new(package, XsrSemanticId.Parse("example.note.summary"), "current", TimeSpan.FromSeconds(3)), token);

    public static ValueTask<XsrResult<SidecarBinaryValue>> EchoAsync(SidecarHostApi api, string package, CancellationToken token) =>
        api.SendBinaryQueryAsync(new(package, XsrSemanticId.Parse("example.echo"),
            new(SidecarWireCodecs.I32, SidecarWireCodecs.Encode(SidecarWireCodecs.I32, 42)), TimeSpan.FromSeconds(3)), token);

    public static ValueTask<XsrResult<SidecarBinaryValue>> BinaryCommandAsync(SidecarHostApi api, string package, CancellationToken token) =>
        api.SendBinaryCommandAsync(new(package, XsrSemanticId.Parse("example.note.enable"),
            new(SidecarWireCodecs.Bool, SidecarWireCodecs.Encode(SidecarWireCodecs.Bool, true))), token);

    public static XsrResult<SidecarStateRead> CurrentNote(SidecarHostApi api, string package) =>
        api.ReadState(new(package, XsrSemanticId.Parse("example.note.current")));

    public static XsrResult<SidecarCachedContent> Resource(SidecarHostApi api, string package) =>
        api.ReadResource(new(package, XsrSemanticId.Parse("example.note.icon")));

    public static XsrResult<SidecarCachedContent> Ui(SidecarHostApi api, string package) =>
        api.ReadUiModule(new(package, XsrSemanticId.Parse("example.note.panel")));

    public static ValueTask<XsrResult<IReadOnlyList<SidecarPackageSnapshot>>> CatalogAsync(SidecarHostApi api, CancellationToken token)
    {
        if (!api.Queries.TryResolve(SidecarHostRoutes.Catalog, out var route))
            return ValueTask.FromResult(XsrResult.Failure<IReadOnlyList<SidecarPackageSnapshot>>(XsrRuntimeErrors.RouteNotFound()));
        return api.Queries.QueryAsync<SidecarCatalogQuery, IReadOnlyList<SidecarPackageSnapshot>>(
            route, new(), cancellationToken: token);
    }

    public static XsrResult<SidecarSessionInfo> Session(SidecarHostApi api, string package) => api.ReadSession(package);

    public static ValueTask<XsrResult<TimeSpan>> HealthAsync(SidecarHostApi api, string package, CancellationToken token) =>
        api.PingAsync(new(package, TimeSpan.FromSeconds(2)), token);

    public static async ValueTask<XsrResult> ConsumeStreamAsync(SidecarHostApi api, string package,
        Func<SidecarBinaryValue, ValueTask> consume, CancellationToken token)
    {
        var opened = await api.OpenStreamAsync(new(package, XsrSemanticId.Parse("example.note.history"),
            new(SidecarWireCodecs.I32, SidecarWireCodecs.Encode(SidecarWireCodecs.I32, 2)), TimeSpan.FromSeconds(10)), token);
        if (!opened.IsSuccess) return XsrResult.Failure(opened.Error!);
        await using var stream = opened.Value!;
        await foreach (var value in stream.ReadAllAsync(token)) await consume(value);
        return await stream.Completion;
    }

    public static ValueTask<XsrResult> StopAsync(SidecarHostApi api, string package, CancellationToken token) =>
        api.StopAsync(package, token);
    public static ValueTask<XsrResult> RestartAsync(SidecarHostApi api, string package, CancellationToken token) =>
        api.RestartAsync(package, token);
    public static ValueTask<XsrResult> ReloadAsync(SidecarHostApi api, CancellationToken token) => api.ReloadAsync(token);
}
```

## 高级 Session 与 Transport API

HostSession 提供 Handshake/AcceptRegistration/AcceptStateSnapshot、Activate/Deactivate、文本/二进制执行、ById 入口、事件观察者、RunReceiveLoop、Ping/ReadMetrics、OpenStream/ById、Unregister/Shutdown/Dispose。按生命周期顺序使用；只有一个逻辑接收者。

AttachEventObserver/AttachBinaryEventObserver 在接收路径通知，应快速返回并把重工作交给有界异步队列。SidecarRegistrationSet 提供 per-kind 视图及 TryResolve/TryResolveId；StateMirror 提供本地 Store/语义解析/线值发布，不是一条任意远程对象通道。

Connection 拥有 stream，公开 SendAsync、ReceiveAsync、Close、Dispose、State、FailureReason；IPC Listener/Connector 管端点，Bootstrap 管启动证明，FrameTransport 管可靠帧与 64 项写入预算。它们不执行业务或自动重连。

稳定错误与取消处理见[命令和查询](./commands-and-queries)。UI 的边界仍是本地不可变状态和意图，不传 Session、Connection 或 CLR 对象到 Renderer。


## 实现依据

- [Nexa.Xsr.Runtime/Sidecar/SidecarHostApi.Contracts.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Runtime/Sidecar/SidecarHostApi.Contracts.cs)
- [Nexa.Xsr.Runtime/Sidecar/SidecarHostApi.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Runtime/Sidecar/SidecarHostApi.cs)
- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
