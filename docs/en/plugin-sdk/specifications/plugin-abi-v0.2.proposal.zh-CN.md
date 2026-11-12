# Historical design proposal

This is design history, not the current implementation reference.

````text
# NexaCL 插件 ABI 设计 v0.2

日期：2026-11-11  
范围确认修订：2026-11-11，ABI 100 纳入声明式内容包、完整业务页面替换和第三方 Provider。  
权限模型修订：2026-11-11，插件与 Sidecar 的扩展能力对等，唯一固有权限差异为原生执行权限；撤销此前按业务层/底层功能划分的限制。  
代码基线：Nexa-MC/NexaCL，main，b888cb901f5a7a4ec8b960bc95505dad1dc30e70。  
范围：插件作者使用的契约、内容模型、业务能力、扩展点、生命周期与兼容规则。  
状态：设计提案；未修改仓库，未实现 SDK。文中的接口名除明确标注“现有”者外均为拟议名称。  
本稿更新此前加载 ABI 草案的插件使用面；不继续规定 Sidecar 的实现、进程布局、传输编码或函数补丁接口。

## 1. 设计目标与边界

**插件与 Sidecar 共享同等的公开 ABI、业务能力和扩展能力，唯一固有权限差异是是否具有原生执行权限。插件没有原生执行权限，Sidecar 具有；不能再按“业务层插件、底层功能 Sidecar”人为分层。**

此前的 Minecraft 数据包类比只表达自由度下限，不构成插件功能上限，也不要求复制其格式、命令语法或游戏 tick。插件可以通过公开能力生成、部署真正的游戏数据包，也可以实现远超静态内容包的逻辑与服务。

用户已确认：

- 插件不提供函数补丁。
- ABI 100 同时支持声明式内容包与代码注册，二者共用相同契约语义。
- ABI 100 支持完整业务页面替换；宿主授权、停用与恢复入口保持独立可达。
- ABI 100 支持第三方 Provider，并允许插件声明新的服务契约、Provider 类型、业务动作与消费逻辑；不能仅因业务类型为新增就要求改做 Sidecar。
- 插件与 Sidecar 的唯一固有权限差异是原生执行权限。文件、网络、UI、服务注册等能力按同一授权规则处理，不按扩展身份额外降级。
- 所有协商后的 ABI 能力统一由 ABIContext 提供，按能力组组织。
- 加载阶段、ABI 版本协商、实验接口永久兼容、冲突双方禁止加载、热加载冲突后的停用规则沿用本文第 12、13 节。
- 独立 PluginSidecar 负责加载管理；这不意味着每插件一个进程。
- 本次仅设计插件 ABI。

按新要求修订的能力边界：

| 创作者需要做的事 | 插件能力 |
| --- | --- |
| 定义新的实例模板、安装方案、启动配置、规则、面板和工作流 | 直接支持 |
| 编写自定义计算、条件、动作处理逻辑 | 支持，宿主交互通过已协商 ABI |
| 添加资源目录源、整合包解析器、诊断规则及新的服务类型 | 注册或定义契约、Provider 与消费者 |
| 组合宿主操作，构建新的安装、备份、管理体验 | 支持 |
| 在公开业务阶段检查或贡献数据 | 使用明确的 ExtensionPoint |
| 将内置页面换成自己的完整页面 | 在可替换的公开视图契约下支持，保留宿主管理与恢复入口 |
| 新服务、新算法、新网络协议逻辑、自定义绘制与交互 | 能在受控执行环境和公共 ABI 中表达即可由插件实现 |
| 加载任意本机动态库、调用任意本机函数、执行自带机器码 | 属于原生执行权限，插件不可用 |
| 访问宿主私有对象或任意替换其方法 | 公共 ABI 不提供；原生执行权限也不等于获得宿主私有对象契约 |

“至少数据包自由度”不应被解释成“只能填写静态配置”。继续保留代码插件与现有生命周期；内容声明可以是文件，也可以由插件代码生成。声明式创作与代码 SDK 使用同一套稳定语义。脚本语言与包内文件语法另行定义，不锁死在 ABI 中。

### 1.1 原生执行权限的操作性定义

为使上述要求可实现，本稿将原生执行定义为：扩展可以执行或载入不受插件受控执行环境约束的本机代码，或进入任意本机调用入口。该定义是本稿对用户术语的具体化，不预先指定语言、虚拟机或封装格式。

| 操作 | 插件 | Sidecar |
| --- | --- | --- |
| 运行自定义逻辑、算法、状态机和协议处理 | 支持 | 支持 |
| 使用完整公开 ABI，注册新服务、Provider 和 UI | 支持 | 支持 |
| 通过相同授权规则使用文件、网络、存储和渲染服务 | 支持 | 支持 |
| 调用宿主启动 Minecraft、下载、绘制等已定义业务操作 | 支持 | 支持 |
| 载入任意 DLL/SO/dylib、FFI/PInvoke 至任意本机入口 | 不支持 | 具有原生执行能力 |
| 执行自带机器码或通过通用命令入口执行任意外部程序 | 不支持 | 具有原生执行能力 |

宿主服务内部用原生代码完成下载、文件访问、绘制或游戏启动，不表示调用者获得原生执行权限。受控运行时如何解释或编译插件逻辑，也不能直接等同于插件获得任意机器码执行权。判断依据是扩展能否脱离受控语义执行其选择的本机代码。

统一授权原则：业务能力、作用域、平台可用性和资源配额使用同一模型；在其他授权条件相同的情况下，不得用 isPlugin 禁用非原生能力。Sidecar 的自身原生执行仍受操作系统账号及平台权限约束，不自动具有管理员权限。

不得通过通用 ExecuteShell、LoadNative、CallAddress 或跨扩展代理把原生执行权限转授给插件。插件可以调用原生服务提供的具体业务能力，例如图片解码；服务必须限制到该业务语义。允许任意程序路径、机器码或本机符号作为参数的通用执行器仍属于原生执行。

这也意味着：任意 JVM 参数、类路径、自定义安装动作等入口必须验证其实际效果；不得借“启动配置”包装任意本机载荷或命令执行。按明确游戏/工具业务契约启动目标与提供通用原生执行器必须在接口中区分，相关策略不能只依赖操作名称。

实现必须覆盖代码入口、依赖、动态加载、互操作及间接调用路径，证明插件不能取得原生执行权限；只在 ABIContext 上隐藏几个方法并不足以满足此要求。本文保留对受控运行时方案的选择，不把普通托管代码标签本身当作已经实现的隔离保证。

“唯一差异”描述功能开放与执行权限，不要求两种扩展采用相同部署包或内部加载实现。本稿仍只设计插件使用面，不重设计 Sidecar。

## 2. ABI 完整性的判断标准

完整性包含两个维度：

1. **业务覆盖**：宿主向用户提供的公开业务动作，应有对应的查询、命令、状态或事件契约。涉及用户确认的动作保留其业务确认流程。
2. **可组合性**：插件能够把这些能力组合成新内容和新流程，而无需等待宿主为每种创意新增专用方法。

另有一项强制对等约束：同一公开非原生能力对插件与 Sidecar 采用同一契约和授权规则。未在本文列举的新业务领域不自动成为 Sidecar 专属；若公共 ABI 缺少必要的非原生表达能力，应补齐该能力。

