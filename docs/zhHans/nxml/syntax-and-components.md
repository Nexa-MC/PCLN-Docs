# NXML 语法、组件与身份

目标：能独立写出一个合法页面和可复用组件，并理解解析失败、组件展开与参数替换。这里解释 NXML 的专门约定，不重复通用 XML 教程。

## 1. 文档根与命名空间

```xml
<nxml-page>
  <Page xmlns="https://nexa.dev/nxml/2026" Key="ExamplePage">
    <Text Content="Hello NexaCL" Localize="false" />
  </Page>
</nxml-page>
```

文档必须有一个根；nxml-page 包一个视觉根，自身不带普通属性。直接用一个 Page 作根也可。命名空间可省略，若声明则必须是上面精确 URI；`xmlns="N"` 不是合法简写。

属性不带命名空间，属性/组件名区分大小写。重复属性、DTD、外部实体与其他命名空间被拒绝。不要使用 WPF/Avalonia 的 x:Class、Binding 或事件处理器语法。

## 2. 文字只写在属性里

Text 使用 Content，按钮使用 Content/Label；不能写 `<Text>hello</Text>` 或 CDATA 混合正文。空白缩进和注释允许。

```xml
<Text Content="A &amp; B &lt; C" Localize="false" />
```

静态 XML 特殊字符正常转义；来自业务的数据通过动态参数传入，不能先拼接 XML 再解析。数据中即使有标签或大括号也必须保持字面量。

## 3. 三种值来源

| 写法 | 何时处理 | 用途 |
| --- | --- | --- |
| 字面量 `Height="40"` | 编译为相应类型 | 固定布局/有限事实 |
| `{state example.status}` | 加载时解析预登记状态，之后本地投影 | 文字、可见性、可用性等支持槽 |
| `{data title}` | 动态模板编译时绑定字面量 | 一次片段投影的参数 |

不是每个属性都支持 State。只有 Content/Label/Placeholder 支持混合 data 格式，如 `Content="Item: {data title}"`；其他属性需要完整值。动态参数不允许修改 Recipe/Role/Kind/AcceptsChildren/Required/Layout。

大括号不是通用表达式：没有 C#、加法、任意 getter 或方法调用。`{data !flag}` 仅为 IsVisible 的有限布尔反转。想显示包含大括号的用户数据时，完整绑定 data 值，不将它拼进标记源。

## 4. 一个可复用组件

文件 StatusCard.c.nxml：
```xml
<nxml-component>
  <StackPanel Class="status-card" Spacing="12" Padding="16" />
</nxml-component>
```

组件根必须 nxml-component，且仅一个视觉根。内部可以引用已有组件。使用者给属性覆盖根默认值，子节点追加在组件视觉根的原有子节点后：

```xml
<StatusCard Key="Summary" Spacing="16">
  <Text Content="Ready" />
</StatusCard>
```

例子将根 Spacing 从 12 改为 16，而 Padding 仍为 16。不是继承 CLR 控件，没有自定义属性 setter 或事件回调。组件必须先在 NxmlComponentLibrary 中注册/从指定目录加载；不会按任意程序集自动搜索。

## 5. 原语与语义 Role

组件最终展开为 Node，Recipe 是 Element/StackLayout/Text/CommandInput/Image/Pager/TextInput/Progress/DynamicSlot/RangeInput 等有限原语，Role 是无障碍与输入语义。组件引用不允许覆盖 Recipe、Role、Kind、AcceptsChildren、Required。

如果需要新的 Switch 组件，定义自己的原语包装，而不是在 CheckBox 引用上改 Role：

```xml
<nxml-component>
  <Node Kind="Switch" Recipe="CommandInput" Role="Switch"
        Clickable="true" Focusable="true" Checked="false" AcceptsChildren="false" />
</nxml-component>
```

这仍是 Host 有限原语，不能创建任意 CLR 类型。它不会因为被点击就直接修改业务事实，仍发出 Command intent。

## 6. Key、Class 与稳定身份

Key 在展开后的同一文档内唯一，长度 1–128，不含空白/控制字符；Class 是最多64个空格分隔的有限样式标识。Key 可用于本地定位/锚点，Class 用于样式。

可复用组件不要给重复实例的内部节点写同一个固定 Key，否则展开后冲突。使用 Class，或通过受控动态模板为实例传入独立身份。重载时保持实体 Key/形状/绑定，不能把“同位置”当作“同条目”。

## 7. 编译与失败前原子校验

```csharp
var components = NxmlComponentLibrary.LoadDirectory(componentDirectory);
var document = NxmlParser.Parse(markup);
var ir = NxmlCompiler.Compile(document, components, NssStyleSheet.Empty);
```

componentDirectory 里必须有完整需要的 .c.nxml；只放 StatusCard 而没有它引用的 StackPanel 不会工作。实验项目合并随源码分发的默认组件与自定义组件。

循环引用、未知组件/属性、重复 Key、缺少 Required 或超预算在加载前失败。不要捕获错误后继续挂载半棵树；先修复声明，再提交完整候选。


## 实现依据

- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlParser.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlParser.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlComponentLibrary.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlComponentLibrary.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlCompiler.cs)
