# NexaCL 开发文档

[English](README.md) · [在线文档](https://docs.pcln.top/) · [第一个插件](https://docs.pcln.top/plugin-sdk/quickstart)

本文档面向插件作者、衍生启动器开发者和贡献者，按连续教程、任务指南、原理说明及参考组织。插件 SDK 使用 Bootstrap V1 和 ABI 100；主题、原生 Sidecar 与宿主 NXML 示例明确固定于 Alpha 14；PXML 保留为历史参考。

## 编辑正确的来源

插件文档在 NexaCL-Plugin-SDK 仓库编写，再按提交同步到本站。请修改源文档，不直接修改网站副本。其他章节和版本化示例由本仓库维护。中文主教程保留准确标识符，尚未翻译的技术参考明确标为英文原文。

## 本地构建

使用与 CI 一致的 Node 24 和 pnpm 11：

```sh
pnpm install --frozen-lockfile
pnpm docs:check
pnpm docs:build
pnpm docs:dev
```

构建产物位于 `.vitepress/dist`。检查会验证本地链接、来源元数据和版本边界，VitePress 构建也会检查链接。

## 同步 SDK

将 NexaCL-Plugin-SDK 放在同级目录，或设置 `NEXA_PLUGIN_SDK_SOURCE` 为其绝对路径。使用已审阅的干净提交后执行：

```sh
pnpm docs:sync
node scripts/sync-plugin-sdk-docs.mjs --verify
```

同步只替换中英文 plugin-sdk 目录，记录来源提交，并保留旧地址作为迁移入口。SDK 文档保持 Apache-2.0，其余网站文档使用 CC BY-SA 4.0。

## 验证和发布

网站示例 CI 使用固定 Alpha 14 源码验证真实 IPC、主题打包、NXML／NSS 和 NativeAOT。SDK CI 编译 Wasm 示例并验证正文代码与源文件一致；模板 CI 验证实际安装包。编译、运行时验收和发布是不同结果，必须分别核实。

推送 main 会触发 Cloudflare Pages 构建部署。部署后检查工作流及 docs.pcln.top 的实际页面，不能把本地构建成功当作已经上线。写作与审阅要求见[贡献指南](CONTRIBUTING.md)。
