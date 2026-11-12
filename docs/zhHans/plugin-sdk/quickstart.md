# 构建并加载第一个插件

完成本教程后，你会得到一个包含 Wasm 程序和 NXML 页面的插件 ZIP。打开页面并点击按钮，宿主会请求确认，批准后由 PluginSidecar 执行回调。整个过程不需要私有运行时仓库。

## 准备环境

安装 Git、Python 3.12 或更高版本，以及包含 WebAssembly 目标和 `wasm-ld` 的 LLVM Clang。Debian／Ubuntu 可使用 `clang` 和 `lld` 软件包。也可以使用官方 WASI SDK 的 Clang；本示例显式构建无导入的 Wasm，不依赖 WASI。

准备一个与[宿主支持快照](host-support.md)兼容的 NexaCL 开发版本，并启用开发者模式。本教程的可执行插件不需要 .NET；只有可选的托管契约示例和 SDK 测试需要 .NET 10。

```sh
python --version
clang --version
wasm-ld --version
```

如果找不到链接器，先修复工具链。增加插件权限无法解决编译器或链接器缺失。

## 1. 创建项目

在[模板仓库](https://github.com/Nexa-MC/NexaCL-Plugin-Template)选择 **Use this template**，然后克隆自己的仓库。只想试运行原始示例时，可以执行：

```sh
git clone https://github.com/Nexa-MC/NexaCL-Plugin-Template.git
cd NexaCL-Plugin-Template
```

以下命令均在该目录运行。`wasm/plugin.c` 包含生命周期和动作回调，`wasm/page.nxml` 描述页面，`plugin.config.json` 配置身份和权限，`sdk.lock.json` 固定 SDK 的发布版本、提交、长度和摘要。

## 2. 修改插件身份

在 `plugin.config.json` 中修改 `id`、`version`、`title`，例如 `example.notes`、`0.1.0` 和 `实例便签`。第一次构建保留其余配置。正式发布前使用自己控制的 ID。

构建脚本把同一个 ID 传给 C 的 `PLUGIN_ID`，并替换 NXML 中的占位符。这样按钮和动作属于同一命名空间；不要只修改一处动作 ID。

## 3. 构建并核验

```sh
python eng/build.py --clang clang
python eng/verify_package.py
```

首次构建会下载并校验锁定的 SDK，然后编译程序、计算资源摘要，生成 `artifacts/plugin.zip`。核验脚本检查清单和实际内容。压缩包根目录应包含：

```text
plugin.json
plugin.wasm
page.nxml
```

`managed-contract/` 不会进入安装包。该目录的 DLL 用于说明 Bootstrap 契约，不是桌面端生产插件的另一种可执行格式。

## 4. 加载并验证

打开兼容版本的插件管理页，选择 ZIP，审阅身份、摘要和请求的权限，再按开发者加载流程准入。打开插件页面，点击 **Run action／执行操作**。批准宿主确认后，回调返回 `Desktop action completed`。

再次点击并拒绝确认，回调不应执行。随后停止或卸载插件，确认页面消失。这些检查验证运行时行为；编译成功不能替代它们。

加载失败时保留加载报告，按[排错指南](errors.md)定位。必需能力不受支持时，应使用兼容宿主或缩小功能需求，而不是任意添加权限。

## 5. 修改页面

编辑 `wasm/page.nxml` 的标题，重新构建并加载新 ZIP，确认标题变化。修改源码不会更新已经准入的包；修改压缩包资源后也必须重新生成清单摘要。

继续阅读[页面与确认动作](tutorials/page-and-action.md)，理解刚才运行的完整调用链。

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/quickstart.md) · Apache-2.0.
