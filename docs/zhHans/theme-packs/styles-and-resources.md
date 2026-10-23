# 样式、资源与平台适配

## 样式是外观，不是程序

NSS/1 支持类型化 token、option、有限选择器与条件。以下片段可在示例中直接使用：

```css
@when option(rounded) = true {
  Button.capsule { CornerRadius: 20; }
}
@when mode = dark {
  Button.capsule:hover { Border: #9fc5ff; }
}
```

原生高级示例还包含 `@when platform = linux`、视口规则、网格、变换和有限关键帧。请以 [随包高级主题](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Desktop/Themes/Advanced/styles/main.nss) 为语法参考，并在清单中声明实际使用的能力。

主题不能修改业务命令、enabled/visible/selected/password 等宿主状态、弹层归属和关闭行为。资源列表等虚拟布局的视口、行身份、滚动锚点及预算归宿主管理；专用 item metrics 与一般容器 Height 不可混用。

## 资源来源

- `asset("fonts/DejaVuSans.ttf")` 解析当前已准入主题内部的资源，路径不越出主题来源。
- `file()`、`folder()` 需要用户经宿主选择器授权，并绑定来源身份、资源类型与规范化路径。它们不是绕过授权读取绝对路径的函数。
- 导出参数、改主题 ID、重新导入同名包，都不能转移旧来源的授权。

字体、图片和媒体需要各自能力、大小预算及原生解码支持。引用资源前，把文件实际包含在包内；不要依赖开发电脑上恰好存在的文件。

## 亮暗模式与降级

同时测试浅色、深色、系统跟随及至少两种窗口宽度。缺少必需能力时启用失败；可选能力采用其声明的 fallback。不要要求透明材质才能读清文字。减少动态效果优先于主题动画。

主题切换与资源准备使用同一激活代次；过期资源完成不会重新挂回新主题。启用失败保留上一有效主题；安全恢复不授予新的外部读取权限。详见 [资源边界](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-resource-security.md)。
