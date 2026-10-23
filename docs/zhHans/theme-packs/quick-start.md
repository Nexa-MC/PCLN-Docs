# 制作第一个可调节主题

动手前先读[按目标开发](../development/goal-first)与[XSR 职责](../development/xsr-architecture)。本例的验收目标是：标题颜色、字号与按钮圆角可在外观页调节；重新打开页面不丢值；坏样式不替换上一个有效主题。不增加业务行为，也不读取外部资源。

## 1. 准备工程与完整目录

准备 Git、Python 3，以及可以运行 A12 的启动器。检出源码用于使用官方打包器，检出文档仓库用于取得完整示例；两个目录不必互相嵌套。

```sh
git clone --branch v2.0.0.alpha.12 --depth 1 https://github.com/Nexa-MC/NexaCL.git
git clone https://github.com/Nexa-MC/PCLN-Docs.git
```

```text
PCLN-Docs/examples/themes/twilight/
├── mimetype
├── theme.json
└── styles/
    └── main.nss
```

`mimetype` 为 UTF-8 文本 `application/x-nexa-theme`，允许一个结尾换行。不要把这三个文件再包进一个同名顶层目录；`theme.json` 必须位于容器根。

## 2. 阅读完整清单

下面是可直接保存的 `theme.json`，不是省略字段的伪代码。
```json
{
  "format": "NTP/1",
  "id": "example.twilight",
  "version": "1.0.0",
  "name": {
    "zh-CN": "暮色示例",
    "en-US": "Twilight example"
  },
  "styleApi": 1,
  "nss": "NSS/1",
  "styles": [
    "styles/main.nss"
  ],
  "requiredCapabilities": [
    "styles.basic",
    "tokens",
    "options",
    "selectors",
    "conditions"
  ],
  "optionalCapabilities": [],
  "optionsVersion": 1,
  "options": [
    {
      "id": "accent",
      "kind": "Color",
      "default": "#689fff",
      "label": {
        "zh-CN": "强调色",
        "en-US": "Accent"
      }
    },
    {
      "id": "title-size",
      "kind": "Range",
      "control": "Slider",
      "default": 26,
      "min": 20,
      "max": 32,
      "step": 1,
      "label": {
        "zh-CN": "标题字号",
        "en-US": "Title size"
      }
    },
    {
      "id": "rounded",
      "kind": "Boolean",
      "control": "Switch",
      "default": true,
      "label": {
        "zh-CN": "圆角按钮",
        "en-US": "Rounded buttons"
      }
    }
  ],
  "appearance": {
    "accentColor": "#315b92",
    "splashMotion": "fade",
    "resources": {}
  }
}
```

`styles` 的顺序是明确输入顺序，不自动扫描目录。三个 option 分别保存字符串颜色、数字字号、布尔值；`kind` 决定持久化类型，`control` 只选择 Host 的有限编辑器。

`appearance.accentColor` 是清单字面量，用于宿主外观；`accent` 参数通过下方 NSS 改标题等目标。名称相似不代表所有颜色会自动连动。

## 3. 保存完整样式

写入 `styles/main.nss`：
```css
@tokens { accent: option(accent); }
Text#TitleMain { Foreground: var(accent); FontSize: option(title-size); }
Button.capsule:hover { Border: var(accent); BorderWidth: 1; }
@when option(rounded) = true {
  Button.capsule { CornerRadius: 20; }
}
@when mode = dark {
  Button.capsule:hover { Border: #9fc5ff; }
}
```

`@tokens` 声明 token，`option(accent)` 读取本清单参数，`Text#TitleMain` 选择当前宿主标题，`:hover` 读取宿主交互状态。主题不创建这个标题，也不负责执行按钮命令。

## 4. 打包并导入

从两个仓库的共同上级目录运行，输出必须在主题目录外：

```sh
python NexaCL/eng/themes/pack.py PCLN-Docs/examples/themes/twilight --output twilight-1.0.0.ntp
```

在启动器“设置 → 外观与主题”导入 `.ntp`，先预览，再选择使用。拖动字号到 30 并释放，修改强调色，切换圆角。完整有效值会自动应用；输入不完整颜色时保留草稿与上一有效外观。

打包成功只证明容器生成成功；启动器还会执行清单、能力、来源和 NSS 准入。开发目录需通过对应导入/监听操作启用；编辑源码不会自动修改已经导入的 ZIP。

## 5. 执行验收

| 操作 | 预期结果 | 若不同先检查 |
| --- | --- | --- |
| 浅色/深色切换 | 文字可读，暗色规则生效 | mode 条件、后置规则和目标 Key |
| 改字号并释放 | 标题更新，控件不丢拖动所有权 | 数字是否在 min/max/step 内 |
| 颜色输入 `#` | 草稿保留，界面保持有效颜色 | 不是每个键入字符都能成为合法值 |
| 离页再返回/重启 | 已提交值保留 | 当前来源身份与 optionsVersion |
| 把 `Command` 写入 NSS | 候选被拒绝，保留有效主题 | 外观不允许写行为 |

可选择运行[便携实验项目](/nxml/complete-example)，它会对示例主题执行实际清单准入和 NSS 编译：

```sh
dotnet run --project PCLN-Docs/examples/authoring-lab/Authoring.Lab.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- /absolute/path/to/PCLN-Docs
```

这条命令需要 .NET 10 SDK。通过后继续[清单参考](./manifest-and-options)，再使用[控件工作坊](./options-recipes)扩展参数。


## 实现依据

- [eng/themes/pack.py](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/eng/themes/pack.py)
- [Nexa.Services.Themes/ThemeManifestReader.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Services.Themes/ThemeManifestReader.cs)
- [docs/xsr/theme-live-options.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-live-options.md)
