# NSS/1 语言：从规则到计算样式

NSS/1 是有限、类型化、无脚本的主题样式语言，不能按浏览器 CSS 的全部功能理解。本文片段用于 `theme.json.styles` 中的文件，由 `NssThemeCompiler` 编译；宿主基础 `NssStyleSheet` 的较小语法见[NXML 样式](../nxml/layout-and-style)。

## 一个最小程序

```css
/* token 在文件顶层声明 */
@tokens { accent: #68a5ff; inset: 12; }
Text#TitleMain { Foreground: var(accent); FontSize: 26; }
Button.capsule:hover { Border: var(accent); BorderWidth: 1; }
```

规则由选择器和声明组成，声明为 `属性: 值;`。注释使用 `/* ... */`。颜色可以为 `#RRGGBB`、`#RRGGBBAA` 或样式中的 `transparent`；八位颜色最后两位是 alpha。数值必须有限；普通尺寸接受数值及适用的 px 形式，不支持任意百分比、calc、变量算术或网络 import。

## 每种选择器怎样匹配

| 选择器 | 含义 | 例子 |
| --- | --- | --- |
| 类型 | 原始组件 Kind | `Text`、`Button` |
| 类 | NXML 原始 Class 中的一项 | `.capsule` |
| Key | 原始实体键 | `#TitleMain` |
| 组合 | 同一节点同时满足 | `Button.capsule`、`Text#TitleMain` |
| 属性 | 有限身份字段 | `[key="dotted.key"][role=Button]` |
| 后代 | 左侧节点的任意后代 | `StackPanel Button` |
| 直接子级 | 仅相邻层级 | `StackPanel#VersionActions > Button` |
| 列表 | 同组声明分别应用 | `Text#TitleMain, Button.capsule` |
| 交互伪类 | 目标节点的 Host 状态 | `:hover`、`:pressed`、`:focus`、`:focus-visible`、`:selected`、`:disabled`、`:checked` |

每个选择器最多八个关系部分。伪类读取状态，不赋值。键包含点时，用引号属性选择器表达精确身份，避免把点当作类分隔。没有 JS 选择器、任意属性反射、伪元素或脚本回调。

## 优先级与来源顺序

先按选择器特异性，再按同特异性的后置规则计算；`styles` 数组定义文件顺序。因此调整文件顺序可能改变结果。原始 Kind/Key/Class/Role 独立保留，不因计算样式改变。

```css
Button { BorderWidth: 1; }
Button.capsule { BorderWidth: 2; }
Button.capsule { BorderWidth: 3; }
```

匹配胶囊按钮最后得到 3。主题走独立的 style-only 通道，不能把“优先级高”当作覆盖 Host 业务策略的许可；显式保护的几何和语义仍然优先。

## token 与 option 的不同

```css
@tokens {
  accent: option(accent);
  outline: var(accent);
}
Text#TitleMain { Foreground: var(--outline); FontSize: option(title-size); }
```

token 只能在顶层声明，名称在有序样式源中唯一，重复不是后置覆盖。也可使用单声明形式 `@token accent: #68a5ff;`。token 是样式声明值；option 来自当前清单的已校验参数。`var(accent)` 与 `var(--accent)` 指向同一个 token。没有回退参数形式 `var(name, fallback)`。未知 token/option、循环依赖、类型不适配都拒绝编译。token 不具备 State 绑定、业务动作或计算程序的能力。

Text/Select 由 Host 转成带引号的有限文字，Boolean/Number/Range/Color 转成对应字面量；文件类转换为已授权资源表达式。不能把一个 Text 参数改成 `evil()` 就获得函数执行权。

## 条件、能力与响应式

```css
@when mode = dark {
  Text#TitleMain { Foreground: #edf3fa; }
}
@when platform = linux and option(rounded) = true {
  Button.capsule:focus-visible { BorderWidth: 2; }
}
@supports grid {
  @viewport width >= 700 and width <= 1400 {
    StackPanel#LaunchHomeWorkspace { GridColumns: 1fr 1fr; }
  }
}
```

`mode` 为 light/dark，`platform` 为 windows/linux/macos。条件支持有限括号、and/or/not、参数比较与能力/视口检查。视口是 Host 提供的布局环境，不是自己调用窗口 API。支持属性不等于平台具备所有材质，仍需能力声明及实际验证。

条件表达式和关键帧在编译时校验，匹配时按当前环境选择。不匹配的节点、暗色分支或未使用 token 也会检查；用 `@when false` 不能藏一个不允许的 Command。

## 资源值

```css
Text#TitleMain { FontFamily: asset("fonts/Author.ttf"); }
StackPanel#CardAccount {
  BackgroundImage: asset("assets/pattern.svg");
  BackgroundImageFit: tile;
  BackgroundImageOpacity: 0.15;
}
```

此片段要求包内真实存在这些文件，并声明 fonts/images/svg 能力。编译器收集资源引用，不自行开文件；Host 在提交前准备授权资源。即使某分支暂不匹配，也不能依赖未准备文件以后“自动读取”。详见[资源与授权](./styles-and-resources)。

## 有限预算与失败定位

NSS 总量 1 MiB、最多 64 文件、4096 规则、512 token、128 组关键帧。每规则最多 128 声明，总展开声明最多 32768；条件深度最多 16，token 解析深度最多 32，值文本最多 4096 字符。

失败时先找：语法/拼写 → option/token 是否存在 → 属性类型/边界 → 资源准入 → 目标 Key 是否仍存在。编译成功但没有视觉变化，通常要检查选择器匹配与覆盖顺序，而不是添加更高权限。


## 实现依据

- [docs/xsr/nss-v1.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nss-v1.md)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeCompiler.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeCompiler.cs)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeSelectors.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NssThemeSelectors.cs)
