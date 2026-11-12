# 构建、调试与发布

区分验证、调试产物和发布产物。使用源映射定位问题，并检查实际分发的二进制。

**适用版本：**历史 PXML 1.0 及其匹配运行时。当前插件请使用 [ABI 100](/plugin-sdk/)。

## 推荐目录

```text
Ui/
├ Pages/
├ Components/
├ Shared/Templates.pxml
├ Styles/
├ Resources/
└ Localization/
```

页面、Component 和 Import 必须由构建图显式列出，避免 glob 顺序或隐式文件访问影响可重现性。

## 快速检查

```bash
pxmlc format Ui/Pages/Home.pxml -o Home.formatted.pxml
pxmlc check Ui/Pages/Home.pxml --strict \
  --component Ui/Components/ActionCard.pxml \
  --import Ui/Shared/Templates.pxml
```

格式化不改变语义。CI 应使用 `check --strict --warn-as-error`，并把 `path:line:column` 诊断映射回编辑器。

## 常规构建

```bash
pxmlc --full Ui/Pages/Home.pxml -o out/Home.pxb \
  --component Ui/Components/ActionCard.pxml \
  --import Ui/Shared/Templates.pxml \
  -D RELEASE --release --strict --warn-as-error
```

`--full` 在一个进程内完成 Expander、Optimizer 和 Compiler，避免中间文件 I/O。需要排查阶段结果时再使用：

```bash
pxml-expand Home.pxml -o Home.expanded.pxml --component ActionCard.pxml -D DEBUG
pxml-opt Home.expanded.pxml -o Home.pxir --debug
pxml-compile Home.pxir -o Home.pxb --debug --strict
```

## 查看 PXB

```bash
pxmlc inspect out/Home.pxb
pxmlc dump out/Home.pxb
```

`inspect` 检查 header/section，`dump` 查看 node、property 和 binding 结构。Debug build 保留 Source Map；Release 使用内容指纹检测损坏与非确定性，但该指纹不是发行签名。

## Build symbol

标准 symbol 包括 DEBUG/RELEASE、WINDOWS/LINUX/MACOS 以及产品 edition。相同输入、编译器版本、profile、symbol 与资源必须生成 byte-identical PXB。CI 可以连续构建两次并逐字节比较。

## 运行时加载边界

PCL.UI.Next **只接受编译后的 PXB**。运行时通过 `UiBlueprint.FromPxmlBinary(...)` 加载不可变 Blueprint，**不会**在进程内解析 `.pxml` 源文件。开发期请始终走 `pxmlc` / `pxml-compile` 产出 `.pxb`，再交给宿主或插件 UI 管线。

## 发布边界

- Core UI 的 PXB 随应用发布，由 Runtime ABI/version gate 验证。
- Dynamic package 需要 manifest、权限、资源与签名；Binding VM 只允许白名单 opcode/function。
- Release archive 的 SHA256/签名负责真实性；BSDIFF 只优化传输。
- 三阶段 PGO corpus 必须分开训练 Expander、Optimizer 和 Compiler 热点。

## 排错顺序

1. `format` 排除不稳定文本格式。
2. `check --strict` 修复最早的 source diagnostic。
3. 查看 expanded PXML，确认 Component/IfBuild/Const 已正确处理。
4. `dump` 对照 PXB node/property/binding。
5. Runtime DevTools 查看 Binding、Layout、Motion 和 Scope trace。

最后阅读：[完整页面示例](./Complete-Example)。

## 检查结果

分别构建调试和发布输出，验证预期的源映射差异。
