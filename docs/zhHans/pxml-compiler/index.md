> 兼容参考：本节属于旧版独立 SDK/PXML 文档，不是 NexaCL Alpha 14 的 Sidecar 或共享 NXML API。当前开发请从[目标与 XSR](../development/)进入。

# PXML

这里汇总 PXML UI 的教程与官方编译器文档。

## PXML UI 教程

从 [教程概览](/pxml-compiler/ui-tutorial/) 开始，逐步学习页面结构、布局、文本、按钮、Command，以及从 `.pxml` 到 `.pxb` 的完整构建流程。

## PXML Compiler

PXML Compiler 是 PXML 1.0 的官方 C17 原生工具链。它在构建期把 authoring PXML 转换成确定性的 PXB blueprint；运行时不需要 XML parser、反射或动态组件发现。

项目仓库：[PCL-N-Edition/PXML-Compiler](https://github.com/PCL-N-Edition/PXML-Compiler)  
发行版：[GitHub Releases](https://github.com/PCL-N-Edition/PXML-Compiler/releases)

## 安装

从 Release 下载对应压缩包并把 `bin` 加入 `PATH`。每个包包含四个程序、五个静态库、公开头文件、三份平台专用 PGO profile 和格式文档。

| 平台 | 架构 | 官方编译器 | Release 资产 |
|---|---|---|---|
| Windows | x86-64 | LLVM Clang | `pxml-windows-x86_64.zip` |
| Windows | ARM64 | LLVM Clang | `pxml-windows-arm64.zip` |
| Linux | x86-64 | LLVM Clang | `pxml-linux-x86_64.tar.gz` |
| Linux | ARM64 | LLVM Clang | `pxml-linux-arm64.tar.gz` |
| macOS | x86-64 | Apple Clang | `pxml-macos-x86_64.tar.gz` |
| macOS | ARM64 | Apple Clang | `pxml-macos-arm64.tar.gz` |

## 工具边界

- `pxml-expand`：组件、属性、默认/命名插槽与 `x:IfBuild` 展开。
- `pxml-opt`：expanded PXML lower 到 compact PXIR，再做常量折叠与规范化。
- `pxml-compile`：optimized PXIR 的类型/binding 验证与 PXB 输出。
- `pxmlc --full`：一个进程内完成三阶段，不落盘中间结果，是 IDE/常规构建的推荐入口。

工具链使用 arena、interned `uint32` string/node IDs、连续 PXIR、线性 optimizer、开放寻址表和精确 binary layout。x86-64 Clang build 对热扫描 primitive 做运行时 AVX2 dispatch；ARM64 使用 NEON。

解析器拒绝 DTD、外部实体和任意 processing instruction；PXIR/PXB reader 检查 magic、版本、长度、索引/拓扑、section 对齐/重叠和内容指纹。当前内容指纹用于确定性与损坏检测，不是发行签名。