因此不能止于 EventAbility、UiAbility、InterPluginAbility。基础层至少包含：

| 能力 | 用途 | 典型作品 |
| --- | --- | --- |
| Definitions / Registries / Tags | 注册有类型、有名字的内容及集合 | 实例模板、资源分类、整合包预设 |
| Predicates | 判断对象、状态、环境、设置 | “仅当实例为 Fabric 且内存不足” |
| Actions / Commands | 调用已有业务动作与自定义动作 | 下载、安装、备份、启动、通知 |
| Workflows / Schedules | 顺序、分支、并行、等待、重试、恢复 | 一键装包、退出后备份、定期维护 |
| State / Storage | 会话状态、持久数据、变量与计数器 | 最近使用、下载统计、实例健康等级 |
| Events / UI | 响应变化、交互、展示新结果 | 自动化管理面板、安装向导 |

应建设一份 ContractCatalog：每个公开操作记录 ID、版本、输入输出 schema、权限、阶段、状态源、错误、幂等性与可组合方式。新内置功能验收时，必须明确其插件可用面；不能默认“有一个 public C# 类型就是已开放 ABI”。

## 3. 单一上下文与能力分组

推荐 SDK 结构：

```csharp
// 以下为语义草图，不是可直接编译的 SDK。
ABIContext {
    Info; Contracts;
    Definitions; Predicates; Actions; Workflows; Schedules;
    Events; State; Commands;
    UI; Settings; Storage; Files; Network;
    Downloads; Tasks;
    Accounts; Catalog; Minecraft; Themes; Backups;
    Platform; Plugins; Diagnostics; Resources;
    Experiments;
}
```

- 能力按组访问，不把全部函数平铺成巨型接口。
- Minecraft 再按 Instances、Install、Java、Launch、Processes、Content、Worlds、Servers、Diagnostics 分组。
- Resources 专指生命周期资源、注册句柄和释放；在线模组、整合包目录统一称 Catalog，避免“资源”歧义。
- Context 绑定 PluginId、LoadInstanceId、协商版本和能力集合。它们不可被插件修改。
- Context 可以长期保存；StageContext 只描述一次生命周期调用。事件与工作流回调接收自己的 InvocationContext。
- 缺失的可选能力返回明确的 CapabilityUnavailable；SDK 提供 TryGet/IsAvailable，不用一连串容易误用的 null。
- 入口可见不表示任何阶段都可以调用；每个方法仍有阶段与作用域要求。
- Context 保存协商结果，运行时权限撤销和句柄失效仍可使调用失败。不可变上下文不等于永不失效的授权。
- 全部 Host 交互可异步完成；不把网络、安装、跨插件请求伪装成同步本地方法。

### 3.1 协商

```csharp
OnPreInitialize(pre):
    draft = pre.GetABIContext(100)
    if draft == ABI_FALSE:
        return Incompatible(pre.LastReply.Error)

    exp = pre.GetExpermentABI(EXP_ID)
    if exp != ABI_FALSE:
        draft.Include(exp)         // 拟议的组装操作
    draft.Require("nexa.minecraft.launch", 1)
    draft.Optional("nexa.catalog", 1)

    abi = pre.MakeABIContext(draft)
    if abi == ABI_FALSE:
        return Incompatible(pre.LastReply.Error)

    return Declaration(
        abi, dependencies, conflicts, publicContracts)
```

正式约定：

- GetABIContext 的参数为 100 的正整数倍；0、负数与 101 都无效。
- 100、200 表示 ABI 代际，不是“随便取一个更高版本”。请求 100 应获得 100 语义的兼容面。
- Get 返回可组装的 Draft；Make 成功才得到业务可用的 Ready Context。
- GetExpermentABI 保留用户已有名称；若 SDK 增加正确拼写别名，必须映射到同一操作。
- Get、Make 都返回随本次回复携带的结构化失败原因；上例 LastReply 仅表示该调用结果，不能实现成共享全局 LastError。
- 实验能力具有不可变 EXP_ID、schema 与行为。改变不兼容语义必须分配新 EXP_ID。
- 下个 ABI 大版本合入实验能力后，旧 EXP_ID 及旧行为永久兼容。内部实现可以复用，不能把旧调用悄悄重定向到行为不同的新接口。
- Make 一次性检查必需能力、实验组合、平台与授权。可选项缺失可以继续，必需项缺失必须失败。
- Active 阶段不能静默扩大该实例的协商面；新增能力通过重新加载协商。已有已授权能力中的数据、实例、内容可动态变化。

这里的 ABI 同时规定类型、操作和行为兼容；C# 等语言的包装只是 SDK 便利层。本文不指定传输编码或暴露宿主 CLR 实例。

## 4. 基础数据契约

| 类型 | 约定 |
| --- | --- |
| QualifiedId | 建议使用 namespace:path，例如 example.backup:after_exit；命名空间绑定发布者/插件，保留 nexa |
| EntityId | 实例、账户、任务、会话等稳定 ID；不使用列表下标作为外部身份 |
| Revision | 不透明并发版本标记；客户端只能保存、比较、回传，不自行递增 |
| Snapshot<T> | value + revision + schemaVersion + observedAt |
| Page<T> | items + opaqueNextCursor；不强制每个源支持数字页码 |
| Result<T> | success(value) 或 failure(AbiError)，两者互斥 |
| Operation<T> | operationId + 可观察状态 + 最终 Result<T> |
| Registration | owner、loadInstance、definitionId、状态与释放句柄 |
| BlobRef / FileRef | 有作用域与生命周期的数据引用，不等于任意本地路径 |
| Cancellation | 调用者取消请求；取消被接受不代表已无副作用 |
| MutationPlan | planId、revision、inputsHash、影响摘要、确认要求、有效性约束 |
| AbiError | code、messageKey、参数、operationId、correlationId、retryable、details |

错误码至少区分 ABI_UNSUPPORTED、EXPERIMENT_UNAVAILABLE、CAPABILITY_DENIED、STAGE_DENIED、SCHEMA_INVALID、NOT_FOUND、STALE_REVISION、PLAN_STALE、CONFLICT、DEPENDENCY_MISSING、CANCELLED、DEADLINE_EXCEEDED、PROVIDER_UNAVAILABLE、HANDLE_EXPIRED、PLUGIN_STOPPED。

错误不携带跨边界的 Exception 对象。当前仓库 DownloadAttemptError 包含 Exception，不能直接照搬为插件返回结构。

### 4.1 调用与状态规则

- 普通查询不改变业务状态；执行命令必须有明确的写入目标。
- Mutation 支持 expectedRevision。发生竞争时返回当前版本摘要，不能默认覆盖。
- 有副作用的重试使用 IdempotencyKey，作用域至少包含 PluginId、操作类型、目标与键。相同键但不同输入必须拒绝。
- 幂等记录保留时间由接口报告；外部网络操作不宣称绝对 exactly-once。无法确定的执行结果表示 OutcomeUnknown，并提供查询/人工解决途径。
- 长操作返回 Operation；取消、失败和完成只能有一个权威最终状态。
- 状态订阅从快照加 cursor 开始，检测缺口后重新同步。
- 所有句柄绑定加载实例；热加载后的旧句柄不得自动指向同 ID 的新实例。
- 所有权、释放方法、复制/借用规则写进 schema。字符串按文本值处理，字节数据独立；不暴露裸对象地址。

