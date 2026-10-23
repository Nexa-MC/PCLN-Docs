# 制作第一个主题

## 准备源码

安装 Python 3，检出 NexaCL 的 `v2.0.0.alpha.12`，并下载文档仓库的 `examples/themes/twilight`。示例无需额外资源或外部路径授权。

```text
twilight/
├── mimetype
├── theme.json
└── styles/main.nss
```

`mimetype` 的内容必须是 `application/x-nexa-theme`。`theme.json` 声明格式、身份、能力和设置；样式文件必须列入 `styles`，不会自动扫描并加载目录内所有 NSS。

## 先修改样式

示例使用下列真实 NSS/1 语法：

```css
@tokens { accent: option(accent); }
Text#TitleMain {
  Foreground: var(accent);
  FontSize: option(title-size);
}
Button.capsule:hover { Border: var(accent); BorderWidth: 1; }
```

`TitleMain` 是当前宿主的页面元素键；它不是允许主题创建新元素的指令。跨版本升级时应重新检查目标键及样式能力。

## 打包与导入

在 NexaCL 源码目录运行，输出放在源主题目录之外：

```sh
python eng/themes/pack.py ../PCLN-Docs/examples/themes/twilight --output ../twilight-1.0.0.ntp
```

在启动器的“设置 → 外观与主题”中导入生成的 `.ntp`，预览后再选择使用。修改强调色、拖动标题字号滑块或切换圆角按钮，检查界面变化。

打包脚本只负责可复现容器，不能代替启动器的清单、能力、资源和 NSS 校验。开发目录的监听也是显式启用的操作；仅编辑磁盘文件并不意味着当前安装包已更新。
