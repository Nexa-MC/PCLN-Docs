# 平台能力与运行数据

正确解释平台能力和运行时测量，避免把缺失数据当作真实结果。本章记录特定版本的产品行为，并不自动授予 Sidecar 或插件权限。

**适用版本：**本章源码级示例固定于 `v2.0.0.alpha.14`。当前 Wasm 插件开发请阅读[插件 SDK](/plugin-sdk/)。

Alpha 14 的新增能力必须按实际平台事实使用，不能把“存在字段”解释成“此设备已提供测量”。扩展仍通过 Host 契约工作；以下产品能力不是自动新增的 Sidecar 权限或调用 API。

## 资源治理

Windows/Linux 提供显式 CPU 策略、CPU Sets/affinity 与 QoS；Linux 可通过用户级 systemd/cgroups 设置 CPU、内存和 I/O 配额，并申请 GameMode。设置捕获到下一次启动，默认保持 OS 策略；权限／能力不满足时明确拒绝显式请求。自定义 wrapper 不具备自有 JVM 的完整资源生命周期保证。

严重内存压力触发缓存回收与 Sidecar 协作 DEACTIVATE，恢复可能沿用同一个注册会话。扩展必须取消激活工作、释放 UI 租约并支持再次 ACTIVATE；不要靠进程未退出继续执行已停用工作。磁盘延迟、计费网络、电池和热状态会影响后台准入。

Minecraft 内存估算仍停用，不参与启动预检或自动分配堆内存；真实运行采样和操作系统压力策略与估算是三件不同的事。

## 本地集成与备份

Windows 提供任务栏下载进度和截图原生分享；macOS 提供 Quick Look/APFS clone，13+ 随包安装 Spotlight/App Intents 辅助程序；Linux 提供显式 Steam/Gamescope 注册。Steam Input、Siri 和设备功能仍取决于用户的系统配置，不声明云 CI 已覆盖个人硬件。

Btrfs/ZFS 快照只是备份捕获时的只读租约；需要精确子卷/dataset、无后代卷、已存在的权限。产品不 sudo、不创建 dataset；失败走经过校验的复制。所有恢复写入新目录，不能把快照接口当作任意活跃世界回滚 API。

## 运行遥测

`diagnostic.launch`（schema1）保存白名单配置，`diagnostic.mods`（schema2）保存有界元数据分页，`diagnostic.run` 保存周期样本，`diagnostic.run-summary`（schema1）保存实际结束汇总。单次随机 run ID 不等于用户标识。

配置 heap_mib 不是实测 heap，private bytes 不是 native/commit。-1 表示未测，0 可表示真实零；退出码另有 exit_observed。模组声明、嵌套候选和哈希不证明实际激活。缺页、超时和超预算必须保留“不完整”事实。记录不包含账户令牌、个人路径、存档内容或原始日志。

运行记录保留 30 天；日聚合与错误组 90 天；用户主动提交问卷 180 天。必要／诊断分级、预发布强制诊断和 stable 可撤回保持原策略。每第30次主 UI 启动提供可关闭的问卷，公告使用纯文本；不要把问卷关闭视为授权发送回答。

使用步骤、键值和排错见源码仓库[平台手册](https://github.com/Nexa-MC/NexaCL/blob/main/docs/platform-integration.md)与[运行诊断](https://github.com/Nexa-MC/NexaCL/blob/main/docs/runtime-diagnostics.md)。局域网接力／串流、AI 后端及后续显示适配仍延期，不以本页承诺交付。

## 检查结果

分别测试不可用测量与实际零值，确认不支持的平台操作保持不可用，后台工作能遵循停用与恢复生命周期。