## 5. 内容注册：让插件能“创造新东西”

### 5.1 注册表

每个 RegistryDescriptor 定义：

```text
registryId, schemaId, schemaVersion
entryIdentity, referenceTypes
mergePolicy, orderingPolicy
activationPolicy, ownershipPolicy
supportedOperations, validationRules
```

推荐 API：

```text
Definitions.ListRegistries / DescribeRegistry
Definitions.DefineRegistry / Register / RegisterBatch
Definitions.Get / Query / Watch
Definitions.UpdateOwned / RemoveOwned
Definitions.RegisterTag / ResolveTag
Definitions.PreviewOverlay / RegisterOverlay
```

DefineRegistry 允许插件声明自己的有类型内容集合。它能被自己的动作、UI 和其他明确依赖它的插件消费，但不会凭注册自动使宿主理解一种全新引擎行为。

插件可同时注册该内容的消费者、动作、服务或渲染逻辑，使新类型形成完整功能。原生执行只限制实现方式，不限制谁有权定义新类型。

基础公开注册表建议覆盖：

| 注册表 | 数据及消费者 |
| --- | --- |
| instance_templates | 目录布局、游戏与加载器要求、配置默认值、安装流程；实例创建消费 |
| install_profiles | 软件源、版本条件、内容集合、可选项；安装向导消费 |
| launch_profiles | 内存、Java 选择、窗口、参数与环境的受检配置；启动消费 |
| resource_collections | 资源引用、标签、推荐及适用条件；目录与 UI 消费 |
| content_rules | 内容兼容、依赖补充、禁用建议；内容规划消费 |
| diagnostic_rules | 匹配条件、解释与修复建议；诊断消费 |
| backup_policies | 触发、保留、目标、排除与恢复选择；备份消费 |
| actions / predicates / workflows | 可复用动作、条件、工作流；运行时与 UI 消费 |
| ui_pages / ui_components / ui_contributions | 页面、组件、挂载声明；UI 消费 |
| settings_schemas / localizations | 类型化设置、翻译条目；设置与呈现消费 |

注册表必须写明消费者。没有消费路径的注册表只是存储，不能计作完成的扩展功能。

### 5.2 命名、标签与覆盖

- 每个条目独立 QualifiedId，可引用同插件、宿主或依赖插件的条目。
- Tags 是有类型的集合；支持加入、移除、引用其他标签，循环必须报错。
- 跨插件引用可以是 Required 或 Optional；Required 必须纳入必需依赖关系，不能偷偷依赖临时发现的服务。
- 自己的内容允许替换或删除；他人内容通过可审计 overlay 贡献修改。
- 每个注册表明确 Add、Merge、Replace、Mask 是否允许及合并算法。列表去重规则、对象字段合并、删除标记不可含糊。
- Mask 表示本插件生效期间屏蔽该定义，撤销后恢复，不销毁原始条目。
- 不用文件枚举顺序决定覆盖结果。使用声明的 before/after、用户选择或明确的合并策略。
- 两个互斥替换没有选择结果时，Checkup 报冲突；用户已定的冲突双方阻止加载规则适用。可合并内容不误判为插件冲突。
- Active 中自身动态条目允许按预先注册的 schema 与目标集合更新，必须经校验和原子发布；不能借动态更新扩大宿主替换范围或新增加载冲突关系。
- 允许动态数据进入的注册表还必须定义删除行为和现有引用行为：冻结快照、拒绝删除或使后续调用失败，不允许悬空引用。

### 5.3 内容包与代码共用语义

推荐让包内静态声明和 Initialize 的 Register 调用最终生成同一种 Definition。工具可离线校验、补全 ID、展示引用图和冲突原因。不要维护两套行为略有不同的“无代码模式”和“代码模式”。

## 6. 条件、动作、工作流与调度

### 6.1 条件 Predicates

```text
Predicates.Register
Predicates.Evaluate
Predicates.Describe
```

内置条件覆盖布尔组合、比较、集合/标签成员、游戏/加载器版本、文件存在、有效设置、账户能力、平台能力、实例状态、任务结果、时间窗口。

- 条件本身无副作用；所有输入显式声明。
- 可运行自定义条件处理程序，但不能在判断中执行安装、写文件或弹出登录。
- Evaluate 接收快照与一致性标识。后续执行若依赖该结果，须验证相关 Revision；“检查通过后状态已经改变”不能当作永远有效。
- 条件结果包括 true/false/unknown/error；缺失权限或未知平台不是自动 false。

### 6.2 动作 Actions

```text
Actions.Register / Describe / Invoke
Commands.List / Describe / Execute
```

ActionDescriptor 至少声明输入输出、所需能力、作用域、幂等性、取消、预览、确认要求、补偿能力、UI 元数据。Commands 是宿主公开命令目录，Actions 将宿主命令和插件处理程序统一成可组合动作。

支持自定义业务逻辑，但通过公开能力完成宿主交互。不存在 ExecuteInternalMethod、ResolveHostObject、HookAnyCommand 等兜底接口。

### 6.3 工作流 Workflows

```text
Workflows.Register / Validate / Preview
Workflows.Start / Read / Watch / Cancel
Workflows.ListRuns / Resume / RetryStep
```

建议支持以下节点：

| 节点 | 语义 |
| --- | --- |
| Sequence | 顺序执行，前一步输出可绑定后一步输入 |
| If / Switch | 根据条件分支 |
| ForEach | 遍历明确的输入集合，可选择并发上限 |
| Parallel | 明确 all、any-success 等完成规则 |
| Action / Subflow | 调用动作或其他工作流 |
| Delay / WaitEvent | 可取消等待；持久工作流保存等待状态 |
| Retry | 次数、退避、适用错误与幂等要求 |
| Try / Finally / Compensate | 清理与补偿；不声称撤销一切外部影响 |
| AskUser | 标准表单/确认步骤，可中断与恢复 |
| Checkpoint | 持久化已完成步骤与有效输入引用 |
| Return / Fail | 确定输出或结构化失败 |

通用变量支持 typed value、局部作用域、集合与引用；不必暴露 CLR 对象。允许循环与递归组合，但调度有可协商预算、取消点、深度与工作量约束，不让声明式流程无期限占用 UI。

持久化流程绑定插件版本、工作流定义摘要、schema 和完成步骤。升级时只能显式迁移、沿用仍可执行的旧定义或终止待处理运行；不能把旧运行静默接到新步骤编号。

### 6.4 调度 Schedules

```text
Schedules.Register / List / Enable / Disable
Schedules.TriggerNow / ReadNextRun
```

支持周期、指定时间、事件触发、去抖和合并；时区显式，错过触发策略选择 Skip、Coalesce 或 ReplayBounded。

每个工作流可定义并发策略：并行、队列、拒绝重复、替换尚未开始的运行。默认“应用运行期间调度”；没有独立后台能力就不承诺关闭启动器后继续运行。插件停用后停止新触发，已有运行进入取消/清理。

示例：游戏退出事件 → 判断实例标签包含“重要存档” → 创建备份 → 执行保留策略预览 → 依授权执行清理 → 更新插件统计 → 通知用户。这不需要函数补丁，也不需要为这项功能专门新增宿主方法。

