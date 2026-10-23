# 动态模板、列表身份与保留式更新

目标：列表数据或文案变化时保留输入、滚动和动画，不把每次更新变成一次新的入场。Dynamic 提供有所有权的片段容器；业务仍由外部状态/组合层驱动。

## 1. 声明空槽

```xml
<Dynamic Key="Results" Orientation="Vertical" Spacing="8" />
```

Key 必需，槽在标记中必须初始为空。Layout 可为 Stack、Overlay、HorizontalPager、VerticalPager；它是结构契约，不能相容重载时随意变更。

## 2. 定义 .d.nxml 片段
```xml
<nxml-dynamic>
  <StackPanel Key="{data key}" Class="result-row" Spacing="6">
    <Text Content="Item: {data title}" Localize="false" />
    <TextInput Key="Draft" Label="Note" Placeholder="{data placeholder}"
               MaximumLength="120" />
    <Button Label="{data action}" Content="{data action}" Command="example.note.set" />
  </StackPanel>
</nxml-dynamic>
```

根为 nxml-dynamic，不带普通属性，只含一个视觉根。data 参数将值绑定为字面量，不拼 XML；缺参数、非法 bool/数字或尝试改变 primitive metadata 会失败。

```csharp
var template = new NxmlDynamicTemplate(templateText);
var fragment = template.Compile(new Dictionary<string, string> {
    ["key"] = "row-a", ["title"] = "A & <literal>",
    ["placeholder"] = "Write a note", ["action"] = "Save"
}, components, styles);
var owned = new NxmlDynamicContent(tree, state);
var row = owned.Append(resultsSlot, fragment);
```

这是接在已加载页面后的 Host 组合代码，resultsSlot 必须是当前活着的 Dynamic 实体。绑定内容包含 & 和标签文本仍是普通数据，不被重新解析。

## 3. 什么时候用 Reload

同一个逻辑条目只是标题、占位词、值或相容外观变化时，重新编译同形片段并 `owned.Reload(row, next)`。它先检查整棵投影，再更新；保留实体、焦点、草稿、caret、选择、内层 Dynamic 内容和未改变的运动契约。

可重投影内容包括文案、布局/样式值、可见/可用事实、已声明输入的值与有限附加属性；不是允许任意结构变换。Key、kind/recipe、子节点数、State binding 列表、输入密码/最大长度、滚动/锚点/transition 等契约需要保持相容。

试图用 Reload 将 row-a 改成 row-b 会失败，旧树保持有效。命令语义等允许重投影的字段仍由 Host 合法数据提供，不代表主题获得修改命令权。

## 4. 全部所有权操作

| 方法 | 适用情况 | 身份和状态 |
| --- | --- | --- |
| Append(slot, fragment) | 新逻辑条目 | 新实体，由此 owner 管理 |
| Reload(instance, fragment) | 原条目相容投影 | 保留实体及活状态，先完整校验 |
| Reorder(slot, order) | 同槽排序变化 | 必须完整、不重复、无外来条目的置换 |
| Move(instance, destination) | 同一 owned workspace 换槽 | 保留实体，禁止循环和含 Anchor 片段搬迁 |
| Replace(slot, fragment) | 结构/绑定不相容或逻辑内容被替换 | 先创建候选，再退役该槽旧片段 |
| Remove(instance) | 条目消失 | 销毁整片段并退役所有权 |
| Clear(slot) | 页面/整个集合退役 | 清理所属片段，不作普通刷新方式 |

所有操作在渲染线程执行，不能让后台任务拿住实体直接更新树。

## 5. 排序例子与常见错误

```csharp
owned.Reorder(resultsSlot, new[] { secondRow, firstRow });
```

只改变显示顺序，不重建输入。如果省略一条、重复一条、传另一个 owner 的实体，或条目已被销毁，校验拒绝。不要只传“变化的那两项”而忽略槽中其他成员。

追加分页保留已有行，将新行 Append；刷新已有项目按稳定逻辑 ID 定位 Reload；删除用 Remove。每次数据回调 Clear→Append 全列表会重置焦点、草稿和入场时钟，也破坏滚动锚点。

## 6. 局部键与异步结果

相同模板可在不同动态实例中拥有局部子键，定位要从本实例/最近作用域开始，不能全树按第一个同名 Draft 找控件。实验项目的 Find(first, Draft) 就是为了避免修改另一个条目。

异步任务保留页面/源生命周期与数据版本，完成后先确认当前所属片段仍有效，再排队投影。entity 数字或 Key 相同不能证明它仍是同一代条目。

## 7. 可验证的保留契约

Authoring Lab 写入未提交草稿并选中一段文本，更新同一行的 title/placeholder，再检查对象引用、草稿和选择区不变；重排后实体仍相同；错误 Key 的 Reload 被拒绝且旧输入保留。

还要为自己的产品补测滚动锚点、虚拟项/页面离开、触屏拖动、过期任务与嵌套所有权。Dynamic 本身不是一个自动缓存所有数据的业务服务。


## 实现依据

- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlDynamicTemplate.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlDynamicTemplate.cs)
- [Nexa.Xsr.Renderer.Nxml.Runtime/NxmlDynamicContent.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Runtime/NxmlDynamicContent.cs)
- [Nexa.Xsr.Renderer.Nxml.Runtime/NxmlUiLoader.Reload.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Runtime/NxmlUiLoader.Reload.cs)
