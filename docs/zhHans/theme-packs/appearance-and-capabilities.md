# 宿主外观字段与平台能力

NSS 改具体元素；appearance 描述有限的宿主外观资源与策略。二者都不能改变窗口生命周期、正版/更新信任、输入密码语义或系统权限。

## appearance 根字段

| 字段 | 可接受内容 | 作用 |
| --- | --- | --- |
| accentColor | `#RRGGBB` 或 `#RRGGBBAA` 字面量 | 当前宿主强调色，不自动绑定同名 option |
| windowMaterial | none / solid / blur / acrylic / mica | 请求有限原生材质，实际能力决定结果 |
| splashMotion | none / fade / breathe / draw | 有界启动图标动效 |
| resources | 下表中的固定资源槽 | 准备图标、背景、字体和媒体 |
| properties | 下表中的有限属性 | 字面量或已知标量 `option(id)` |

draw 约 600ms，breathe 为 1.8s 的 0.88–1 不透明度变化。Splash 初次创建使用内置或已验证的有限启动快照，不等待第三方 ZIP、NSS、字体和媒体扫描。置顶、初始化阶段切换和显示时长仍归 Host。

## 资源槽完整表

| 槽 | kind | 实际用途 |
| --- | --- | --- |
| launcherIcon / windowIcon / trayIcon / splashIcon | Icon 或 Image | 各运行期图标，不改安装程序元数据 |
| logo / icon-light / icon-dark | Icon 或 Image | 品牌/亮暗资源的有限宿主投影 |
| background | Image | 背景 |
| font | Font | 已准备字体 |
| music | Audio | 音乐资源/消费者 |
| video | Video | 视频资源/消费者 |

每个槽接受 `{expression,kind,required,fallback}`。optional（required=false 或省略）必须给 fallback；`none` 是安全空/默认值，也可给合法资源表达式。required=true 则主资源必须准备成功。

```json
{"windowIcon":{"expression":"asset(assets/icon.svg)","kind":"Icon",
 "required":false,"fallback":"none"}}
```

放在 appearance.resources 内，并把 `assets/icon.svg` 实际打包。不同图标载体可能有平台差异，应分别测试主窗口、托盘、恢复和启动屏，不以网页 SVG 显示成功代替原生结果。

## properties 完整表

| 属性 | 值 / 单位 |
| --- | --- |
| background-fit / video.fit | cover / contain / stretch |
| background-opacity | Number/Range，0–100 |
| background-color | Color/Text/Select，auto 或合法十六进制颜色 |
| window-opacity | Number/Range，40–100 |
| window-blur | Boolean |
| video.enabled / video.auto-pause | Boolean |
| music.enabled / music.startup / music.autoplay / music.shuffle | Boolean |
| music.media-controls / music.auto-pause | Boolean |
| music.volume | Number/Range，0–100 |
| animation-fps | Number/Range，1–240 |
| resize-policy | auto / immediate / deferred / animated / instant |

```json
{"background-opacity":"option(opacity)","music.enabled":"option(music.enabled)",
 "music.volume":"option(music.volume)","resize-policy":"animated"}
```

这段位于 appearance.properties，引用的选项必须存在且类型匹配。window-opacity 的 40 不是 NSS Opacity 的 0.4；不要混淆百分比与标量。properties 不接受文件类 option、任意运算或新的窗口方法。

resize 的 auto/immediate/instant 直接应用，deferred 等待约 120ms 静默期，animated 采用约 180ms 的共享布局/绘制/命中视口；减少动态效果时直接应用。

## 精确能力名称

| 能力 | 用途 |
| --- | --- |
| styles.basic、tokens、options、selectors | 基础外观、参数与选择器 |
| conditions、viewport | 模式/平台/宽高条件 |
| grid、position、order | 有限布局 |
| transform、transforms | 变换及一致命中 |
| virtual-metrics | 已登记虚拟容器的共享指标 |
| keyframes、animations | 有限关键帧 |
| images、svg、fonts | 图片、矢量和字体提供者 |
| opacity、gradients、shadows、translucency | 绘制/透明度契约，不承诺原生模糊 |
| runtime-icons、startup-appearance | 图标及有界启动外观 |
| media | 授权媒体资源与消费者，不保证输出设备 |
| window-acrylic | 有对应提供者的平台原生透明材质 |
| window-mica | 受支持 Windows 11 原生材质 |

优先使用表中规范复数名。required 用于目标不可缺少的能力；optional 用于可降级增强，例如 `{"name":"window-acrylic","fallback":"solid"}`。只有名义声明或 NSS 能编译，不足以声称 Windows/macOS/Linux 都有同一效果。

## 验收一套跨平台外观

先让 solid 背景能独立读清文字，再增加可选材质。测试亮暗、透明关闭、减少动态效果、不同 DPI、窄窗口、托盘恢复和 safe mode。记录“请求能力、实际能力、有效 fallback、平台与构建”，遇到不支持时显示明确降级而非伪成功。


## 实现依据

- [Nexa.Services.Themes/ThemeManifestReader.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Services.Themes/ThemeManifestReader.cs)
- [docs/xsr/theme-capabilities.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-capabilities.md)
- [docs/xsr/theme-package-architecture.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-package-architecture.md)
