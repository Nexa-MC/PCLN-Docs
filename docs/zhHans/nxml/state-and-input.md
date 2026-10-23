# 状态绑定、输入草稿与意图

目标是建立“本地事实驱动界面、界面请求动作”的闭环。Renderer 不直接访问 Sidecar、HTTP 或业务服务；对应异步调用由 Host 组合层执行。

## 1. 先声明状态所有者和类型

下面接上一章已经编译的 ir，使用 Nexa.Xsr、Nexa.Xsr.State、Nexa.Xsr.Renderer 与 NXML 命名空间：

```csharp
var tree = new XsrUiTree();
var bridge = new XsrUiStateBridge(tree);
var builder = new XsrStateStoreBuilder();
builder.Cell<string>(XsrSemanticId.Parse("example.status"), "Example");
builder.Cell<bool>(XsrSemanticId.Parse("example.enabled"), "Example");
var state = builder.Build(bridge);
state.Publish(state.Resolve(XsrSemanticId.Parse("example.status")), "Ready");
state.Publish(state.Resolve(XsrSemanticId.Parse("example.enabled")), true);
var intents = new XsrUiIntentBuffer();
var root = NxmlUiLoader.LoadDetached(ir, tree, state);
var renderer = new XsrUiRenderer(tree, state, sink: intents, stateBridge: bridge);
renderer.SetRoot(root);
```

状态在 Build 封闭前声明；标记不自动创建缺失的 cell。Unknown State 或类型不符在加载/投影时失败。State 维护 revision/availability，旧值不等于仍可用。

## 2. 声明受支持的绑定

```xml
<StackPanel>
  <Text Content="{state example.status}" Localize="false" />
  <Button Key="Refresh" Label="Refresh" Content="Refresh"
          Enabled="{state example.enabled}" Command="example.refresh" />
</StackPanel>
```

| 属性 | 绑定值 | 限制 |
| --- | --- | --- |
| Content | string | 仅 Text/CommandInput |
| Label | string | 无障碍语义说明 |
| IsVisible | bool | 当前节点可见性 |
| Enabled / Clickable | bool | 支持输入的原语，决定准入 |
| Value | double | 仅 Progress，不是 TextInput 的双向值 |
| TransitionKey | string | 现有转换契约 |

Width、Command、Role、Placeholder、Checked、Selected、RangeValue 不支持任意 State 绑定；有限事实需要宿主数据投影/相容 Reload。Placeholder 可用动态 data 文本，不等于支持 state getter。

## 3. Command 发出意图，不执行服务

```csharp
renderer.Render();
renderer.Activate(refreshEntity);
foreach (var intent in intents.Drain()) {
    Console.WriteLine(intent.Command.Value);
}
```

refreshEntity 是已加载 Refresh 节点。实验项目验证会输出/捕获 example.refresh，并验证 enabled=false 时不会派发。XsrUiIntentBuffer 只是测试或组合层调度缓冲，长期业务应有明确有界处理策略，不在绘制路径无限积压。

生产组合层验证来源寿命、接收意图、异步调用声明的业务端口，最后发布权威 State。不要让渲染器构造服务、在绑定里查询或同步等待任务。源控件退役后旧意图不得继续获得新页面权限。

## 4. TextInput 的草稿属于谁

```xml
<TextInput Key="NoteInput" Label="Note" Placeholder="Write a note"
           MaximumLength="120" Enabled="{state example.enabled}" />
```

Label 必需，Content 被禁止；不能用模板种下明文密码或把 Content 当双向绑定。MaximumLength 默认2048、允许1–32768；IsPassword 控制密码语义；PreserveTabs 只适用于明确的可信文本编辑场景。

Host 在可信提交边界通过 XsrUiTextInput.ReadDraft 读值；草稿不复制到场景快照或诊断。输入过程与业务当前值不同，未提交草稿不能自动覆盖业务 State。

Renderer 的 SetTextInputValue、SetTextSelection、SetTextPreedit 是 Host 输入/投影入口；普通业务层不持有控件。兼容 Reload 保留草稿、光标、选择和 IME，只有明确的数据更新才修改应更新的值。

## 5. 布尔控件不是自动写业务状态

```xml
<nxml-dynamic>
  <CheckBox Key="UseFeature" Label="Use feature" Command="example.feature.toggle"
            Checked="{data checked}" />
</nxml-dynamic>
```

checked 参数传 true/false 字符串，编译成有限事实。点击产生意图；组合层执行并更新权威事实，再 Reload 该片段。不能用控件私有 toggle 作为唯一业务状态，也不能直接写 Checked 的 state 表达式冒充双向绑定。

## 6. Slider 与 Progress 是两类输入/输出

Slider 使用 Minimum、Maximum、Step、RangeValue，Role=Slider；有限递增边界、正步长、±1e12 边界与最多1e9步，RangeValue 在区间内。它是数值输入，需要处理自己的变化/提交意图。

Progress 的 Value 可读 double State，是展示；Ring=true/Indeterminate=true 形成加载环。不要将 Progress Value 的绑定方式套到 Slider 或 TextInput。

## 7. 本地化与真实数据

静态词汇可交给 Host 本地化；来自用户、文件名、便签或已完成本地化的句子应 Localize=false。CompileLocalized 会先翻译格式，再填充 named data；翻译必须保留参数集合，不能再次把最终业务文字当词汇翻译。

离页取消请求、撤销输入来源并清理片段；返回页面从当前 State 创建/恢复投影，不靠重复查询把旧草稿覆盖。下一章讲[保留动态内容](./dynamic-and-reload)。


## 实现依据

- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlNodeSchema.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlNodeSchema.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs)
- [Nexa.Xsr.Renderer/XsrUiStateBridge.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer/XsrUiStateBridge.cs)
- [Nexa.Xsr.Renderer/XsrUiTextInput.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer/XsrUiTextInput.cs)