## 7. 事件、状态与公开业务扩展点

### 7.1 三种机制分开

| 机制 | 作用 | 能否改变本次宿主操作 |
| --- | --- | --- |
| Event | 已发生事实的通知 | 不能靠返回 false 撤销事实 |
| State | 查询/订阅当前投影 | 只读宿主状态；自有状态可写 |
| ExtensionPoint | 宿主公开的业务协商或计划贡献阶段 | 只在定义的字段、结果和期限内影响 |

插件不获得任意函数、任意事件或所有命令的通配拦截权。需要影响安装或启动时，使用相应业务契约，不捕捉内部调用顺序。

### 7.2 事件契约

```text
Events.Describe / Subscribe / Unsubscribe
Events.Define / Publish
State.Describe / Read / Watch
State.DefineOwned / UpdateOwned / CompareExchangeOwned
```

事件带 eventId、schema、entityId、revision、occurredAt、correlationId、causationId、origin 与 scope。

- 不承诺所有插件间全局排序；明确按实体或流分区排序。
- 状态通知可合并；业务完成事件不能静默丢弃。缓冲不足返回 Gap/ResyncRequired 或持久游标。
- 如采用至少一次投递，订阅方按 eventId 去重。临时订阅与可恢复订阅必须标记。
- 事件触发动作再产生同类事件时，保留因果链，支持 IgnoreSelf、去重与重入策略。
- OnActive 后才投递常规运行事件；初始化阶段只验证订阅定义。
- 自定义事件受命名空间约束，不能伪造宿主发布者。发布与订阅的 schema 版本分别检查。

### 7.3 ExtensionPoint 契约

建议公开以下契约，名称为设计项：

| 扩展点 | 输入 | 允许的输出 |
| --- | --- | --- |
| instance.create.plan | 创建意图、模板、目标 | 内容与配置计划贡献 |
| install.resolve.plan | 选定版本、内容、源 | 额外依赖、合法来源、安装步骤描述 |
| content.update.plan | 内容与候选更新 | 筛选、约束、分组及建议 |
| launch.configure | 启动意图、有效设置、实例快照 | 允许字段的 LaunchContribution |
| launch.preflight | 冻结的公开计划 | 通过、警告、阻止理由、修复动作 |
| crash.analyze | 经过授权的日志与环境事实 | 诊断结果、置信说明、修复计划 |
| backup.plan | 范围与目标 | 包含/排除规则、元数据 |
| ui.compose | 公开视图与语义节点 | 合法页面贡献、视图替换 |

每个扩展点定义注册阶段、模式、截止时间、调用顺序、超时策略、重入规则与结果合并方式。读取方式采用快照，不让多个插件并行修改同一个可变计划对象。

扩展点可提供两种模式：

- Advisory：失败形成警告，符合契约的宿主原流程仍可继续。
- Required：缺失/错误阻止当前业务操作，给出可追溯原因。

Required 的业务失败不自动等于加载期插件冲突，不触发全插件停用；用户已定的冲突检查仍在加载 Checkup 阶段。

## 8. 完整业务能力目录

以下是目标 API 面，不表示仓库已提供这些插件入口。每组都须配套 typed schema、状态与错误，不能仅实现一个字符串 Invoke。

### 8.1 Minecraft.Instances

```text
List / Read / Watch / Discover
ListRoots / AddRoot / RemoveRoot
PrepareCreate / CommitCreate / Select / Rename
PrepareClone / CommitClone / PrepareDelete / CommitDelete
ReadIdentity / ReadEffectiveSettings / OpenDirectory
```

实例使用稳定 InstanceId；目录迁移后保持身份。根目录采用 RootRef。删除、克隆等返回影响预览和 Operation。实例模板可选择版本、加载器、隔离模式、内容集与默认设置。

### 8.2 Minecraft.Install

```text
ListGameVersions / ListLoaderVersions / InspectLocalInstaller
ReadDraft / UpdateDraft / ValidateDraft
ResolvePlan / PreviewPlan / ExecutePlan / Cancel
ListRecoveries / ResumeRecovery / DiscardRecovery
RegisterTemplate / RegisterLoaderProvider
```

安装方案是受检数据：文件、摘要、源、解包、继承、依赖、配置与已注册动作。模板和 Provider 不直接修改宿主安装事务状态。

LoaderId 为命名空间 ID，不把扩展能力锁死在内置枚举。插件可实现新的解析、规划、解包和安装动作，并通过公开动作/服务契约组合进安装流程；只有其实现必须执行不受控本机代码时才需要原生执行能力。新增非原生安装动作不能仅因不是内置动作就要求 Sidecar；事务引擎仍需验证动作声明的副作用、取消和恢复语义。

### 8.3 Minecraft.Java

```text
List / Discover / Inspect / ReadRequirements
ResolveSelection / SelectGlobal / SelectForInstance
ListDistributions / PrepareInstall / Install / Remove
RegisterDistributionProvider
```

Provider 提供元数据与下载计划，宿主验证架构、运行时版本和文件。插件可组合自动选择策略；选择与安装结果保留来源及可解释理由。

### 8.4 Minecraft.Launch

```text
ReadEffectiveProfile / ListProfiles / SaveProfile / SelectProfile
Prepare / ReadPlan / ValidatePlan / Start / Cancel
RegisterContribution / RegisterPreflight
ReadAttempt / WatchAttempt
```

采用 LaunchIntent → Contributions → FrozenPlan → Preflight → Start：

- Intent：InstanceId、AccountId/授权引用、启动配置、联机/存档目标。
- Contribution：内存、分辨率、Java 选择建议、经过授权的 JVM/游戏参数、环境变量、内容 overlay、平台策略。
- 每字段有明确合并规则。标量写入冲突不能靠“最后一个插件赢”；列表需要逐项身份与添加/排除语义。
- 宿主身份凭据采用不可见引用，在最终执行时解析；公开计划与日志不返回令牌。
- 冻结计划绑定配置、内容、账户选择和所用 Provider 版本。必要输入改变则 PLAN_STALE 并重新规划。
- Preflight 后任何影响执行的改动都需要重新校验，不能继续使用旧的通过结论。
- 自定义参数/类路径可能使游戏加载额外代码；这是明确的游戏启动配置能力，需对应范围授权，不因此赋予修改 NexaCL 运行时的能力。
- 安全启动策略仍由宿主决定可接受字段，并把被抑制贡献的原因返回作者和用户。

当前 MinecraftLaunchRequest 包含凭据、原始 VersionJson 和进程参数，不能直接把它原样当插件 LaunchRequest。现有业务能力应投影到上述稳定对象。

### 8.5 Minecraft.Processes

```text
ListSessions / ReadSession / WatchSession
SubscribeLog / ReadLogRange
RequestClose / Stop / RevealWindow
ReadMetrics
```

仅操作 ABI 允许的游戏会话；按 SessionId 处理。日志流有游标与背压。插件自己的任务可观察游戏结束，但不取得任意宿主进程句柄或注入接口。

### 8.6 Minecraft.Content

