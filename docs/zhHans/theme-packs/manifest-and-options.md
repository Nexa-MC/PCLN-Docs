# 清单与设置控件

## 根字段

NTP/1 严格校验清单，未知字段、重复字段和不匹配的值类型会被拒绝。

| 字段 | 示例 / 作用 |
|---|---|
| `format` / `styleApi` / `nss` | `"NTP/1"` / `1` / `"NSS/1"` |
| `id` / `version` | `example.twilight` / `1.0.0`；主题版本独立于启动器版本 |
| `name` | 本地化对象，如 `{"zh-CN":"暮色","en-US":"Twilight"}` |
| `styles` | 按明确顺序加载的相对 NSS 路径数组 |
| `requiredCapabilities` | 必须可用的能力名称数组 |
| `optionalCapabilities` | 如 `{"name":"window-acrylic","fallback":"solid"}` |
| `optionsVersion` / `options` | 参数架构版本及参数列表 |
| `appearance` | 有限宿主外观字段；完整可用样例见示例清单 |

## 九种值类型

| `kind` | JSON 默认值 | 常用显示控件 |
|---|---|---|
| `Boolean` | `true` / `false` | Switch、CheckBox、Segmented |
| `Number` | 数字 | Input；指定有效边界后可用 Slider |
| `Range` | 数字，含 min/max/step | Slider 或 Input |
| `Text` | 字符串 | Input |
| `Color` | 合法颜色字符串 | 颜色编辑器或 Input |
| `Select` | choices 中的字符串 value | Segmented；至少两项时可用 Slider |
| `File` / `Directory` | 字符串 | 宿主文件/目录选择器 |
| `Files` | 字符串数组 | 宿主多文件选择器 |

文件类选项必须声明 `resourceKind`：Image、Icon、Font、Audio 或 Video。`label`、`description` 和 choices 的 label 可本地化；`group` 分组，`visibleWhen` 使用协议规定的有限条件，不执行表达式脚本。

## 选择控件

`control` 可省略（Automatic），或设为 Switch、CheckBox、Slider、Segmented、Input。

```json
{
  "id": "title-size", "kind": "Range", "control": "Slider",
  "default": 26, "min": 20, "max": 32, "step": 1,
  "label": {"zh-CN": "标题字号", "en-US": "Title size"}
}
```

Switch/CheckBox 只接受 Boolean。Segmented 接受 Boolean 或 Select。Input 接受 Number、Range、Text、Color。Select 滑块保存选择的 value，不保存下标。Number 滑块需要有限、递增的边界和有效步长；数值范围不超过 ±1e12，步数不超过 1e9。范围 0～10、步长 3 的最后一个合法值是 9。

## 保存与实时应用

完整合法的修改在短暂静默后合并应用；拖动滑块时保留拖动所有权，释放后应用最终值。不完整数字或颜色保留草稿和上一有效外观。显式保存可用于重试；失败不会每帧无限重试。

参数按来源身份及 optionsVersion 保存；同名主题不继承另一个安装来源的文件授权。参数导入/导出也不携带外部读取权限。详见 [实时应用契约](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-live-options.md)。
