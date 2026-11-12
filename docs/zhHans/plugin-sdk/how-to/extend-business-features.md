# 通过宿主扩展启动器功能

完成[入门教程](../quickstart.md)后，再按照本页选择业务接口。先在实际宿主上协商能力，
确认权限和调用阶段，再调用方法。SDK 中存在一个方法，不代表旧版 Alpha 已经实现它。
支持范围以[宿主支持清单](../host-support.md)记录的提交为准。

## Provider 注册与消费

在 PreInitialize 注册回调，在 Initialize 提交 ProviderDescriptor。回调收到
BusinessProviderCall，需要检查 Kind、Method、输入和输出 Schema，再解码 Inputs。
成功时返回输出模型，只包装一层 AbiReply。不能把另一个传输信封作为业务数据返回。

新增 Provider 使用以下明确的回调表：

| 功能 | Kind | 回调 | 消费入口 |
| --- | --- | --- | --- |
| 实例诊断 | `nexa:diagnostics/rules` | InstanceSummary → DiagnosticAnalysis | AnalyzeWithProvider |
| 文件格式解析 | `nexa:content/format` | ContentInspectionInput → ContentInspection | InspectWithProvider |
| 项目翻译 | `nexa:catalog/translation` | CatalogTranslationInput → CatalogTranslation | ReadTranslatedProject |
| 账户配置 | `nexa:accounts/authentication` | SignInRequest → AccountProviderConfiguration | BeginSignIn |
| 加载器版本 | `nexa:install/loader-catalog` | LoaderVersionRequest → Page of LoaderVersion | ListLoaderVersions |
| Java 分发 | `nexa:java/distributions` | PageRequest → Page of JavaDistribution | ListDistributions |
| 下载源解析 | `nexa:downloads/source-resolver` | DownloadSource → DownloadSource | Resolve、Start |
| 下载传输 | `nexa:downloads/transfer` | DownloadChunkRequest → DownloadChunk | Start |

这些回调只允许查询，嵌套修改宿主状态会被拒绝。描述符使用 ContractVersion=100、
BusinessProviderCall 的摘要、Empty 配置 Schema、application 作用域和显式选择策略。
并发、超时、注册可见性和卸载行为见 [Provider 指南](../business-providers.md)。

诊断回调只接收公开实例信息；文件解析接收已授权文件的名称和不超过 64 KiB 的内容。
账户 Provider 仅配置 Yggdrasil 或 Nide8 的 HTTPS 地址，密码和令牌仍由宿主管理。
加载器 Provider 为宿主已支持的加载器提供版本目录，不提供任意安装程序执行权。

## 备份恢复、克隆和删除

恢复普通备份时，先获得一个指向不存在目标的可写 FileRef，调用
Backups.PrepareRestoreDestination。将返回的目标 ID、备份 ID 和备份版本交给
PreviewRestore，再执行 Restore。宿主在执行前确认、复查版本和目标授权，并通过备份
存储恢复数据。源实例不会被覆盖。

ImportInto 可将薄备份清单导入指定实例，适用于还没有备份的实例。原有 Import 使用
一个已列出的备份作为实例范围锚点。薄清单包含路径和哈希，不包含内容对象；导入成功后
仍应执行 VerifyOffline，才能判断是否可离线恢复。

世界快照使用独立的 ID 范围。依次调用 Worlds.ListBackups、PrepareRestoreDestination、
PreviewRestore 和 Restore。目标是同一实例 saves 下的新名称，原世界保留。

实例克隆采用 PrepareClone/CommitClone，绑定源版本、目标游戏根目录和新名称。
宿主先复制到暂存目录，最后发布重命名后的实例描述。克隆结果使用版本隔离；跨根目录
复制运行依赖时不会覆盖冲突文件。链接、运行中的游戏和超出预算的复制都会被拒绝。
全局启动器设置不属于实例目录，因此不会随文件复制重复创建。

删除实例时，RetainUserData=true 将版本目录移入 .recycle；false 永久删除该目录。
共享根目录数据和运行依赖保留。世界删除进入内容回收区；永久清空需要先调用
Content.PreviewClearTrash，再执行 ClearTrash。预览后新增的回收项不会被旧计划清除。

## 设置迁移

RegisterSchema 注册版本 1；RegisterVersionedSchema 注册明确的正整数版本。设置 ID
必须属于插件，默认值必须符合值 Schema，作用域为 global 或 instance。持久化使用
插件身份和真实作用域，不使用本次加载临时生成的实体 ID。

从版本 1 升级到版本 2 后，宿主不会把旧值直接当作新值返回。调用 Migrate，提供准确的
FromVersion、当前 ToVersion 和转换回调。回调解码 SettingMigrationInput，返回新
Schema 的值。宿主确认操作后，重新比较 Schema 和存储版本，再原子提交。

用户拒绝、转换失败或并发修改都保留旧值。迁移成功后再次提交同一迁移会得到版本错误。
建议转换保持确定性；不要为了改写本地偏好而添加不必要的网络依赖。RegisterPage 通过
现有渲染器注册已验证的 NXML 页面；注册 Schema 本身不会自动生成控件。

## 单次启动贡献

RegisterContribution 目前开放 MemoryMiB、Width 和 Height。回调接收并返回
LaunchProfile，只能改变声明过的字段。宿主按限定 ID 排序，第一个接受的贡献占用对应
字段。必需贡献失败会阻止启动，非必需贡献的失败进入 ExplainContribution。

RegisterPreflight 的 Fields 为空，回调返回 ValidationReport。预检在准备阶段和真正
执行前各运行一次。必需预检的无效结果或致命问题会阻止启动。涉及的定义发生变化或插件
卸载后，旧计划失效。接受的参数只作用于本次启动，不修改保存的配置和全局设置。

## 安装模板和中断恢复

模板指向同一插件拥有的工作流。工作流输入为 InstallTemplateInvocation，输出为 Empty。
调用 Instances.PrepareCreate 时指定模板 ID，宿主会在确认后执行该工作流。

工作流动作通过宿主接口完成安装、处理声明的内容，并等待子操作结束。基础游戏可以
先准备并提交内置 nexa:instance/java 模板，再安装附加内容。不能仅发起子操作就返回
成功。宿主会复查实际游戏版本和必需加载器；内容特有的校验由模板工作流负责。

ListRecoveries 列出已登记根目录内通过验证的待恢复日志。ResumeRecovery 继续安装；
如果日志已选择回滚，则继续回滚。DiscardRecovery 仅撤下恢复提示，保留现有和暂存
文件。RecoveryRecord.Operation 是原生任务关联值，不是 Tasks.Read 的句柄；应观察
ResumeRecovery 返回的操作。

## 发布前验证

用独立消费者插件验证 Provider，同时覆盖错误输出、取消和卸载。对修改操作，测试拒绝
确认、过期版本、重复提交和已存在目标。对设置迁移，实际运行“旧版本保存 → 卸载 →
新版本迁移 → 再次加载”，并确认失败时旧数据保持不变。

[英文完整指南](/en/plugin-sdk/how-to/extend-business-features.md)提供更多边界说明和恢复调用示例。

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/how-to/extend-business-features.md) · Apache-2.0.
