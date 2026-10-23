# 资源：包内文件、授权与生命周期

一个主题引用资源时要同时解决“资源是什么、在哪里、谁允许读、多久有效、失败怎么办”。看见磁盘上存在文件，并不意味着 Host 可以把它作为当前主题资源。

## 包内资源的完整流程

```text
theme/
├── mimetype
├── theme.json
├── styles/main.nss
└── assets/background.svg
```

将以下对象放进 `appearance.resources`：

```json
{"background":{"expression":"asset(assets/background.svg)","kind":"Image",
 "required":false,"fallback":"none"}}
```

asset 相对当前已准入来源解析，不能 `../`、绝对路径、链接或网络 URL。资源文件必须实际进入包，不会从开发电脑字体或背景目录自动补齐。

也可以在 NSS 中使用 `BackgroundImage: asset("assets/background.svg")`。但 NSS 的直接资源引用需要自身准备成功；appearance 槽 optional/fallback=none 不会自动把独立 NSS 引用变成可选资源。

## 外部资源的授权链

用户经 Host 选择器选择文件/目录后，Host 保存绑定**来源身份、规范路径、资源种类、文件或目录范围**的 grant。file/folder 表达式只是访问声明；不产生权限。

在作者代码中优先通过 File/Files/Directory option 与 Host 的参数投影取得选择。NSS 可使用已选 File option 作为资源值；该值由 Host 规范化为资源表达式。不要把 Text 参数当路径脚本，不要拼接跨来源的绝对路径。

用 `folder()` 读取需要有界列表路由，不是单资源路由，也不是递归列出整个硬盘。目录枚举只处理当前层受支持文件，链接不能逃出授权范围。

## 字体与原生测量

```css
Text#TitleMain { FontFamily: asset("fonts/Author.ttf"); FontSize: 26; }
```

将有授权的 TTF/OTF 文件放入包，并声明 fonts 能力。Host 使用同一个已准备字体身份进行测量、排版与绘制。字体文件不包含某个字形时会走系统回退，不能假设每个平台回退完全相同。WOFF/TTC 和主题自带原生字体库不属于此契约。

发布时提供字体许可证。字体载入成功不等于中英文、emoji、不同 DPI 下都已验证；用实际标题与输入内容测试换行、裁剪、光标和点击位置。

## 图片、SVG 与媒体

支持的光栅包括 PNG/JPEG/WebP/BMP/ICO/静态 GIF；动画 GIF 被拒绝。SVG 是有限图形：几何、填充描边、渐变和组变换；不支持脚本、外部 URL、image/use 引用、渲染文本、CSS、滤镜、foreignObject 或嵌套 viewport。

SVG tile 使用已准备的同一矢量图刷，不按每个可见瓦片创建树。不要通过极小 viewBox 或叠加变换制造超大几何。

Audio/Video 使用稳定、Host 所有的资源 lease，经已有媒体消费者播放。media 能力不承诺机器一定有音频输出或任意解码器。必需媒体即使播放开关为关，也要通过有界真实解码预检；FFplay/声音输出可用性另行判断。

## 必须知道的预算

| 资源 | 限制 |
| --- | --- |
| 单个 Image/Icon/Font | 16 MiB |
| 原生 SVG | 1 MiB、4096 元素、最多 24 层祖先 |
| SVG 数值/合成变换系数 | 有限，绝对值 ≤1,000,000 |
| SVG viewBox 宽高 | 0.000001–8192 |
| SVG transform | 最多 2048 字符、32 次操作 |
| 已准备原生资源 | 256 项 / 合计 64 MiB，其中字体最多 32 项 |
| 单个 Audio/Video | 128 MiB |
| 目录播放列表 | 128 个准入顶层文件 / 256 MiB / 最多枚举 4096 项 |
| 单次激活资源 lease | 256 / 512 MiB |
| 活动与候选合计 lease | 512 / 1 GiB |

这些限制独立存在，单项不超限不代表总和可无限增长。实际读取/展开字节计入预算，不只相信 ZIP 头。

## 回退、换代与撤销

必需资源失败，候选不提交；可选资源先退役失败主资源，再准备声明的 fallback。fallback 也失败则保留上一有效主题。`none` 表示安全空/默认外观，不是偷偷读上一个主题的路径。

准备 A→B→A 时仍有不同单调代次。旧候选完成不能把媒体或图标挂回当前窗口；退休资源在最后一个场景借用释放后销毁。撤销 grant、移除主题、结束预览会按来源生命周期退役资源和监听。

将导出的选项导入另一台机器时，外部路径需要重新选择授权。仅改主题 id、复制同名包或恢复旧 JSON 都不能转移 grant。


## 实现依据

- [docs/xsr/theme-resource-security.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-resource-security.md)
- [Nexa.Services.Themes/ThemePackageService.Resources.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Services.Themes/ThemePackageService.Resources.cs)
- [Nexa.Desktop/Ui/DesktopThemeSession.Resources.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Desktop/Ui/DesktopThemeSession.Resources.cs)
