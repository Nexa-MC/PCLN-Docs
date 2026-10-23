# 综合案例：资源页便签扩展

本章完成设计推导，再把每个决策落到后续章节的代码。目标是：用户在资源页输入一条便签并提交；卡片显示最后有效值；离开页面后旧操作失效；重新激活能恢复 Sidecar 当前事实。这里不修改资源搜索、下载或账户规则。

## 1. 写验收场景

```text
Given 当前会话已激活，便签为“准备测试”
When 用户输入“已测试 Alpha 12”并提交
Then 命令成功，当前便签状态更新，卡片显示新值

Given 页面已经离开或模块 exposure 已替换
When 旧提交事件到达
Then Host 不将它作为新模块的有效操作

Given 输入超出业务上限或会话已经停止
When 请求到达
Then 返回明确失败，保留原状态，不显示虚假成功
```

选择一个小于 Host 输入上限的业务长度，例如 120 字符，并说明空白是否允许。Host 的 512 字符草稿预算只是最大容器，不等于业务规则。

## 2. 先分配职责

| 部分 | 所有者 | 输入与输出 |
| --- | --- | --- |
| 验证、保存便签 | Sidecar 私有业务 | 字符串 → 成功/稳定错误 |
| 当前值与操作可用性 | Sidecar State；Host 只读镜像 | 初始快照和状态增量 |
| 表单与提交草稿 | Host 模块投影 | schema 2、当前 exposure、用户输入 |
| 请求调度、取消与会话退出 | Host Runtime / Sidecar 接收循环 | 数字命令、correlation、CANCEL |
| 外观调整 | Host/NTP | 可读布局，不取得新行为权限 |

不要把 `SidecarConnection` 交给 Renderer，不要让业务对象直接保存控件引用，也不要让 TextInput 的未提交草稿自动覆盖业务 State。

## 3. 声明最小契约集合

| Kind | 语义 ID | Codec | 用途 |
| --- | --- | --- | --- |
| Command | `example.note.set` | 输入 0、结果 0 | 提交字符串 |
| State | `example.note.current` | 0 | 最后有效便签 |
| State | `example.note.enabled` | 1 | 当前操作可用性 |
| Event | `example.note.changed` | 0 | 成功修改的通知 |
| UiModule | `example.note.panel` | 0、flags 0 | 哈希保护的有限表单 |

注册序列中 Command 是该种类第 1 项，两个 State 分别是 1 和 2。UiModule 的序号与 State 不共享。初始快照必须完整包含两个状态，不能因为 Boolean 当前为 true 就省略。

## 4. 使用获准 UI，不创建宿主页面

```csharp
var document = new SidecarUiDocument(
    "ui.resources.extension-card.v1", "资源便签", "仅保存本扩展的便签。",
    new SidecarUiNode[] {
        new(1, 0, SidecarUiNodeKind.Stack, "便签面板"),
        new(2, 1, SidecarUiNodeKind.Text, "当前便签",
            ValueState: "example.note.current"),
        new(3, 1, SidecarUiNodeKind.TextInput, "编辑便签",
            Command: "example.note.set", ValueState: "example.note.current",
            EnabledState: "example.note.enabled")
    });
byte[] bytes = document.Encode();
```

这是供注册阶段使用的片段，需要 `Nexa.Sidecar.Protocol`。完整的节点字段、绑定检查和哈希注册在[UI 与扩展](../sidecar/ui-and-extensions)中解释。TextInput 使用 Host 的提交控件；不要另外注册一个靠“读取当前控件值”工作的按钮。按钮的 `Argument` 是声明时的字面量，不是任意绑定表达式。

## 5. 执行与状态更新

命令处理先检查 Active、契约 ID、codec 和参数，再执行业务验证。成功后发布 `example.note.current` 的 StateDelta，按需要发送 changed Event，并返回同一 correlation 的 CommandResult。失败保持旧值，返回明确错误。

如果保存需要 IO，接收循环继续处理 Health/CANCEL；工作任务使用按 correlation 管理的取消源。不能在接收循环里阻塞等待长任务，更不能用 `.Result` 或 `.Wait()` 等待异步操作。

超时只说明调用方没有在期限内拿到结果，不自动证明副作用没有发生。若未来增加可重试持久化操作，应定义操作 ID、去重或幂等策略；不要把换一个 correlation 当作去重。

## 6. 加上故障与退役路径

停用时停止接受新业务请求，取消/完成旧任务，撤销 UI、订阅和信号授权。重启后重新注册、发送完整快照并等待 ACTIVATE；不要复用旧数字映射或旧 exposure。

如果只保存在内存，退出后便签消失；如需持久化，在 Sidecar 自己明确管理的存储端口实现，记录格式版本与失败行为。该例不凭空获得 Host 任意路径读写权限，也不把“当前示例能回显”写成“已经可靠持久化”。

## 7. 把设计转为证据

| 层级 | 本例应证明什么 | 验证入口 |
| --- | --- | --- |
| 业务 | 长度/空白/失败不改旧值 | 自己的纯业务测试 |
| 编码 | Command、State、Event 与 UI 引用一致 | [协议实例](../sidecar/commands-and-queries) |
| IPC | 子进程握手、注册、查询、退出 | [第一个 Sidecar](../sidecar/quick-start) |
| UI | 编辑草稿、提交、State 更新、离页取消 | 获准 Host 中执行模块，记录平台与构建 |
| 发布 | 原生文件、签名、正确发现目录 | [安装与签名](../sidecar/packaging-and-discovery) |

这个拆分可推广到独立任务面板：Command 发起任务，State 维持进度与可用性，Event 通知完成，Stream 提供有背压的连续结果。先确认目标授权，再扩展功能。


## 实现依据

- [docs/xsr/sidecar-ui-modules.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-ui-modules.md)
- [Nexa.Sidecar.Protocol/SidecarUiDocument.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarUiDocument.cs)
- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
