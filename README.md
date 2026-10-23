# NexaCL Docs

按目标开发和 XSR 架构组织的 NexaCL 第三方作者教程。详解 NTP/1、NSS/1、Sidecar 和 NXML，保留旧版插件 SDK/PXML 参考；省略通用语言基础。

- [开发方法与 XSR 架构](docs/zhHans/development/index.md) / [English](docs/en/development/index.md)
- [主题包教程](docs/zhHans/theme-packs/index.md) / [English](docs/en/theme-packs/index.md)
- [Sidecar 教程](docs/zhHans/sidecar/index.md) / [English](docs/en/sidecar/index.md)
- [NXML 宿主界面教程](docs/zhHans/nxml/index.md) / [English](docs/en/nxml/index.md)
- [可运行示例](examples/README.md)，以 `Nexa-MC/NexaCL` 的 `v2.0.0.alpha.12` 为依据。

33 章 × 中英文，包含目标验收、职责与通信契约、完整字段/API、逐步实例、失败/取消/退役以及发布证据。NXML 是宿主内部界面语言，不是主题或 Sidecar 的任意页面注入接口；独立 Plugin SDK/执行器的外部合同不在此虚构。

`authoring-examples.yml` 使用固定 A12 源码构建和执行示例、编译正文 NXML/NSS/JSON、验证主题打包及 NativeAOT。文档站仍使用原有 Cloudflare 自动部署流程。

| 环境 | 地址 |
|------|------|
| 生产 | https://docs.pcln.top/ |
| Cloudflare Pages | 项目名 `pcln-docs`（自动部署） |
| 预览 | https://pcln-docs.pages.dev/（首次部署后） |

## 本地

```powershell
pnpm install
pnpm docs:dev
```

插件 SDK 页面由 `PCL-N-Plugin-SDK/wiki` 同步：

```powershell
pnpm docs:sync
pnpm docs:build
```

默认从同级目录 `../PCL-N-Plugin-SDK/wiki`（及 `wiki-en`）读取，也可用环境变量：

- `PCLN_PLUGIN_SDK_WIKI`
- `PCLN_PLUGIN_SDK_WIKI_EN`

## Cloudflare Pages 部署

推送 `main` 触发 `.github/workflows/cloudflare-pages.yml`。

### 仓库 Secrets

在 **Settings → Environments → `cloudflare-pages` → Environment secrets**（或 Repository secrets）配置：

| Secret | 说明 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | Account → Cloudflare Pages → Edit（及 Account Settings → Read 等） |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |

可与 `PCL-N-Plugin-Center-Web` 使用同一套 Token / Account ID。

### 本地手动发布

```powershell
# 需 wrangler login 或设置 CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID
pnpm deploy:cf
```

### 自定义域

工作流会尝试把 `docs.pcln.top` 挂到 Pages 项目 **pcln-docs**。  
若 API Token **没有** `Zone → DNS → Edit`，自动写 DNS 会失败，需在 Dashboard 手动添加：

| 类型 | 名称 | 目标 | 代理 |
|------|------|------|------|
| CNAME | `docs` | `pcln-docs.pages.dev` | 橙云（Proxied） |

路径：Cloudflare Dashboard → **pcln.top** → DNS → 添加上述 CNAME。  
Pages → **pcln-docs** → Custom domains 中应出现 `docs.pcln.top`（Active）。

旧 **GitHub Pages** 站点已关闭；仓库内 `pages.yml` 仅保留退役提示。

### 与商店站共用 Token

可与 `PCL-N-Plugin-Center-Web` 的 Environment `cloudflare-pages` 使用同一套：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

建议权限至少：

- Account → Cloudflare Pages → Edit  
- Account → Account Settings → Read  
- Zone → DNS → Edit（Zone `pcln.top`，用于自动写 `docs` CNAME）
