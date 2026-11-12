# 动效、交互与无障碍

使用运行时的有限数据契约描述交互与动效，设计视觉过渡时一并考虑键盘与减少动效模式。

**适用版本：**历史 PXML 1.0 及其匹配运行时。当前插件请使用 [ABI 100](/plugin-sdk/)。

动效和交互状态属于 Runtime component data，而不是任意 callback 或对象集合。

## 属性 Transition

```xml
<Node
  Opacity="{bind IsVisible ? 1 : 0}"
  Transition.Opacity="{motion Standard}" />
```

Compiler 必须验证 property、solver、continuity 和 motion token 的兼容性。例如 Tween 只允许 ContinueFromCurrent/PreserveSpeed，Spring 只允许 ContinueFromCurrent/PreserveVelocity；不兼容组合必须报错，不能静默改语义。

Reduced Motion 或禁用动画时，生命周期 completion 仍必须可靠发布，页面不能永久停在 Entering/Leaving。

## Layout FLIP

```xml
<Card
  x:AnimateLayout="true"
  x:LayoutMotion="{motion Standard}" />
```

Runtime 在一次 layout 后计算 tree-aware local FLIP。嵌套动画会扣除祖先已经承担的 world delta，避免父子重复缩放。LayoutRect 始终保留最终静态几何；视觉补偿进入 transform。

## Behavior

```xml
<Node Behaviors="Hover Press Focus Click" />
```

这会 Lower 为 Hoverable、Pressable、Focusable、Clickable 等 component set，不会在 Runtime 创建 `Behavior[]`。Disabled/Invisible 的有效状态沿祖先传播；已聚焦节点变为不可交互后必须失焦，不能继续通过 Enter 激活 Command。

## Focus Scope

```xml
<Column
  Focus.Scope="true"
  Focus.Trap="true"
  Focus.Restore="true">
  <Button Text="确定" />
</Column>
```

Focus 按 Window/InputRoot 隔离。不同窗口的 Tab traversal、键盘 target 和 pointer capture 不能共享状态。Modal 通常创建 trapping FocusScope，并在关闭后恢复原焦点。

## Accessibility

```xml
<Button
  Text="安装"
  AccessibleRole="Button"
  AccessibleName="{loc Download.Install}"
  AccessibleDescription="{loc Download.InstallDescription}"
  AccessibleActions="Invoke Focus"
  Command="{cmd Download.Install}" />
```

Semantic Tree 独立于 Render Tree。AccessibleName/Value binding 进入 dependency index；Modal 打开后，屏障外节点不会出现在平台语义树中，来自其范围的 Invoke/Focus 请求也必须被统一 interaction policy 拒绝。

## 检查清单

- 动效不能改变可点击区域与视觉位置的一致性。
- 所有仅图标按钮都有可本地化 AccessibleName。
- Disabled 状态同时阻止 pointer、keyboard 和 accessibility invoke。
- Focus order 与视觉阅读顺序一致。
- Reduced Motion 路径仍完成导航、Popup 和 Modal 生命周期。

下一章：[弹层、导航与 NativeHost](./Overlays-Navigation-and-NativeHost)。

## 检查结果

测试焦点导航、减少动效和进行中过渡被打断。
