# 清单完整参考：身份、参数与版本

清单是 Host 的输入契约。字段名区分大小写；未知字段、重复字段、类型不匹配和无效默认值都导致准入失败。不能依赖“Host 忽略我不认识的行为字段”。

## 根对象的每个字段

| 字段 | 是否必须 | 语义与限制 |
| --- | --- | --- |
| `format` | 是 | 精确为 `NTP/1` |
| `id` | 是 | 1–128 个 ASCII 字符，以字母或数字开头，余下允许字母数字、`.`、`_`、`-` |
| `version` | 是 | 独立主题版本，如 `1.0.0`；使用点分数字文法，可选点分预发布后缀，不能直接套用连字符 SemVer |
| `name` | 是 | 非空本地化对象；最多 64 个语言键，语言键长度 1–64 |
| `styleApi` | 是 | 整数 `1` |
| `nss` | 是 | 精确为 `NSS/1` |
| `styles` | 是 | 1–64 个显式相对 `.nss` 路径，忽略大小写后不可重复，按顺序加载 |
| `requiredCapabilities` | 否 | 最多 128 项精确能力名，缺少任意一项则拒绝 |
| `optionalCapabilities` | 否 | 最多 128 个 `{name,fallback}`；与必需项合并后不得重复 |
| `optionsVersion` | 否 | 1–65535，默认 1；参数架构版本，不是主题内容修订号 |
| `options` | 否 | 最多 256 个唯一 ID 的参数定义 |
| `appearance` | 否 | 有限外观字段；[完整参考](./appearance-and-capabilities) |

整个 manifest 最多 64 KiB，JSON 深度最多 16。一般文本上限 4096 字符，禁止 NUL。相对路径不可绝对化、越界、带链接或使用跨平台歧义名称。总包预算见[测试与发布](./testing-and-publishing)。

## 参数公共字段

```json
{
  "id": "title-size", "kind": "Range", "control": "Slider",
  "default": 26, "min": 20, "max": 32, "step": 1,
  "label": {"zh-CN":"标题字号", "en-US":"Title size"},
  "description": {"zh-CN":"释放滑块后应用。", "en-US":"Applies after release."},
  "group": "style"
}
```

| 字段 | 含义 |
| --- | --- |
| `id` | 稳定、唯一，使用根 ID 的字符文法；保存后改名相当于新参数 |
| `kind` | 实际值类型，不随显示控件改变 |
| `default` | 必须符合类型、边界、步长、choices 或颜色文法 |
| `label` | 必需的非空本地化对象；提供 zh-CN/en-US 便于两种语言阅读 |
| `description` | 可选本地化说明；不能包含可执行表达式 |
| `group` | 可选分组名，不是自定义布局或控件工厂 |
| `visibleWhen` | 只决定当前编辑项是否展示，语法见[控件实战](./options-recipes) |
| `control` | Automatic/Switch/CheckBox/Slider/Segmented/Input；只能选择兼容的 Host 编辑器 |
| `min` / `max` / `step` | Number/Range 的有限数值规则 |
| `choices` | Select 的 value/本地化 label 列表，最多 256 项，value 唯一 |
| `resourceKind` | 文件类必须指定 Image/Icon/Font/Audio/Video，决定授权和准备类型 |

## 九种类型逐一说明

| kind | JSON 默认值示例 | 持久化语义 | 适用场景与注意事项 |
| --- | --- | --- | --- |
| Boolean | `true` | 布尔值 | 圆角、播放开关；不能用字符串 `"true"` 代替 |
| Number | `26` | 有限数字 | 字号等数字；Slider 必须显式给 min/max |
| Range | `25` | 有限数字 | 固定区间、步长和滑块；不是两个端点的数组 |
| Text | `"sans-serif"` | 字符串 | 字体族或有限声明文字；不会自动创建页面文本 |
| Color | `"#68a5ff"` | 合法颜色字符串 | 参数格式为 `#RRGGBB` 或 `#RRGGBBAA`，不接受 CSS 颜色名 |
| Select | `"compact"` | choice.value 字符串 | 保留稳定 value，不保存翻译 label 或下标 |
| File | `""` | 单个路径字符串 | 背景或字体；非空路径仍需来源绑定的 Host 授权 |
| Files | `[]` | 字符串数组 | 播放列表，最多 256 项，不是分号拼接路径 |
| Directory | `""` | 目录字符串 | 有界资源枚举；不意味着递归读取任意磁盘 |

Files 不使用一个普通字符串承载数组。文件类 `resourceKind` 缺失时拒绝，不会根据扩展名猜授权类型。完整九种类型的有效定义在 [workshop/theme.json](https://github.com/Nexa-MC/PCLN-Docs/blob/main/examples/themes/workshop/theme.json)。

## 数字不是只检查 min/max

有效数字满足 `min ≤ value ≤ max`，同时 `(value - min) / step` 必须接近整数。若不声明 min，Number 的步长基准使用 0。Range 缺省 min/max 为 0/100；为避免意外，作者应显式写出全部边界。

Range/数值 Slider 要求 `min < max`、正 step、step 不大于跨度、边界绝对值不超过 `1e12`、步数不超过 `1e9`。默认 step 若省略由 Host 推导，不应依赖其推导替代业务设计。

例如 min 0、max 10、step 3，合法值为 0、3、6、9。右端不是 10；滑块、End 键和增加按钮都会停在 9。把默认值写成 10 会导致清单失败，而不是自动吸附后保存。

## 版本、来源身份与选项导入

`version` 表示包内容发布版本；`optionsVersion` 表示参数架构。修复颜色无需随意提高参数架构版本。改变参数类型、choice.value 或步长时先考虑已保存数据如何继续合法，并使用新版本在测试源验证。

参数按**来源身份和架构版本**保存。相同 id 的另一个包不会继承旧包的外部资源 grant。导出/导入包含值，不包含读取权；导入成功也不能让缺少授权的路径自动可读。不要加入脚本迁移函数，NTP 不执行它们。

## 常见拒绝示例

| 写法 | 原因 | 改法 |
| --- | --- | --- |
| Boolean default=`"false"` | JSON 类型不符 | 写 `false` |
| Range default=10、step=3、min=0 | 步长不合法 | 使用 9 或调整真实步长 |
| File 没有 resourceKind | 资源类型不明 | 明确 Image/Font 等 |
| Select default 是中文 label | 不在 value 集合 | 保存稳定 value |
| appearance 下新增 `script` | 未知行为字段 | 主题保持声明式，改走独立扩展 |


## 实现依据

- [Nexa.Services.Themes/ThemeManifestReader.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Services.Themes/ThemeManifestReader.cs)
- [Nexa.Services.Themes.Contracts/ThemeContracts.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Services.Themes.Contracts/ThemeContracts.cs)
- [docs/xsr/theme-live-options.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-live-options.md)
