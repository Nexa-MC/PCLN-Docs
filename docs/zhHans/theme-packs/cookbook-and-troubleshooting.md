# 主题综合案例与排错

## 案例一：为弱视用户提高标题可读性

目标为“字号 20–32 可调，亮暗均清楚，按钮仍能键盘操作”。实现仅使用 Color、Range、NSS 标题选择器和 focus-visible 边框；没有新增 Sidecar 或全局页面重建。

先运行 twilight，调节参数并测试字体回退。增加下方规则时，将声明所在能力加入清单：

```css
Button.capsule:focus-visible { Border: #315b92; BorderWidth: 2; }
@when mode = dark {
  Button.capsule:focus-visible { Border: #b5d2ff; }
}
```

验收时 Tab 导航、触屏按下、亮暗切换和字号修改都应保留输入语义。对比截图与实际命中，不为实现“更显眼”修改 Enabled 或 IsVisible。

## 案例二：用户自己的背景与音乐

使用 workshop 的 File、Files、Directory 参数与资源种类。先在默认空路径、音乐关闭时导入；再通过选择器授予背景/音频；测试只有图片授权时不能读取音频，撤销后停止使用。

业务目标不是“能播我电脑上的文件”，而是“用户明确选择后可用，缺少文件或输出设备时可解释地降级，切换主题后资源不泄漏”。交付包包含包内背景，外部音乐不打包；附资源许可与用户选择说明。

## 案例三：有响应式网格的卡片

从[网格示例](./layout-and-motion)开始，先在宽窗口验证两列，再把第二列显式位置改为窄屏第一列。若某个布局容器在目标版本被改名，记录兼容范围或提供新的选择器，不猜测树结构。

对于资源目录不要用泛型 Height 去硬改虚拟行，使用目标 Host 已登记的专用指标。保持已有逻辑条目与滚动锚点是验收的一部分。

## 按阶段定位失败

| 现象 | 最可能的阶段 | 排查步骤 |
| --- | --- | --- |
| 导入即失败 | 容器/清单 | mimetype、根路径、未知/重复字段、JSON 类型、options 默认值 |
| 必需能力不足 | 能力协商 | exact 名称、当前平台是否提供、是否可改 optional fallback |
| 清单通过但样式失败 | NSS 编译 | 选择器、属性类型、token/option ID、禁写字段；暗分支也校验 |
| 文件存在却拒绝 | 来源/资源 | 规范路径、包内实际文件、来源/kind grant、链接和预算 |
| 字体能读但换行异常 | 原生测量 | 目标字形、字体许可、fallback、DPI 与测量/绘制一致性 |
| 没变化但无错误 | 匹配/覆盖 | 目标 Kind/Key/Class、后置规则、protected 虚拟几何 |
| 修改目录没更新 | 来源类型/监听 | 当前是否开发目录、是否启用监听、是否编辑了已安装快照外的文件 |
| 滑块释放后失败 | 数值/事务 | 最后合法步长、修订冲突、资源权限，保留草稿后显式重试 |
| 图标只在部分地方改变 | 载体区别 | window/tray/splash slot、原生解码，不是安装图标 |
| 重复切换出现旧媒体 | 生命周期 | 记录来源/代次、检查最小复现，不能通过关闭验签“修复” |

## 一个高质量问题报告

包含启动器标签、主题版本、OS/架构、主题来源类型、精简清单/样式、从默认外观开始的步骤、预期/实际结果、失败阶段。移除私人路径与媒体内容；必要时用可分发的小资源替代。

本地编译、原生运行和发布安装分别记录；如果只测 Linux，写“Linux 已测”，不要写“全平台支持”。保留一个不依赖外部路径的最小包，便于维护者复现。


## 实现依据

- [docs/xsr/ntp-v1.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/ntp-v1.md)
- [docs/xsr/theme-live-options.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-live-options.md)
- [docs/xsr/theme-resource-security.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/theme-resource-security.md)
