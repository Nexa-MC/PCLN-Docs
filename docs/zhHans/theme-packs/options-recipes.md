# 设置控件与实时应用实战

目标是让用户调节外观参数，而不是给主题执行自定义 UI 代码。Host 从声明生成编辑器，负责键盘、触屏、无障碍、草稿、授权与保存。主题只声明类型、兼容的 control 和消费者。

## 完整工作坊

[workshop 示例](https://github.com/Nexa-MC/PCLN-Docs/tree/main/examples/themes/workshop)包含 12 个实际参数，覆盖全部九种 kind。`font-family` 改标题字体族，`density` 改胶囊按钮内边距，`background-path` 使用当前 Host 的外部背景约定，音频文件/目录由媒体资源准备链消费。默认关闭音乐，避免仅导入主题就意外播放。

打包方式与入门例相同：

```sh
python NexaCL/eng/themes/pack.py PCLN-Docs/examples/themes/workshop --output workshop-1.0.0.ntp
```

## 控件与类型兼容矩阵

| control | 可接受 kind | 适合什么 |
| --- | --- | --- |
| Automatic（省略） | 全部九种 | Boolean→开关，Range→数值滑块，Select→分段，其余使用各自编辑器 |
| Switch | Boolean | 有即时外观结果的开/关 |
| CheckBox | Boolean | 复选型布尔选择 |
| Slider | Range；有显式边界的 Number；至少两项的 Select | 连续步长或离散位置 |
| Segmented | Boolean / Select | 小型互斥选择集，长标签在内部滚动 |
| Input | Number / Range / Text / Color | 精确编辑或文本输入 |

不兼容 control 在清单阶段拒绝。`File` 不能选择 Input 来跳过选择器；`kind` 也不会因为 control 改变。

## 实战一：开关改变圆角

把参数放入 `options`：

```json
{"id":"rounded","kind":"Boolean","control":"Switch","default":true,
 "label":{"zh-CN":"圆角按钮","en-US":"Rounded buttons"}}
```

在样式中消费：

```css
@when option(rounded) = true {
  Button.capsule { CornerRadius: 18; }
}
```

开关只改变 CornerRadius。它没有权力给业务按钮设置 Enabled、Command 或 IsVisible。关闭分支没有覆盖时会回到宿主基础样式，而不是删除按钮。

## 实战二：用 Select 滑块保存稳定值

```json
{"id":"density","kind":"Select","control":"Slider","default":"comfortable",
 "label":{"zh-CN":"密度","en-US":"Density"},
 "choices":[
   {"value":"compact","label":{"zh-CN":"紧凑","en-US":"Compact"}},
   {"value":"comfortable","label":{"zh-CN":"舒适","en-US":"Comfortable"}}
 ]}
```

这个滑块的两个位置映射为字符串 compact/comfortable。显示文字来自 label，持久化不是 0/1。重排 choices 会改变界面位置；改 value 则改变数据契约，需要兼容验证。

## 实战三：条件显示媒体参数

```json
{"id":"music.volume","kind":"Range","default":20,
 "min":0,"max":100,"step":1,"control":"Slider",
 "label":{"zh-CN":"音量","en-US":"Volume"},
 "visibleWhen":"option(music.enabled) && option(music.volume) != 0"}
```

上面语法示范自引用的合法比较，但实际音量编辑器不应在音量为 0 时隐藏，否则用户难以调回。工作坊把此条件用于“自动播放”项；音量本身仅受 `option(music.enabled)` 控制。**表达式合法不等于交互设计合理。**

visibleWhen 的专用文法为：Boolean 常量、`option(id)`、`!`、`&&`、`||`、括号、`==`/`!=`。比较可使用带单/双引号的字符串或有限数字；Files 不可作为条件值。没有 `<`/`>`、函数调用或脚本。表达式最多 4096 字符、深度 16、512 次有限操作。

```text
option(music.enabled)
!option(rounded)
option(density) == "compact" && option(music.enabled)
```

**NSS 的条件不是这个文法。** NSS 用 `@when ... and ...`、`=` 等语法。把 `and` 写进 visibleWhen 会失败，把 `&&` 当作任意 NSS 扩展也不可取。

## 实战四：文件、文件列表和目录

```json
{"id":"background-path","kind":"File","resourceKind":"Image","default":"",
 "label":{"zh-CN":"外部背景","en-US":"External background"}}
```

File 通过 Host 选择器得到一个值和来源绑定的授权；Files 是路径数组，Directory 是有类型的枚举根。手工编辑导出 JSON 加入绝对路径不授予读取权限。路径合法、授权有效、大小预算与解码支持都必须通过。

`background-path` 是当前 Desktop 对 Image 参数的有限背景投影约定，不是“任意参数名都会对应同名窗口属性”。其他特殊资源槽参照[外观资源参考](./appearance-and-capabilities)，不要根据参数名猜测新行为。

## 实时保存的完整时序

```text
编辑草稿 → 类型/完整性检查 → 静默合并
      → 准备候选/NSS/资源 → 同代次应用 → 持久化成功
```

有效值自动应用，拖动期间保留手势所有权，释放后应用最终值。不完整颜色/数字保留草稿和最后有效样式；其他完整参数仍可提交。提交过程中继续输入不会被较早快照覆盖，光标、选择区和 IME 保留。

失败保留草稿，下一次修改或显式保存可重试，不会每帧无限重试。离页取消待处理工作；旧来源完成结果不能套到新主题。开发目录文件监听是另一个显式流程，不能与设置参数自动保存混为一谈。

## 交付前检查

逐个用鼠标、键盘和触屏修改；测试长本地化标签、0 音量、数值最后合法步长、颜色半输入、保存中再次输入、撤销资源授权、预览退出和重启。查看结果值与外观，而非只看编辑控件是否创建。


## 实现依据

- [Nexa.Services.Themes.Contracts/ThemeOptionCondition.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Services.Themes.Contracts/ThemeOptionCondition.cs)
- [docs/xsr/theme-live-options.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-live-options.md)
- [Nexa.Desktop/Ui/DesktopThemeSession.Resources.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Desktop/Ui/DesktopThemeSession.Resources.cs)
