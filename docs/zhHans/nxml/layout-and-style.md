# 布局、滚动与两套 NSS

目标：把内容放在清晰、可缩放的位置，输入命中与视觉一致，并避免宽泛样式破坏虚拟列表。先用 NXML 表达结构，再选择适合的外观语言。

## 容器与尺寸

Page/ContentHost 的 Element 是通用视觉容器；StackPanel 按 Orientation 和 Spacing 排列；Shell 等组件只是已有原语的默认包装。VerticalPager/HorizontalPager 是有限分页容器，不是任意 DOM/Flex。

```xml
<Page Key="LayoutExample">
  <StackPanel Orientation="Horizontal" Spacing="16" Padding="24">
    <StackPanel Key="Left" Weight="1" MinWidth="200" MaxWidth="320">
      <Text Content="Account" />
    </StackPanel>
    <StackPanel Key="Right" Weight="2" MinWidth="280">
      <Text Content="Version" />
    </StackPanel>
  </StackPanel>
</Page>
```

Weight 在可分配空间中参与相对分配，Min/Max 继续约束结果，不是简单把屏幕宽度除三。水平/垂直对齐只接受 Stretch、Start、Center、End。固定 Width/Height 与最小边界要在小窗口一起测试。

NXML 的 Margin/Padding 为一个数或四个逗号值，顺序左、上、右、下；`Padding="6 12"` 不是该语法，`Padding="12,6,12,6"` 才是。

## Host 基础 NSS：编译页面时使用

实验的 Workspace.nss：
```css
#TitleMain { FontSize: 26; Foreground: #23466c; }
.status-card { CornerRadius: 16; Background: #edf3fa; }
Text { FontSize: 15; }
Button { Height: 38; Padding: 12,6,12,6; }
```

基础 NssStyleSheet 只支持单一 `*`、类型、.class、#key 与逗号选择器列表，不支持 `Text#TitleMain` 这类复合选择器、伪类、@tokens 或 @when。布局/绘制字段为有限允许列表。它按组件默认 → 基础样式 → 显式 NXML 属性形成基础样式。

```csharp
var styles = NssStyleSheet.Parse(baseStyleText);
var ir = NxmlCompiler.Compile(NxmlParser.Parse(pageText), components, styles);
```

这段属于 Host 页面加载。主题作者的 NSS/1 不是通过它解析。

## NTP NSS/1：独立 style-only 通道

| 对比项 | Host 基础 NSS | 主题 NSS/1 |
| --- | --- | --- |
| 编译器 | NssStyleSheet.Parse | NssThemeCompiler.Compile |
| 输入 | Host 页面基础定义 | NTP 有序 styles、选项、环境和已准备资源 |
| 选择器 | 简单类型/class/key/* | 复合、父子/后代、有限属性、交互伪类 |
| token/条件/关键帧 | 不支持 | 有限支持 |
| thickness | 一值/四逗号值 | 一/二/四值，空格/CSS 顺序与逗号旧顺序 |
| 应用时机 | 建立宿主基础 IR | 独立外观代次提交，不改变页面行为 |

两者同为 .nss 不代表语法完全相同。主题通道保留原始身份和来源，不通过 Reload 重建页面来换颜色。

## 滚动与指示器

```xml
<StackPanel Key="LogView" Scroll="true" ShowsVerticalIndicator="true"
            StickToEnd="true" ScrollGesture="true" Height="220">
  <Text Content="First log entry" />
  <Text Content="Second log entry" />
</StackPanel>
```

这些声明创建 Host 保留的滚动状态，不是手动改孩子的 Top。指示器、拖动/触屏和滚动偏移要同布局计算保持一致。相关事实要求 Scroll=true，且只能用在支持的 Stack/Dynamic Stack；不是任何 Text 都能随意声明 Scroll。

长胶囊按钮有另一条有限水平滚动契约：CommandInput 必须已由 Host 声明 HoverExpand=true 和 Scroll=true，只有 ShowsHorizontalIndicator 与 UseVerticalWheelForHorizontalScroll 可用，不能复制垂直日志属性到按钮。

## 文本、图像与加载状态

Text 用 Content；长文本按 WrapText、MaxLines、TrimOverflow 的有限规则处理。Image 必需 Source，引用由 Host 已准备的资源，NXML 不授予读取任意 URL/路径的能力。

```xml
<StackPanel HorizontalAlignment="Center" VerticalAlignment="Center" Spacing="12">
  <ProgressRing Label="Loading resources" Width="40" Height="40" />
  <Text Content="Loading resources…" />
</StackPanel>
```

ProgressRing 是 Progress + Ring/Indeterminate 的包装，正常加载页由 Host 决定内容状态；追加列表可在底部单独投影，不因此删除已有行。

## 虚拟内容与主题几何

大量列表由 Host 保留逻辑身份、可见窗口、spacer 和滚动锚点。NXML Dynamic 是承载机制，不自动实现无限列表/虚拟化。不要每次数据变化 Clear 后重建全部行；用稳定片段与相容 Reload/Reorder，必要时由 Host 虚拟布局指标统一计算。

下一章把输入与事实接起来：[状态和意图](./state-and-input)。


## 实现依据

- [Nexa.Xsr.Renderer.Nxml.Compiler/NssStyleSheet.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NssStyleSheet.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeCompiler.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeCompiler.cs)
- [docs/xsr/nxml-renderer.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nxml-renderer.md)