```text
List / Inspect / Watch / ReadDependencyGraph
PlanInstall / PlanEnable / PlanDisable / PlanRemove / PlanUpdate
Preview / Execute / ListTransactions / Rollback
ReadIntegrity / Verify / ListTrash / RestoreTrash / ClearTrash
Import / Export / RegisterFormatProvider
```

覆盖 Mod、ResourcePack、Shader、DataPack、World 及可扩展内容类型。任何类型进入宿主实例管理前须有已注册处理契约，不能只增加字符串就假装支持其安装语义。必需/可选依赖、版本范围、冲突与安装影响在计划中展示。

### 8.7 Minecraft.Worlds / Servers

```text
Worlds.List / Read / ReadMetadata
Worlds.Copy / Rename / PlanDelete
Worlds.ListDataPacks / PlanSetDataPack / ApplyDataPackPlan
Worlds.Backup / PreviewRestore / Restore / ReadHealth
Servers.ListSaved / SaveList / ReadStatus / DiscoverLan
Servers.Join
```

世界操作尊重运行中锁和 Revision。服务器列表允许自定义页面管理；Join 仍走正式启动/连接意图。不承诺插件可以凭这些接口操纵游戏内部玩家或新增方块逻辑。

### 8.8 Catalog：资源与整合包来源

```text
ListProviders / DescribeProvider / RegisterProvider
Search / ReadProject / ListVersions / ReadVersion / ReadChangelog
ResolveFiles / ResolveDependencies
ListFavorites / SetFavorite
PlanInstall / PlanUpdate / ExecutePlan
RegisterCollection / RegisterTranslationProvider
```

ResourceRef = ProviderId + ProjectId；VersionRef 额外带 VersionId。ProviderId 为开放命名空间 ID，分页支持游标，内容种类用已注册 ID。

CatalogProvider 基础回调：Describe、Search、ReadProject、ListVersions、ResolveVersion；可选 Changelog、Dependencies、Categories、Translations。不能要求每个源都伪造 Modrinth 或 CurseForge 字段。

下载使用宿主 Downloads，安装使用正式内容事务。增加一个软件源应能贯通搜索、详情、版本、依赖、下载、更新及失败重试，而不只在 UI 中展示几张卡片。

### 8.9 Accounts：账户与外观

```text
List / ReadPublic / Watch / Select
BeginSignIn / ContinueSignIn / CancelSignIn
Refresh / SignOut / Remove
ReadLaunchEligibility / RequestLaunchGrant
ReadWardrobe / PreviewSkin / UploadSkin / SetCape
RegisterProvider
```

- 采用 AccountId 和公开资料投影，不向普通插件开放全部 LaunchProfile。
- 自定义 AccountProvider 实现宿主已定义的登录状态机、刷新与身份结果；凭据保存到该提供者作用域。
- 插件可以通过网络与自定义状态机实现新的身份协议，或注册新的身份服务契约；参与现有 Minecraft 启动流程时须提供它所需的身份结果。只有调用任意本机 SDK 等原生实现方式需要原生执行权限，新协议本身不是限制条件。
- AccountProvider 可使用其自有凭据授权网络请求，但不能借此读取其他提供者的令牌。
- 普通插件调用启动时提交 LaunchGrant，不需获得 AccessToken。
- 皮肤、披风能力随账户提供者报告；Unsupported 与失败分开。

### 8.10 Settings / Themes / UI

```text
Settings.RegisterSchema / RegisterPage / Get / GetEffective / Watch
Settings.PreviewChange / Apply / Reset / Migrate
Settings.ListProfiles / SaveProfile / SelectProfile
Settings.BeginTemporaryOverlay / EndTemporaryOverlay

Themes.List / Read / Prepare / Preview / Commit / Revert
Themes.ReadOptions / SaveOptions / ResetOptions
Themes.ImportOptions / ExportOptions / MigrateOptions
Themes.ListResources / ReadResource / ReleaseResource
```

设置覆盖插件、宿主公开项、实例和启动配置作用域。GetEffective 返回最终值与来源。写宿主设置需要公开 SettingId 与权限；不开放直接替换设置文件。

主题包沿用独立的 .ntp 约束；插件自己的 NXML/NSS UI 扩展不改变主题包只按其协议修改样式与布局的规则。

### 8.11 Backups / Downloads / Tasks

```text
Backups.List / Read / Statistics / PrepareCapture / Capture
Backups.PreviewRestore / Restore / VerifyOffline
Backups.Export / Import / PreviewPrune / Prune
Backups.ReadRetention / SetRetention

Downloads.Resolve / Start / Read / Watch / Pause / Resume / Cancel
Downloads.Verify / RegisterSourceResolver

Tasks.CreateOwned / Report / Complete / Fail
Tasks.List / Read / Watch / Cancel / Retry / Dismiss
```

- 插件长操作可以进入统一任务中心，有进度、阶段、取消与可重试语义。
- 下载公开多源、摘要、目标引用与失败分类；引擎线程、TLS 实现、连接函数替换不在插件面。
- SourceResolver 返回来源候选与元数据；另开放 TransferProvider，使插件可通过受授权的网络字节流实现新的协议、分段和传输策略。宿主保留目标提交与完整性校验契约；只有必须载入本机协议库或执行原生代码的实现才需要原生执行权限。
- 备份恢复与清理先预览再按 Revision 执行；外部备份目标通过公开存储契约表达。
- TaskId 与 OperationId 明确关联，不能“任务已消失但副作用仍在执行”。

### 8.12 Storage / Files / Network / Platform

```text
Storage.OpenNamespace / Read / Write / CompareExchange
Storage.Query / BeginTransaction / Commit / Migrate

Files.Pick / List / Stat / Read / WriteAtomic / Watch
Files.PrepareMove / Move / PrepareDelete / Delete

Network.Request / OpenResponseStream / Cancel
Network.OpenConnection / Listen / Send / Receive / Close
Platform.Describe / OpenUri / RevealFile / Notify
Platform.ReadClipboard / WriteClipboard / PickFile
Platform.QueryPower / QueryDisplay / QueryArchitecture
```

这些能力使插件能创造新工具和外部集成，但仍有明确对象范围：

- 默认插件持久存储与自有文件；实例目录、用户选定目录、域名等按授权获得引用。
- 维护结构化实例内容时优先用内容事务；直接写业务文件应申明影响并触发刷新/重验，不能悄悄绕过所有者状态。
- 网络支持公开请求、连接、监听、字节流与数据报、超时、取消和背压；鉴权可引用插件自有凭据。连接协议、地址/端口与监听范围按统一能力规则协商，不把非 HTTP 协议默认划给 Sidecar。平台未提供的能力应报告缺失，而不是依据插件身份拒绝。
- 平台能力报告 Supported、Unavailable、Denied、Unsupported，不能用平台名猜测一定存在。
- 公共 ABI 不提供任意宿主方法调用或私有对象解析。任意本机库加载、机器码和通用本机程序执行属于原生执行权限；插件可调用受检的工具业务契约，但不能通过它获得通用执行器。
- 上述唯一权限差异必须由受控执行环境落实。所有依赖与执行入口同样受约束，不能只凭“托管插件”命名保证；具体运行时方案不在本文定案。

### 8.13 Diagnostics

```text
Diagnostics.Log / Report / CreateSpan
Diagnostics.ReadOwnReports
Minecraft.Diagnostics.Analyze / RegisterRuleProvider
Minecraft.Diagnostics.PreviewRepair / ExecuteRepair
```

