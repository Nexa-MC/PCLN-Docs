# 开发、验证、恢复与发布

交付物是一个经过验证的外观目标，不只是能压缩的目录。按[目标开发流程](/development/goal-first)记录修改范围与证据；不要为了主题功能改写不相关下载或渲染架构。

## 开发目录与安装包是两种来源

开发目录可显式启用监听，Host 对 theme.json、NSS 和资源整体重新验证，约 300ms 防抖；编辑器以替换/重命名保存也在覆盖内。坏候选保留上一有效主题。监听归来源/会话生命周期所有，移除来源或进入恢复模式后不继续读取。

已经导入的 `.ntp` 使用自己的已准入内容快照。编辑打包前的目录不改变它；需要重新打包并导入。预览是暂时展示，不能用它覆盖已提交选择；退出预览应恢复原选择。

## 可复现打包

```sh
python NexaCL/eng/themes/pack.py PCLN-Docs/examples/themes/workshop --output workshop-1.0.0.ntp
python NexaCL/eng/themes/pack.py PCLN-Docs/examples/themes/workshop --output workshop-again.ntp
```

打包器将未压缩 mimetype 放在首项，固定时间戳并排序路径。相同输入应产生相同字节；可使用 `sha256sum` 或 PowerShell `Get-FileHash` 比较。输出放在源目录外，避免把旧产物装进新包。

| 容器/清单限制 | 数值 |
| --- | --- |
| manifest | 64 KiB / JSON 深度 16 |
| 文件项 | 4096 |
| ZIP 压缩包或单文件 | 128 MiB |
| 实际展开总量 | 512 MiB |
| NSS | 最多 64 文件，合计 1 MiB |
| 参数/安装来源 | 256 / 256 |

禁止绝对路径、路径穿越、符号链接/重解析点、重复或大小写冲突、Windows 设备名、结尾点/空格、反斜杠与驱动器/流分隔。不要在包中加入可执行文件或 NXML 替换页面。

## 便携编译与行为实验

```sh
dotnet run --project PCLN-Docs/examples/authoring-lab/Authoring.Lab.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- /absolute/path/to/PCLN-Docs
```

实验实际执行来源/清单准入、浅/深色 NSS 编译和保留式界面更新；还证明坏 NSS/动态形状会被拒绝。它不创建原生窗口，不验证 acrylic、媒体输出或 OS 托盘。

需要启动器级协调检查时，在隔离数据目录运行相应构建的 `Nexa.Desktop --validate-themes`。原生图像验证使用源码测试程序的 `--native-theme-preview light|dark OUTPUT`；命令需在对应目标平台构建，不声称跨 OS 自动验证。

## 逐项验收表

| 场景 | 需要观察 |
| --- | --- |
| 正常激活 | 清单、能力、资源、样式均通过，持久化选择一致 |
| 坏清单/NSS/图片 | 明确错误，上一有效主题可用 |
| 亮暗/窄宽/DPI | 可读、无溢出，命中/光标/裁剪一致 |
| 操作期间改主题 | 焦点、草稿、滚动锚点不重置 |
| 连续 A→B→A | 旧异步完成不重新挂资源 |
| 不完整颜色/数值 | 保留草稿，不把无效值持久化 |
| 文件授权撤销/导入参数 | 无未授权读取，不继承另一来源 grant |
| 减少动态效果/安全模式 | 不绕过 Host 保护，能恢复默认外观 |
| 重启/中断保存 | 只加载已提交或最后有效选择 |

## 发布内容

发布 `.ntp`、主题版本、兼容的启动器/style API、实际使用的必需/可选能力、资源许可证、已验证平台和操作步骤。说明外部文件需要用户选择；不分发个人绝对路径或依赖开发机器字体。

主题无签名不代表应用更新无签名。NTP 与可执行 `.nsc`、启动器更新包使用不同准入，不要通过改扩展名混用。

## 用户遇到坏主题时

引导恢复到上一个有效主题或 Host 的独立恢复入口。安全模式绕过第三方样式、媒体和监听。收集主题版本、有效能力、错误阶段与最小复现，不要求用户关闭保护或反复清空全部启动器数据。


## 实现依据

- [eng/themes/pack.py](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/eng/themes/pack.py)
- [docs/xsr/theme-package-architecture.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-package-architecture.md)
- [docs/xsr/theme-resource-security.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-resource-security.md)
