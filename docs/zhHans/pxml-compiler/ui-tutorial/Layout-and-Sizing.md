# 布局与尺寸

选择能够适应长文本、动态内容和小窗口的布局约束。测量由匹配的运行时负责，不由编译器执行。

**适用版本：**历史 PXML 1.0 及其匹配运行时。当前插件请使用 [ABI 100](/plugin-sdk/)。

PXML 的布局由 PCL.UI.Next Runtime 增量计算，不委托 Avalonia 的 Measure/Arrange。作者只声明约束和布局关系。

## Row 与 Column

```xml
<Column Padding="20" Gap="12">
  <Text Text="下载管理" />

  <Row Gap="8" Align="Center">
    <Text Text="当前版本" />
    <Button Text="刷新" Command="{cmd Versions.Refresh}" />
  </Row>
</Column>
```

`Column` 沿纵轴排列，`Row` 沿横轴排列。`Gap` 只出现在相邻 child 之间；`Padding` 属于容器内部，`Margin` 属于节点外部。

## Width、Height 与约束

| 写法 | 含义 |
|---|---|
| `Width="120"` | 固定 120 logical pixels |
| `Width="50%"` | 父级可用宽度的 50% |
| `Width="auto"` | 由内容和父约束共同决定 |
| `Width="1*"` | Grid/Flex 风格的加权剩余空间 |
| `MinWidth` / `MaxWidth` | 对最终 measure 结果设置下限/上限 |

不要同时堆叠互相矛盾的固定尺寸和 Min/Max。百分比与 Star 必须等父容器给出可用约束后解析，因此文本换行也会使用父布局实际分配的 content width，而不是独立猜测宽度。

## Grid

Grid track 支持 Fixed、Auto、Percentage 和 Star。带 Min/Max 的多个 Star track 会进行受约束的迭代分配；不要依赖简单的一次比例分配。Track 声明由目标 UI profile 的组件 schema 校验，使用该 profile 提供的 Grid component/track 语法，不要把未注册的字符串 track 当成可移植格式。

适合 Grid 的场景：

- 表单 label/value 对齐；
- 固定侧栏加可伸缩内容；
- 多行多列且需要跨行/跨列的区域。

只有单轴排列时优先 Row/Column，结构更直接。

## Overlay 与 Absolute

`Overlay` 让 child 共享同一布局区域，适合 badge、局部遮罩和装饰层。它不自动建立 Modal 交互屏障；Modal 必须使用 Overlay Runtime 的正式 contract。

`Absolute` 适合已知坐标的局部画布或锚定装饰，不适合常规响应式页面。绝对定位仍然受父 content rect、transform 和 clip 约束。

## Scroll 与 VirtualList

小规模内容可以放进 `Scroll`；大型动态集合使用 `VirtualList`。不要在 Scroll 中预创建数万个 item。VirtualList 只实现可见区和 overscan，并通过稳定 Key 重用 slot。

## 文本换行

文本的 shaping/wrapping constraint 来自 Layout Measure 的实际 available content width：

```xml
<Column Width="50%" Padding="12">
  <Text Text="{bind Article.Summary}" />
</Column>
```

viewport 缩小时，父约束变化会触发文本重新 measure，行数、高度和 LayoutRect 保持一致。不要用固定字符数估算 UI 高度。

## 选择布局的顺序

1. 单轴：Row/Column。
2. 二维 track：Grid。
3. 同一区域叠放：Overlay。
4. 显式坐标：Absolute。
5. 可滚动大集合：VirtualList，而不是 Scroll + 全量 child。

下一章：[Binding、Command 与事件](./Binding-and-Commands)。

## 检查结果

在兼容运行时测试最小宽度、文本扩展和溢出。
