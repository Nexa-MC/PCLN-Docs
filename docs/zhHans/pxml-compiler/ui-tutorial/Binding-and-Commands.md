# Binding、Command 与事件

把计算状态的读取与业务动作分开。绑定投影数据，命令表达意图，并由匹配的运行时契约提供。

**适用版本：**历史 PXML 1.0 及其匹配运行时。当前插件请使用 [ABI 100](/plugin-sdk/)。

PXML 把“读取状态”和“产生副作用”分开：Binding 是纯读取/计算，Command 是业务动作，Event 只进入底层 UI 行为层。

## 读取状态

```xml
<Text Text="{bind User.Profile.DisplayName}" />
<Text Text="{bind Download.Progress >= 1 ? '完成' : '下载中'}" />
```

Binding 支持 path、静态索引、算术、比较、逻辑、空值合并和条件表达式。Compiler 会记录 target property、dependency set 和 typed program；状态变化只重新求值依赖它的 Binding。

## 纯函数边界

允许的内建纯函数包括 `format`、`clamp`、`min`、`max`、`round`、`upper`、`lower`、`trim`、`rgb` 和 `rgba`。扩展函数必须由 Host 白名单注册。

Binding 中禁止：

- I/O、网络、Process 或 service 调用；
- `new`、`await`、`lock`、`throw`；
- 反射和任意方法调用；
- 修改 State 或 Presentation Store。

因此 `{bind Danger()}` 必须在编译期被拒绝，而不是等到点击后才出错。

## 触发业务 Command

```xml
<Button
  Text="启动"
  Command="{cmd Launcher.Start}"
  CommandParameter="{bind SelectedInstance.Id}" />
```

Compiler 输出稳定的 `UiCommandId` 和参数程序。Runtime 激活按钮后把 Command 写入队列，由应用层处理；PXML 不直接调用 C# 方法。

不要使用：

```xml
<!-- 错误：把业务方法名塞进事件字符串 -->
<Button OnClick="LauncherService.Start()" />
```

## UI Event

拖动、手势等底层行为可以声明 Event：

```xml
<Node
  OnPointerDown="{event Drag.Begin}"
  OnPointerUp="{event Drag.Finish}" />
```

Event 处理器属于 UI scope，必须遵守 Entity/Scope generation。需要改变业务状态时，由事件处理器再产生明确的 Command 或 StatePatch。

## NativeHost 的写回

NativeHost 输入不是绕过状态模型的双向反射 binding。平台事件先进入 generation-safe journal，再执行 Command/StatePatch，下一轮 Binding 才把新状态投影回 UI：

```text
TextChanged → validate Entity/Scope → StatePatch → binding evaluation
```

## 常见问题

- Binding 不更新：确认状态变更发布了正确 dependency，而不是原地修改不可观察对象。
- Command 没执行：确认控件未 Disabled、未被 Modal barrier 阻止，并且 Host 注册了对应 ID。
- 列表项读错数据：在 Template 中使用 `item`/声明的 `As` local，不要引用外层临时索引。

下一章：[条件、列表与虚拟化](./Structure-and-Lists)。

## 检查结果

分别验证绑定更新和命令调用；命令未解析不能当作成功空操作。
