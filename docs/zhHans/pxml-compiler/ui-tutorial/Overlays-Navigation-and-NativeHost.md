# 弹层、导航与 NativeHost

通过明确输入所有权协调弹层、导航和原生控件。绘制在其他控件上方，不会自动建立模态行为。

**适用版本：**历史 PXML 1.0 及其匹配运行时。当前插件请使用 [ABI 100](/plugin-sdk/)。

Tooltip、Popup、Modal 和平台控件都涉及视觉层级与输入权限。不要仅靠 ZIndex 或 `IsHitTestVisible` 模拟这些 contract。

## Tooltip、Popup 与 Modal

```xml
<Button Text="帮助">
  <Button.Tooltip Delay="500ms" Placement="Pointer">
    <Text Text="{loc Help.Description}" />
  </Button.Tooltip>
</Button>

<Popup
  Anchor="{ref MoreButton}"
  Placement="Auto"
  DismissOnOutsidePointer="true"
  DismissOnEscape="true">
  <ActionMenu />
</Popup>

<Modal DismissOnEscape="true">
  <ConfirmDialog />
</Modal>
```

每个 overlay 拥有 child Scope。Modal 默认包含 dim/input barrier 和 Focus trap；Tooltip 默认 input pass-through。视觉遮挡与 interaction barrier 是两套独立 policy，因此无 barrier Popup/Tooltip 与 NativeHost 重叠时也能正确遮挡平台控件。

## 统一 interaction policy

最上层 barrier 按 capability 判断范围外 entity 是否允许 Pointer、KeyboardFocus、Accessibility、CommandInvoke 和 NativeHost。不要让 Focus、Accessibility 与 NativeHost 各自实现一套不同的 Modal 规则。

## NavigationHost

```xml
<NavigationHost Current="{bind Shell.Route}">
  <Page Key="Home" Cache="Pinned"><HomePage /></Page>
  <Page Key="Download" Cache="Lru"><DownloadPage /></Page>
</NavigationHost>
```

同一 host 内 Key 唯一。Cache 只使用目标 Runtime profile 支持的策略，例如 None、KeepPresentationState、KeepEntities、Lru、Pinned。

页面 Enter/Leave completion 走内部 lossless lifecycle queue；可丢失的 diagnostics journal 不能决定页面是否变成 Active。Dormant 页面 root 的 Visible/Enabled 会通过有效状态传播到所有后代，包括 Focusable 和 NativeHost。

## NativeHost

```xml
<NativeHost
  Kind="TextBox"
  Value="{bind Search.Text}"
  Placeholder="{loc Search.Placeholder}"
  AccessibleName="{loc Search.Label}" />
```

PXML 只描述 platform host contract，Avalonia backend 创建实际控件。NativeHost 必须：

- 继承祖先的 visible/enabled 状态；
- 按 InputRoot 隔离 focus 与 pointer identity；
- 受 Modal/Popup interaction policy 约束；
- 被更高 retained overlay 的相交区域正确 clip/hide；
- 通过 generation-safe event 写回 State，而不是直接修改 Presentation Store。

## 生命周期

Overlay handle、NativeHost、Navigation page 和 routed handler 都属于 Scope。Scope 销毁后，旧 generation 的 timer、animation completion、platform event 或 command 不得重新激活已销毁页面。

下一章：[构建、调试与发布](./Build-Debug-and-Release)。

## 检查结果

通过键盘开关弹层，验证焦点恢复和导航时原生控件清理。
