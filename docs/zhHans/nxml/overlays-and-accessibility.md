# 弹层、锚点、关闭与无障碍

目标：一个弹层出现时，绘制、指针、键盘、读屏与关闭行为都属于同一个明确寿命。主题只能改合法外观，不能改变遮罩归属或重新启用已被遮挡的输入。

## 模态层与对话框是两个事实

ModalLayer 表示覆盖层参与输入/无障碍遮挡；Dialog Role 表示对话框语义。不是给一个普通 StackPanel 涂黑就获得正确的模态行为。

```xml
<Page Key="DialogExample">
  <Button Key="OpenDialog" Label="Open dialog" Command="example.dialog.open" />
  <Node Kind="ModalScrim" Recipe="Element" Role="None" AcceptsChildren="true"
        Key="Scrim" ModalLayer="true" OverlayMotion="DialogScrim"
        IsVisible="{state example.dialogOpen}" Background="#00000080"
        DismissCommand="example.dialog.close">
    <Dialog Key="Confirm" Label="Confirm action" OverlayMotion="Dialog"
            HorizontalAlignment="Center" VerticalAlignment="Center" MaxWidth="520" Padding="24">
      <Text Content="Continue this operation?" />
      <Button Label="Cancel" Content="Cancel" Command="example.dialog.close" />
    </Dialog>
  </Node>
</Page>
```

该 Host 片段要求先声明 bool State example.dialogOpen 和对应命令意图处理。ModalLayer 只在 Element 或 Overlay-layout Dynamic 上允许，不能直接放在 Dialog 的 StackLayout 上。

模态层抑制早先兄弟的输入与无障碍遍历，整窗覆盖根仍拦截指针。业务组合负责打开/关闭状态，不调用远程 UI 对象，也不把“看不见”当已销毁。

## 关闭路由

DismissCommand 为有限语义 ID，Escape 请求由 Host 输入路由发出，不执行标记脚本。目标必须仍存活、可见且未被另一层遮挡。旧场景残留已销毁 entity 不能重新接受命中或 Escape。

按钮、遮罩和 Escape 需要按同一产品规则请求关闭。不要在后台任务直接销毁某个任意实体绕过 owner；由所属页面/动态片段清理，并取消正在等待的请求。

## 有限弹层动效

OverlayMotion 只接受 None、Notification、DialogScrim、Dialog。动画属于共享的整组展示，不要求每个后代独立建立不一致时钟。TransitionKey/OffsetX/OffsetY、TransitionMovesSelf 是另一组已有运动事实；后者要求 TransitionKey，兼容重载中保持运动契约。

减少动态效果始终优先。退出动效不应让已撤销的交互继续有效；场景借用与输入权限是不同生命周期。

## 锚定浮层

```xml
<Page Key="AnchoredExample">
  <Button Key="OpenDetails" Label="Details" Command="example.details.open" />
  <Node Kind="DetailsOverlay" Recipe="Element" Role="None" AcceptsChildren="true"
        Key="Details" Anchor="OpenDetails" AnchorGap="4" Width="240">
    <Text Content="Additional details" />
  </Node>
</Page>
```

Anchor 是本地键，在最近树作用域内唯一解析；不能指自己或后代，缺失/歧义在提交前拒绝。AnchorGap 非负且必须有 Anchor。数据或窗口变化重新布局时仍按同一锚关系计算，不硬编码屏幕绝对位置。

Anchor 关系是重载不变契约。含锚片段不能通过 owned.Move 搬到另一个槽；确有结构改变用受控替换并建立新寿命。

## 通知与 live region

```xml
<Notification Key="Notice" Label="Task status" OverlayMotion="Notification"
              LiveSetting="Polite" DismissCommand="example.notice.dismiss">
  <Text Content="Task completed" />
</Notification>
```

通知 Role=Status，通常不是模态。LiveSetting 为 Off/Polite/Assertive，传给原生无障碍桥；不要把每帧更新进度作为 Assertive 播报。明确的完成事件适合播报，持续当前进度仍由 State 表达。

## Label、文字与可操作性

图标按钮仍提供完整 Label；TextInput Label 说明用途，Placeholder 不替代无障碍名称；切换状态由 Checked/ValueState 的正确投影表达。长文字裁剪时保留合理的语义说明，不只显示一个无上下文省略号。

Localize=false 用于用户/文件名/已本地化句子。标题补丁或动态文字改变时，视觉与 Label 应同步，不让读屏读旧含义。

## 必须做的交互验收

依次检查 Tab/Shift-Tab、Enter/Space、Escape、鼠标/触屏、祖先隐藏、页面离开、动画中关闭、连续弹层覆盖和已销毁节点。原生读屏测试必须在对应 OS 运行；便携场景的 Role/Label 检查不能代表每个平台 automation 已验证。


## 实现依据

- [docs/xsr/nxml-renderer.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nxml-renderer.md)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs)
- [Nexa.Xsr.Renderer/XsrUiComponents.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer/XsrUiComponents.cs)
