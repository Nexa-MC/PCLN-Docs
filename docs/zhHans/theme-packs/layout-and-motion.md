# 布局、绘制与动效参考

目标是让外观更清晰，同时保持输入、滚动和无障碍的几何一致。这里的属性属于 NSS/1；NXML 结构、业务状态与生命周期不由它们决定。

## 全部属性组与数值边界

| 属性 | 值与实际含义 |
| --- | --- |
| Width/Height、MinWidth/MaxWidth、MinHeight/MaxHeight | 有限 0–100000；同规则 min 不得大于 max |
| Weight、Spacing、ColumnGap、RowGap | 有限 0–100000；Weight 参与布局分配 |
| Margin / Padding | 1/2/4 值；Margin 允许负值，Padding 非负 |
| HorizontalAlignment / VerticalAlignment | Start/Center/End/Stretch 等实际有限枚举，不能填浏览器 flex 值 |
| Direction / Orientation | Horizontal 或 Vertical |
| Background / Foreground / Border / Hover | 有限颜色；文本色用 Foreground |
| Surface | 已定义的宿主 surface 枚举，不是任意系统材质名 |
| Opacity / BackgroundImageOpacity | 0–1；不是 appearance 中的 0–100 百分数 |
| CornerRadius / BorderWidth / BlurRadius | 0–4096 |
| FontSize / FontWeight / FontFamily | 字号 1–512，字重 100–900，族名或已准入字体资源 |
| TextAlignment / WrapText | 有限对齐枚举 / true、false |
| GridColumns / GridRows | 最多 64 列、256 行的 auto、px 数值或正 fr track |
| GridColumn / GridRow | 0 起始，列 0–63，行 0–4095 |
| GridColumnSpan / GridRowSpan | 1–64 / 1–256，必须装入实际父网格 |
| Position | Flow、Absolute、Overlay，仍属于原来的父/弹层作用域 |
| Left / Top / Right / Bottom | 有限 -100000–100000 |
| Order | 整数 -32768–32767，仅视觉次序，不改变动态所有权 |
| TranslateX / TranslateY / Rotation | 有限 -100000–100000；Transform 内 rotate 另限 ±36000 |
| ScaleX / ScaleY | 0.01–100，不允许奇异的零缩放 |
| Transform | 有限 translate、scale、rotate，最多各一次 |
| Shadow / BackgroundGradient | 有限阴影 / 有界线性渐变 |
| BackgroundImage / ImageSource / IconSource | 已准备的资源表达式 |
| BackgroundImageFit | cover、contain、stretch、tile |
| ItemWidth / ItemHeight / ItemSpacing / ItemColumns | Host 已登记虚拟容器的专用指标，受容器契约进一步限制 |
| Animation | 已定义关键帧名、时长、有限修饰符 |

常见别名会规范化，如 `background-color`→Background、`color`→Foreground、`border-radius`→CornerRadius、`grid-template-columns`→GridColumns、`box-shadow`→Shadow。属性和值都不是任意 CSS。

## 内边距顺序必须明确

```css
Button.capsule { Padding: 6 12; }
StackPanel#CardAccount { Margin: 8 16 12 16; }
```

空格两值为上下/左右，四值为上右下左。逗号四值保留旧约定左上右下，例如 `16,8,16,12`。不要在同一个值中混用两套顺序。宿主基础 NSS 的支持更窄，教程中的基础例使用一值或四个逗号值。

## 实战：双列布局在窄窗口变单列

```css
@supports grid {
  StackPanel#LaunchHomeWorkspace { GridColumns: 1fr 1fr; ColumnGap: 24; RowGap: 16; }
  StackPanel#CardAccount { GridColumn: 0; GridRow: 0; }
  StackPanel#RightColumn { GridColumn: 1; GridRow: 0; }
  @viewport width <= 900 {
    StackPanel#LaunchHomeWorkspace { GridColumns: 1fr; GridRows: 1fr 1fr; }
    StackPanel#RightColumn { GridColumn: 0; GridRow: 1; }
  }
}
```

缩为一列时必须同步调整显式列位置，否则 RightColumn 仍指向第 2 列而被拒绝。span 比父轨道更宽会失败，Host 不静默裁掉它。测试宽/窄两种布局并点击每个操作，不能只看静态图。

## 变换、阴影与渐变

```css
Text#TitleMain { Transform: translate(1,0) scale(1) rotate(0); }
StackPanel#CardAccount {
  Shadow: #10204030 0 3 10;
  BackgroundGradient: linear-gradient(45deg,#eef4ff 0%,#e2eaff 100%);
}
```

Shadow 依次是颜色、X、Y、模糊半径。Transform 使用同一几何参与绘制和逆变换命中；不能以为只是把像素移走却保留点击区域。渐变角度使用 deg，停靠点使用百分比；普通 Width 不因此支持百分比布局。

## 虚拟列表的专用规则

资源列表、版本列表与截图瀑布流的视口、spacer、行身份和滚动锚点归 Host。仅把某一行 Height 拉高会破坏整体计算，因此宽泛主题规则不能覆盖受保护的虚拟几何。

需要改变条目尺寸时，仅使用宿主已登记容器的 ItemWidth/Height/Spacing/Columns，且遵循该容器限制：线性目录固定一列，截图瀑布流列数为 1–12。编译器通用 ItemColumns 上限 64 不等于产品容器允许 64 列。文字、颜色和行内样式仍可主题化。

## 实战：有限呼吸动效

```css
@keyframes title-breathe {
  0% { Opacity: 0.82; TranslateY: 0; }
  100% { Opacity: 1; TranslateY: 1; }
}
Text#TitleMain { Animation: title-breathe 2s infinite alternate; }
```

可动画属性只有 Opacity、TranslateX/Y、ScaleX/Y、Rotation、CornerRadius、BlurRadius；每个属性都需要 0% 和 100% 端点。单组最多 64 帧，时长 1–600000ms（或 0.001–600s），仅使用已支持的 infinite/alternate 修饰，不假设浏览器 easing/delay 语法。

Renderer 推进动画，不每帧重新解析 NSS。相同关键帧在亮暗切换时保留时钟；修改声明会建立新轨道。用户“减少动态效果”优先，不可通过清单或参数关闭这一保护。


## 实现依据

- [docs/xsr/nss-v1.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nss-v1.md)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeProgram.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeProgram.cs)
- [docs/xsr/ntp-v1.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/ntp-v1.md)
