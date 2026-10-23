# 有限 UI 模块：表单、状态、图片与退役

目标：将 Sidecar 私有能力展示为可交互表单，同时保持 Host 的导航、搜索、下载和信任决策。当前生产槽为 `ui.resources.extension-card.v1`；模块不是 NXML、PXML 字符串、浏览器 DOM 或任意宿主控件树。

## 从声明到显示的全部前提

```text
声明 Command/State/Resource
 → 编码 UI + SHA-256 → 注册 UiModule + 所需资源表
 → Host 全批校验、明确槽位授权、完整状态快照
 → ACTIVATE → 发布本地不可变视图 → Renderer 绘制
```

已缓存字节不等于已获得展示权。未提供 UiModuleAdmission 的 Host 可只保留声明用于检查，不执行表单。打开已注册页面从本地缓存/状态读取，不重新向 peer 请求 UI。

## schema 1：只有文字的卡片

```csharp
var card = new SidecarUiCard("ui.resources.extension-card.v1",
    "Note helper", "Ready to accept a note.");
byte[] content = card.Encode();
```

字段 1 schema=1、2 slot、3 title、4 body；载荷最多 4096 字节，标题 1–80、正文 1–512 字符，不允许控制字符。它没有按钮、绑定或脚本。仅需静态说明时不必创建 schema 2。

## schema 2：完整有限表单

```csharp
var form = new SidecarUiDocument(
    "ui.resources.extension-card.v1", "Resource note", "This extension owns the note.",
    new SidecarUiNode[] {
        new(1, 0, SidecarUiNodeKind.Stack, "Note panel"),
        new(2, 1, SidecarUiNodeKind.Text, "Current note", ValueState: "example.note.current"),
        new(3, 1, SidecarUiNodeKind.TextInput, "Edit note", Command: "example.note.set",
            ValueState: "example.note.current", EnabledState: "example.note.enabled"),
        new(4, 1, SidecarUiNodeKind.Toggle, "Enabled", Command: "example.note.enable",
            ValueState: "example.note.enabled"),
        new(5, 1, SidecarUiNodeKind.Row, "Actions"),
        new(6, 5, SidecarUiNodeKind.Button, "Reset", Command: "example.note.set", Argument: "Ready")
    });
byte[] content = form.Encode();
```

本例在 ContractRecipes.cs 中可运行。编码只验证文档形状；正式 Host 还检查 example.note.set 为字符串 Command、enable 为 Boolean Command、current 为 UTF-8 State、enabled 为 Boolean State，并检查功能位和槽位授权。

## 每个节点字段的含义

| 字段 | 要求 | 用途 |
| --- | --- | --- |
| Id | 连续 1–64 | 文档内索引，不是全局实体 ID |
| Parent | 0 或小于 Id 的父节点 | 0 为槽根，非零父必须是 Stack/Row |
| Kind | Text=1/Button=2/TextInput=3/Toggle=4/Image=5/Stack=6/Row=7 | 选择有限语义控件 |
| Label | ≤256 字符、无控制字符 | 字面量文字/无障碍说明；交互与图片必需非空 |
| Command | 当前会话已注册 Command | Button/TextInput/Toggle 必须，其他节点不得使用 |
| ValueState | 当前会话 State | Text 可显示 codec 0–4 标量；TextInput 只能 UTF-8；Toggle 必须 Bool |
| EnabledState | Bool State | 当前节点与后代的可交互事实 |
| VisibleState | Bool State | 当前节点与后代的可见事实 |
| Resource | 已注册且在 RequiredResources 内的资源 ID | 仅 Image 使用且必须非空 |
| Argument | ≤512 字符、无控制字符 | 仅 Button 的固定字符串参数，不是绑定表达式 |

Image/Stack/Row 不使用 ValueState。层级最多 8，节点最多 64；每节点编号和父关系是结构契约，不可引用任意宿主实体键。整个 schema 2 最多 32 KiB。

## 哈希注册必须与字节一致

```csharp
var module = new SidecarRegistrationItem(SidecarRegistrationKind.UiModule,
    "example.note.panel", 0, 0, content,
    System.Security.Cryptography.SHA256.HashData(content));
```

发送前生成内容，之后不修改字节却保留旧 hash。flags/codec 为 0；有图片时 RequiredResources 用分号列出同会话 Resource 的语义 ID。不是文件路径，不跨包借资源。

## TextInput 与 Toggle 的实际操作

TextInput 的草稿由 Host 保留，最多 512 字符，通过 Host 提交控件发送字符串 Command；不是输入每个字符都直接持久化。State 改变输入值时可更新呈现；未提交草稿在不相关状态变化时保留。

Toggle 发送 Bool Command，ValueState 也为 Bool，因此需要 BinaryPayloads。普通 Button/TextInput 参数是字符串；若声明非零结果 codec，同样需要相关二进制功能。不要拿 TextInput 绑定一个 I32 State 再期待自动格式转换。

绑定值不可用时禁止交互。派发前重新检查祖先 Enabled/Visible 和当前 exposure，不信任用户按下时的旧快照。

## Image 节点的实际资源链

```csharp
byte[] png = File.ReadAllBytes("icon.png"); // peer 自己明确拥有的构建资源
var resource = new SidecarRegistrationItem(SidecarRegistrationKind.Resource,
    "example.note.icon", 0, 0, png,
    System.Security.Cryptography.SHA256.HashData(png));
// 模块增加 Image 节点，Resource="example.note.icon"。
// module.RequiredResources 声明 "example.note.icon"，并重新计算完整模块内容/hash。
```

此片段需要把 icon.png 作为真实构建资源分发。Host 接受有哈希的静态 PNG/WebP/JPEG，不按 URL 或路径读图片。图像准入上限为 1 MiB、1024×1024；**内联注册的单 Bytes 字段仍受 65535 字节上限，实际要同时满足较小限制**。不能从解码器上限推导出更大的线字段。

模块节点像素总预留 ≤8 MiB，独立编码图像总量 ≤8 MiB；相同引用共享准入载体。原生解码在后端，不在每一帧/每次状态更新中重新解析。

## 替换、离页与崩溃

每次曝光有新的 GUID。替换模块会撤销旧点击与待定交换；恢复前一个模块也创建新 exposure，旧事件不能重新有效。离页先退役控件并取消相关请求；停用、失败和 Dispose 移除活动模块与订阅。

模块上限为每会话 32、全局活动 64、每槽 8；Host 最多 16 槽。最近激活者赢，退役后可恢复仍存活的前驱。保留缓存字节不等于保留可点击视图。

## 需要实际验证的交互

测试输入草稿/IME、提交拒绝、状态变化、Bool 切换、图片缺失/错误、父节点隐藏、连续曝光替换、离页后点击、会话停止与恢复。编码实例只证明文档及消息形状，正式 UI 执行仍需要获准 Host。


## 实现依据

- [Nexa.Sidecar.Protocol/SidecarUiDocument.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarUiDocument.cs)
- [Nexa.Xsr.Runtime/Sidecar/XsrUiModuleRuntime.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Runtime/Sidecar/XsrUiModuleRuntime.cs)
- [docs/xsr/sidecar-ui-modules.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-ui-modules.md)