结构化日志、关联链和故障报告贯通操作。插件默认读自身诊断，读取游戏/宿主日志需相应范围。修复动作必须是公开动作或合法计划，不能把任意 shell 字符串伪装成“修复建议”。

## 9. UI 应达到“可重新组织产品”的程度

插件 UI 的自由度建议包括：

- 注册独立页面、对话框、设置页、导航入口、工具栏与上下文菜单。
- 组合宿主提供的组件和插件自己的 NXML 组件，使用 NSS 定义样式。
- 建立动态列表、条件视图、表单、交互状态与本地化。
- 通过公共绘图、图像、文本、输入和动画契约实现自定义控件与绘制算法；不因超出内置 NXML 组件就要求 Sidecar。
- 绑定宿主公开状态和插件自有状态，发送类型化命令或动作。
- 在公开语义节点处追加、前置、包装、隐藏或替换内容。
- 为可替换的视图契约提供整页替换，实现新的实例页、资源中心或启动面板。
- 注册快捷键、命令面板动作、通知与可访问性说明。

推荐接口：

```text
UI.RegisterPage / RegisterComponent / RegisterContribution
UI.RegisterViewReplacement / RegisterNavigation
UI.RegisterCommand / RegisterShortcut
UI.ShowDialog / CloseDialog / Navigate / Notify
UI.PublishModel / UpdateModel / WatchViewLifecycle
UI.ListExtensionTargets / DescribeViewContract
UI.CreateDrawingSurface / SubmitDrawCommands / SubscribeInput
```

自由度依靠公开语义结构，而不是宿主私有控件树：

- 可替换目标有稳定 ViewId、语义节点 ID、所需状态和命令契约。
- 包含一组常用挂载点，但不能只开放少数装饰性侧栏；可替换完整业务视图是必要能力。
- 自有页面可自由布局；跨页面修改只能针对声明为公开的语义目标。
- 发布模型与响应事件走状态/意图边界；不把 Avalonia 控件或 ViewModel 放入 ABIContext。
- 页面隐藏/卸载、实例切换、绑定失效都有明确生命周期。数据订阅按 ViewScope 释放。
- 权限授权、插件停用、错误恢复等宿主控制界面保留独立可达路径。替换业务页面不能屏蔽用户停用插件的入口。
- 多个插件争用独占替换目标时，Checkup 提供参与者与冲突目标；不按加载先后暗中覆盖。
- 无窗口/不具备 UI 能力时，声明 UI 为可选的插件仍可提供动作与工作流。

当前 NxmlExtensionProgram 已将扩展文件通过同一组件、样式和动态编译路径处理，并支持局部动态插槽。这支持采用 NXML/NSS 创作面；完整插件视图契约与覆盖规则仍需新增，不能由该类直接推断全部功能已开放。

## 10. Provider 与插件间契约

Provider 是对**公开、可版本化业务契约**提供实现。契约既可由宿主定义，也可由插件定义；插件可注册新的 ProviderKind、服务 schema 与消费者。内置流程是否能消费某个新类型取决于协议适配，不取决于它来自插件还是 Sidecar。公共 ABI 不提供宿主私有接口任意注入。

补充契约注册入口：

```text
Contracts.DefineService / DefineProviderKind / DefineExtensionPoint
Contracts.Describe / List / ValidateSchema
Contracts.RegisterConsumer / WatchAvailability
```

自定义契约使用自有命名空间、不可变版本与 schema。DefineExtensionPoint 定义插件拥有的流程阶段，不能伪造宿主内部阶段；宿主公开阶段通过既有贡献契约接入。注册消费关系后仍须提供实际处理程序，不能把“声明名字”当作实现。

每个 ProviderDescriptor 至少包含：

```text
providerId, kindId, contractVersion, schemaHash
displayMetadata, capabilities, supportedScopes
selectionPolicy, concurrencyPolicy, deadlines
failurePolicy, configurationSchema
```

生命周期：

1. Initialize 暂存 Provider 声明与处理程序。
2. PostInitialize 解析已声明依赖。
3. Checkup 验证 schema、引用、可用性与独占冲突；Probe 不产生普通业务副作用。
4. 激活提交后才可接受业务调用。
5. 停用先撤销发现与新调度，再取消/排空在途调用、释放资源。

提供者选择应显式：用户选择、对象归属、请求指定或契约规定的优先级。不能因为新插件注册了同一 kind 就自动接管所有宿主请求。

跨插件 API：

```text
Plugins.ExportService / DescribeService
Plugins.BindService / ProbeService / CallService
Plugins.WatchAvailability / ReleaseBinding
```

- Export 在 Initialize；Bind 在 PostInitialize；Probe 在 Checkup；普通 Call 在 Active。
- 服务以 ContractId、版本、schema 定义输入输出，不交换任意 CLR 对象。
- Required 服务依赖参与加载和停用闭包；Optional 服务丢失时调用方降级。
- 服务调用携带 deadline、cancel、correlation 与调用链。循环依赖不能形成无限等待；允许的循环必须靠非阻塞绑定和可验证的运行协议解决。
- 绑定固定到 LoadInstanceId；提供者重载需要显式重绑，不能把尚未完成的旧调用接到新实例。
- 插件调用另一个插件时不自动转授自身全部权限；服务使用提供者自身授权，代表用户操作时须携带明确、受约束的授权上下文。
- 插件与 Sidecar 均可发布新业务契约，使用相同发现、绑定和调用语义；自定义服务通过已协商的通用契约能力访问，无需为每个插件服务重新增加稳定 ABI 方法。新增宿主 ABI 能力仍遵守 Get/Make 与实验协商规则。
- 原生服务提供者不得通过通用执行代理向插件转授原生执行权限。具体业务服务可以调用，实际效果与参数必须符合已公布的业务契约；不得信任提供者自行标注一个无副作用名称就放行。

## 11. 注册与执行必须分离

声明一个备份规则不应立即执行备份；注册一个安装模板不应立即开始下载。统一分成四步：

1. Describe：声明类型、能力、目标和依赖。
2. Validate：检查引用、兼容、合并、权限和冲突。
3. Publish：加载组通过 Finalize 后原子发布注册。
4. Execute：Active 后由用户、事件、调度或显式调用触发。

加载事务只保证 Host 管理的注册、绑定与声明式内容原子可见。插件私下发起的网络请求、外部文件写入等不能靠“回滚加载”撤销。因此加载阶段不允许以普通业务 ABI 提前执行这些操作。

初始化可读取自己已经授权的配置、持久数据和宿主只读描述；必要的数据迁移应有独立可恢复事务或在 Active 执行。禁止把所有初始化读取都锁死，迫使作者硬编码内容。

## 12. 加载生命周期

| 阶段 | 插件可见行为 | 本阶段结果 |
| --- | --- | --- |
| Checksum | 无插件代码回调；加载方解密到内存、验证摘要与授权期 | 合格包才进入 PreInitialize |
| PreInitialize | OnPreInitialize；协商 ABI、声明身份/依赖/冲突 | Ready Context 与声明 |
| Initialize | OnInitialize(abi, stage)；注册内容、UI、事件、Provider、服务 | 暂存注册 |
| PostInitialize | OnPostInitialize(abi, stage)；绑定必需/可选服务、解析引用 | 完整绑定图 |
| Checkup | OnCheckup(abi, stage)；受限自检与 Probe；Host 汇总错误与遥测 | Pass / Failed |
| Finalize | OnFinalize(abi, stage)；加载收尾 | 全组成功后才发布为 Active |

