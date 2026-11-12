# 插件打包与分发

插件包把身份、执行配置、能力请求和资源字节绑定为可审阅产物。模板在根目录生成 `plugin.json`、`plugin.wasm` 和 `page.nxml`，不要再加外层文件夹。

## 清单的核心字段

| 字段 | 含义 |
| --- | --- |
| manifestVersion | 清单格式版本，示例为 1 |
| pluginId／pluginVersion | 插件身份和版本；注册 ID 必须一致 |
| bootstrapVersion | 加载契约版本，不能用 SDK 包版本替换 |
| target | 执行配置及平台限制，示例为 nexa-wasm-1 |
| declaredAbiCandidates | 声明的 ABI 候选，示例为 [100] |
| requiredCapabilities／optionalCapabilities | 必需和可选契约及其最小版本 |
| requestedPermissions | 请求宿主授予的权限 |
| webAssemblyEntryPath | Wasm 的包内相对路径 |
| payloads | 实际资源路径、字节长度和 SHA-256 |

依赖、冲突及声明式入口的完整字段见英文参考。模板的 plugin.config.json 是简化配置，构建器负责补齐清单；需要更多元数据时，应同时扩展构建和校验。

## 固定 SDK 输入

SDK 发布包包含两个 NuGet 包、头文件、契约、示例和文档。消费者固定提交、版本、文件名、长度和外层摘要，再核对内部摘要及身份。托管项目把 packages 目录作为本地 NuGet 源；在 GitHub 发布不表示已经上传 nuget.org。

## 区分摘要与信任

摘要证明字节一致，不证明发布者身份。开发者模式下的本地包与生产 Market 准入不同；SDK 不签发权益或持有私钥。生产分发还需可信获取、身份与权益验证，以及宿主明确的离线策略。

修改任何包内资源后重新构建，不能手改摘要或绕过校验。发布前按[测试教程](tutorials/test-and-release.md)验证实际行为，并在说明中列出测试过的宿主版本和权限。

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/zh-CN/packaging.md) · Apache-2.0.
