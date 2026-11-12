# NexaCL 插件开发文档

从一个可以安装、打开页面并响应按钮的插件开始，再逐步加入数据、后台任务和业务能力。
插件运行在 PluginSidecar 中，通过明确的宿主契约访问 NexaCL；账户、实例、文件授权和界面确认由宿主管理。

本版文档对应 **SDK 0.2.0-alpha.12、Bootstrap V1、ABI 100**。三个版本号分别表示分发包、加载接口和协商后的 ABI，不能互相替换。SDK 声明了 346 个操作，记录的宿主源码快照接入了 308 个；具体 Alpha 是否支持某项能力，应以实际协商结果为准。

## 跟着教程完成一个插件

1. [构建并加载第一个插件](quickstart.md)：准备工具、修改身份、生成 ZIP，再验证加载和卸载。
2. [页面与确认动作](tutorials/page-and-action.md)：理解资源、页面、动作和回调如何连接。
3. [状态与持久化存储](tutorials/state-and-storage.md)：区分当前视图和持久数据，正确处理版本冲突。
4. [后台工作流](tutorials/workflows.md)：运行完整示例，观察任务并理解恢复边界。
5. [测试与发布](tutorials/test-and-release.md)：验证权限拒绝、取消、重载和离线行为，再分发已核验的包。

## 理解运行规则

阅读[架构与职责](architecture.md)、[加载生命周期](loading-contract.md)和[权限](permissions.md)，再查阅[异步调用](guides/asynchronous-calls.md)与[离线使用](guides/offline.md)。这些规则解释了为什么“调用成功”“任务完成”和“外部副作用已确认”是不同的结果。

## 按目标查找做法

- [读取实例列表](how-to/read-instances.md)
- [预览并执行修改](how-to/mutations.md)
- [访问包内资源和用户文件](how-to/files.md)
- [实现业务 Provider](business-providers.md)
- [排查加载或调用失败](errors.md)
- [从旧 SDK 迁移](migration.md)

[API 参考](api/index.md)提供准确的权限、阶段、输入输出及宿主支持状态。技术参考当前以英文源文为准，中文教程保留所有代码标识符和错误码。不要把历史提案中的规划当成已经发布的功能。

[在线文档](https://docs.pcln.top/plugin-sdk/) · [模板仓库](https://github.com/Nexa-MC/NexaCL-Plugin-Template)

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/zh-CN/index.md) · Apache-2.0.