补充回调建议：

```text
OnActivated(abi, invocation)      // 注册已提交，可开始普通业务
OnStop(abi, stopContext)         // 已激活实例停用清理
OnAbort(bootstrap, abortContext) // 未激活加载尝试失败后的清理
```

OnAbort 的上下文可携带已创建的 Ready Context（若有）；PreInitialize 尚未成功也能清理。Checksum 失败未执行插件代码，不调用插件清理。

- Finalize 是加载收尾，不是卸载析构。
- 一组插件的注册在全部 Finalize 成功后发布；某成员失败则整组撤回，无关组继续。
- 发布之前不得调用已绑定插件的普通业务接口，包括“Finalize 中顺便测试一下”。
- 按必需依赖构成加载组，按声明约束执行阶段；不能仅按文件名排序。
- StageContext 包含 invocationId、stage、deadline、cancellation 与加载组信息；禁止插件修改阶段。
- OnCheckup 返回的成功不能覆盖 Host 检出的冲突与 schema 错误。
- 自检遥测由宿主按既有遥测策略发送；内容为诊断码、相关插件/契约版本与必要摘要，不默认上传凭据、文件正文或私有配置。
- 授权期限仅加载检查；本 ABI 不新增运行中到期轮询。
- 停用后 Context 仍允许受限诊断与资源清理，普通业务调用返回 PLUGIN_STOPPED。旧实例的迟到回调不能恢复注册。

## 13. 冲突与热加载

### 13.1 普通加载

声明冲突按对称关系处理：即使只有 A 声明与 B 冲突，双方也不能成功加载。将冲突目标、版本范围和声明来源写入诊断。

冲突的必需依赖组不提交；其他无关组继续。Optional 引用缺失按契约降级。

### 13.2 热加载的确定语义

遵循用户已经确认的顺序：

1. PreInitialize 收集新插件与运行中实例的冲突，既有实例此时继续运行。
2. 新加载组到达 Checkup，Host 判定 Failed / PLUGIN_CONFLICT。
3. 确认失败后，停用运行中的冲突双方中已 Active 的插件，以及直接、间接必需依赖它们的运行中插件。
4. 新加载组 OnAbort，不进入 Finalize，不提交。
5. 已运行的受影响实例执行 OnStop；无关插件继续，Optional 消费方收到不可用事件。

例：A 正在运行，B 必需依赖 A，C 必需依赖 B，D 可选依赖 A。热加载与 A 冲突的 X：X 在 Checkup 失败；A、B、C 停用；D 保持 Active 并降级；X 不激活。

额外规则：

- 若 X 在到达 Checkup 前因自身错误失败，不因尚未确认的冲突停用 A。
- Checkup 的冲突计算绑定实际运行实例与图版本；提交失败决策和停用集合时重验，避免停错刚替换的实例。
- 停用先封锁新调用与调度，再撤销贡献/绑定并进行清理；消费者优先停止，提供者随后停止。存在依赖环时整组封锁后统一排空。
- 回调异常或超时不保留对外可见注册；清理结果单独记录。
- 停用不等于卸载包或删除持久数据。未收到重新加载请求不自动恢复。
- 停用后的文件、外部网络副作用以及已启动游戏是否继续，按各 Operation 的归属与撤销契约处理；不得宣称停用自动撤销所有现实结果。
- 运行中业务计划冲突、网络失败等不重新执行加载冲突检查。冲突关系改变需要重新加载相应声明。

## 14. 没有函数补丁时，必须提供的可观测性

创作者应能直接回答“为什么没有生效”：

```text
Contracts.List / Describe / CheckCompatibility
Definitions.ExplainResolution
Workflows.ExplainPlan / ReadRunTrace
Minecraft.Launch.ExplainContribution
Plugins.ReadOwnLoadReport
Diagnostics.ReadOwnReports
```

诊断应至少显示：

- 内容定义是否注册、处于暂存还是 Active。
- 引用由谁提供、为何被合并/覆盖/屏蔽。
- 哪个条件为 false/unknown，使用了哪版输入快照。
- 动作为何需要确认、缺失哪项能力。
- UI 贡献目标是否存在、是否被其他替换占用。
- 工作流停在哪一步、已发生哪些副作用、能否重试。
- 启动参数被谁贡献、为何被安全启动或冲突策略抑制。
- 热加载为何导致哪些实例停用，必需依赖链是什么。

对作者开放结构化诊断和可导出的报告，能减少为了排障而要求反射/补丁的需求。

## 15. 从现有代码到插件 ABI 的具体缺口

以下仅代表本次已读代码，未声称完整审计所有模块。

| 已检查的现有契约 | 可复用的业务基础 | 插件 ABI 必须补齐 |
| --- | --- | --- |
| ResourceCatalogContract | 搜索、详情、版本、文件、依赖、安装计划、更新 | 开放 ProviderId、注册与选择、完整端到端 Provider 协议 |
| MinecraftLibraryService / Routes | 实例发现、根目录、选择、重命名、删除 | 稳定外部身份、预览与操作句柄、模板消费 |
| MinecraftInstallService / DraftContract | 安装命令、加载器附加项、草稿编辑、恢复 | 稳定计划 schema、开放 LoaderId、明确贡献点 |
| MinecraftLaunchModels / LaunchHooks.Configuration | 丰富启动选项、计划、内容 overlay、安全启动 | 去凭据公开投影、typed contribution、冻结与重验 |
| JavaRuntimeContracts | 发现、检查、版本要求、元数据 Provider | 外部提供者注册、选择策略与授权范围 |
| InstanceFileWorkspace / InstanceWorldService / ContentUpdateTransaction | 文件预览与保存、世界管理、内容事务 | 统一 Revision、FileRef、取消/恢复与对外 schema |
| AccountContracts / AccountWardrobeContract | 账户数据、公开外观、衣柜操作与能力 | 稳定 AccountId、LaunchGrant、提供者凭据边界 |
| SettingsSchema / SettingsCatalog / SettingsLaunchProfileContracts | 设置类型、目录、配置与临时覆盖 | 插件命名空间、schema 注册、有效值来源与公开写入目录 |
| ThemeContracts | 准备/提交/恢复、选项、资源、观察、迁移 | 可协商插件门面与稳定引用 |
| ContentBackupContracts | 备份、恢复、验证、清理预览、保留策略 | 可组合动作、对象范围、操作状态与调度结合 |
| TaskCenterStateContract / DownloadContracts | 统一任务、阶段、进度、重试与取消 | 插件任务归属、结构化失败、提供者与动作关联 |
| NxmlExtensionProgram | 组件、NSS、动态模板与局部插槽 | 公开视图/节点契约、全页替换、语义冲突诊断 |

从这些代码可得出的设计结论：NexaCL 已有较多细分业务契约，插件 ABI 应在这些所有者之上建立稳定门面；目前检查到的契约不能直接视为已经完整开放给插件。

尤其需要避免三处结构限制：

1. ResourceProvider 当前是 Modrinth/CurseForge 枚举；插件源应使用开放 ID。
2. MinecraftLaunchRequest 与 LaunchProfile 含敏感内部字段；公开门面需重新投影。
3. State/Intent 已有明确边界；插件 UI 与自定义动作必须接入该边界，不能旁路引用宿主服务实现。

## 16. ABI 100 的验收范围

ABI 100 建议以“可完成的作者场景”验收，不能只以接口数量验收：

| 样例插件 | 必须无需补丁完成的行为 |
| --- | --- |
| 实例模板包 | 定义模板与标签，创建实例，选择运行时，安装依赖和内容 |
| 自动备份 | 订阅游戏退出，筛选实例，备份、通知、保留清理与失败重试 |
| 新资源站 | 搜索、详情、版本、依赖、下载、安装、更新与收藏 |
| 自定义启动面板 | 自定义页面，选择账户/实例，编辑配置，预检、启动、查看进度 |
| 整合包维护 | 读取内容图，提出更新与兼容建议，预览、应用、回滚 |
| 实例诊断规则包 | 定义规则和修复工作流，使用日志/状态并展示解释 |
| 游戏数据包管理器 | 生成或导入数据包，管理世界启用顺序与兼容范围 |
| 多插件协作 | 发布类型化服务，可选降级，必需依赖停用闭包正确 |
| 内容覆盖包 | 通过 tag、merge、mask、公开 UI 替换改变体验，停用后恢复 |
| 组合工作流包 | 仅使用已有动作、条件、状态和事件形成宿主没有预置的流程 |
| 新业务服务 | 插件定义新的服务/Provider 类型、实现处理程序，并由另一个扩展发现和消费 |
| 自定义协议传输 | 使用公共网络连接/流实现协议并接入下载流程，无本机库依赖 |
| 自定义绘制控件 | 使用公共绘图与输入契约实现内置组件之外的交互 |

需要通过的契约检查：

- 请求 100、请求无效版本、缺失实验、旧 EXP 转正后仍保持原行为。
- 同版本不同插件按独立作用域访问，不串配置与句柄。
- 注册失败无残留可见内容；Finalize 全组成功才发布。
- 热加载冲突按第 13 节失败并停用受影响闭包。
- 并发更新产生 Revision 冲突；幂等重试不重复已确认的副作用。
- 取消、超时、插件退出、提供者消失、事件缺口、UI 卸载均有可解释结果。
- 没有可用 UI、无网络或可选能力缺失时符合声明的降级行为。
- Provider 注册贯通实际消费路径；模板与定义不是“登记后无人使用”。
- 代码中无任何插件公开函数补丁、私有对象解析或任意函数调用后门。
- 在平台、授权和配额相同条件下，对比插件与 Sidecar 的公开非原生能力，结果必须对等，不能额外按扩展类型禁用。
- 原生库、机器码、任意本机调用及通用命令执行在插件中不可达；跨扩展调用、安装动作、启动参数等路径不能转授该权限。

这些是后续实现的验收规格，本次仅通过代码阅读和设计一致性检查，未运行或声称通过上述运行测试。

## 17. 代码参考

以下链接固定到本次检查的提交，便于对照。本文中的新 API 名称不应被误读成这些文件已经实现的接口。

- [资源目录契约](https://github.com/Nexa-MC/NexaCL/blob/b888cb901f5a7a4ec8b960bc95505dad1dc30e70/src/modules/resources/Nexa.Services.Resources.Contracts/Resources/ResourceCatalogContract.cs)
- [启动模型](https://github.com/Nexa-MC/NexaCL/blob/b888cb901f5a7a4ec8b960bc95505dad1dc30e70/src/foundation/Nexa.Domain/Minecraft/MinecraftLaunchModels.cs)
- [启动覆盖与安全启动配置](https://github.com/Nexa-MC/NexaCL/blob/b888cb901f5a7a4ec8b960bc95505dad1dc30e70/src/foundation/Nexa.Domain/Minecraft/MinecraftLaunchHooks.Configuration.cs)
- [账户契约](https://github.com/Nexa-MC/NexaCL/blob/b888cb901f5a7a4ec8b960bc95505dad1dc30e70/src/modules/accounts/Nexa.Services.Accounts.Contracts/Accounts/AccountContracts.cs)
- [账户衣柜契约](https://github.com/Nexa-MC/NexaCL/blob/b888cb901f5a7a4ec8b960bc95505dad1dc30e70/src/modules/accounts/Nexa.Services.Accounts.Contracts/Accounts/AccountWardrobeContract.cs)
- [主题契约](https://github.com/Nexa-MC/NexaCL/blob/b888cb901f5a7a4ec8b960bc95505dad1dc30e70/src/modules/themes/Nexa.Services.Themes.Contracts/ThemeContracts.cs)
- [备份契约](https://github.com/Nexa-MC/NexaCL/blob/b888cb901f5a7a4ec8b960bc95505dad1dc30e70/src/modules/setup/Nexa.Services.Setup.Contracts/Setup/ContentBackupContracts.cs)
- [任务中心契约](https://github.com/Nexa-MC/NexaCL/blob/b888cb901f5a7a4ec8b960bc95505dad1dc30e70/src/modules/common/Nexa.Services.Common.Contracts/Tasks/TaskCenterStateContract.cs)
- [下载契约](https://github.com/Nexa-MC/NexaCL/blob/b888cb901f5a7a4ec8b960bc95505dad1dc30e70/src/modules/common/Nexa.Services.Common.Contracts/Downloads/DownloadContracts.cs)
- [NXML 扩展编译](https://github.com/Nexa-MC/NexaCL/blob/b888cb901f5a7a4ec8b960bc95505dad1dc30e70/src/rendering/Nexa.Xsr.Renderer.Nxml.Runtime/NxmlExtensionProgram.cs)

## 18. 已确认的 ABI 100 范围

已确认的无函数补丁、统一 Context、加载顺序、冲突停用和实验永久兼容不再询问。

用户于 2026-11-11 确认以下三项一并纳入 ABI 100：

1. **声明式创作入口**：ABI 100 同时支持静态内容声明和代码注册，两者共用同一语义；具体文件语法另开规范。
2. **公开 UI 替换范围**：允许完整业务页面替换，宿主授权、停用与恢复界面保持独立可达。
3. **第三方 Provider 范围**：ABI 100 开放目录源、内容格式、诊断、运行时分发与账户提供者，并允许插件定义新的契约类型和消费者。新业务类型、新算法或新协议不自动归 Sidecar 专属。

随后追加的最高层约束：**插件与 Sidecar 的唯一固有权限差异为原生执行权限。** 此约束取代此前“插件只扩展已有业务模型、底层扩展一律由 Sidecar 完成”的限制；数据包自由度仍为下限。完整公共 ABI、内容与 UI、服务契约、Provider、流程扩展均按对等原则开放。此前确认的不提供插件函数补丁、加载和冲突处理规则继续有效。

以上三项已定案，不再作为待决策项。具体接口签名、文件语法和实现细节仍属设计内容；本次确认不代表已经实现或通过运行验收。


````

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/specifications/plugin-abi-v0.2.proposal.zh-CN.md) · Apache-2.0.
