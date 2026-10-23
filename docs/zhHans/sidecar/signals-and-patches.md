# 信号、标题补丁与有限函数程序

选择扩展前先写出目标：只是观察搜索完成、改一个提示词，还是改变已有展示结果？三种需求使用不同契约。签名或注册成功不意味着能修改任何 Host 方法。

## 当前产品目标的精确名称

| 目标 | 类型 | 当前授权效果 |
| --- | --- | --- |
| ui.resources.search.v1 | Intent | 搜索按钮的 search 意图，可在明确授予时 Catch |
| event.resources.search-completed.v1 | Event | 完成通知，值仅 success/failure |
| ui.resources.search-label.v1 | UiPatch | 搜索标题及无障碍标签，最多 16 字符 |
| ui.resource.project-title.v1 | FunctionPatch | 展示标题 string→string |
| ui.resource.download-count.v1 | FunctionPatch | 展示计数 Int64→Int64，最终展示负值会钳为 0 |

搜索完成不包含搜索文本、路径、账号或结果元数据；自动搜索、下载/安装意图不属于按钮 Catch。标题/计数补丁不修改 provider ID、持久目录、下载执行或安全规则。

## 实战一：只改搜索标题

```csharp
byte[] content = SidecarUiCaptionPatch.Encode("Search notes");
var patch = new SidecarRegistrationItem(SidecarRegistrationKind.UiPatch,
    "example.search.caption", 0, 0, content,
    System.Security.Cryptography.SHA256.HashData(content),
    TargetSemanticId: "ui.resources.search-label.v1");
```

载荷为有序 TLV：1 schema U32=1、2 caption Str。ABI 最多 2048 字节，目标另外限制文本长度，非空且无控制字符。标题与无障碍标签一起更新，退役恢复原本地化或前一个仍存活补丁。

最近激活的有效补丁获胜。限制为 64 Host 目标、128 补丁/会话、256 活动补丁、32/目标。没有活动补丁时无需 IPC 或重新解析文档。

## 实战二：观察与捕获搜索信号

EventListen 观察匹配事件；IntentWait 在每次激活中只匹配一次意图，不消费它。EventCatch/IntentCatch 可安装有限匹配和可选消费；只有 Host 明确允许 Catch 的点才能消费。

NXS1 载荷：ASCII NXS1、一个 mode 字节（0 observe，1 consume）、严格 UTF-8 的精确匹配文本，文本最多 512 字节；空文本匹配任意值。flags/codec 为 0，并声明 target/hash。

```csharp
byte[] predicate = [.. "NXS1"u8.ToArray(), 0, .. System.Text.Encoding.UTF8.GetBytes("success")];
var listen = new SidecarRegistrationItem(SidecarRegistrationKind.EventListen,
    "example.search.completed", 0, 0, predicate,
    System.Security.Cryptography.SHA256.HashData(predicate),
    TargetSemanticId: "event.resources.search-completed.v1");
```

收到 HookSignal 后用 SidecarHookSignal.Decode，检查 ActivationId、Kind、ContractId、Sequence 和 Value。用激活身份丢弃在途的旧通知；IntentWait 再次激活后重新获得一次机会。

每激活 128 条有序通知队列，单异步发送者；全局 256 绑定、每点 32、每会话 128。溢出撤销该激活并使会话失败，不阻塞调用者或静默掉事件；Catch 只有通知实际准入后才消费。

## 函数补丁的执行顺序与职责

```text
HEAD → ARGS → REPLACE 或 original → TAIL → RETURN
```

| 阶段 | 允许做什么 | 应注意 |
| --- | --- | --- |
| Head=1 | 可设置结果后跳过原函数 | 不能只跳过而无返回值 |
| Args=2 | 同类型改参数 | 不改宿主方法签名 |
| Tail=3 | 原函数/替换成功后处理 | 原函数异常则不运行 |
| Return=4 | 变换最终结果 | 用于标题后缀/计数展示 |
| Replace=5 | 设置结果并跳过原函数 | 首个成功 Replace 获胜 |

同阶段按激活顺序再注册顺序执行。原函数异常原样传播，跳过后置程序；同站点同步重入调用原始函数。程序只在本地有限解释器执行，不做同步 IPC、反射、Harmony 或任意委托交换。

## NFP1 实例：展示标题加后缀

ContractRecipes.TitleSuffixProgram 构造 string→string RETURN 程序：

```text
NFP1 | ABI=1 | phase=4 | instructionCount=5
2        load result
3,len,s  load UTF-8 suffix constant
4        concatenate
6        store result
8        end with empty stack
```

完整函数在[可运行源码](https://github.com/Nexa-MC/PCLN-Docs/blob/main/examples/sidecar/ContractRecipes.cs)。用 FunctionPatch kind 注册 payload/hash，target 为 ui.resource.project-title.v1。HostFixtures 在真实 HostSession 中验证：注册后 Title 不变，ACTIVATE 后变为 Title [example]，DEACTIVATE 后恢复 Title；使用的是测试回环传输，不冒充生产验签。

## NFP2 实例：展示计数加 1

NFP2 支持 0–8 个 String/Bool/Int32/Int64/Float64 参数及同类或 Void 结果。字符串上限 2048，Float64 必须有限，Void 只能作结果，不进参数或栈。

头为 NFP2、版本字节1、phase、argument count、result kind、各 argument kind、u16 指令数。kind 与基础 codec 0–4 一致，Void=7。

CountIncrementProgram 的参数/结果均 I64：load result → load I64(1) → checked add → store result → end。例子在 HostFixtures 中被准入并执行，5 变 6，停用后又为 5。

| opcode | 操作数 | 行为 |
| --- | --- | --- |
| 1 | 参数索引 u8 | 读参数 |
| 2 | 无 | Tail/Return 读结果 |
| 3 | kind u8、len u16、严格值字节 | 常量 |
| 4 | 无 | 同类型加法或有界字符串拼接 |
| 5 | 参数索引 u8 | Args 写同类型参数 |
| 6 | 无 | 写同类型结果 |
| 7 | 无 | Head/Replace 跳过原函数 |
| 8 | 无 | 最终 end，空栈 |
| 9 | 无 | 同类型相等，返回 Bool |
| 10 | 无 | Bool not |

不包含跳转、循环、调用、IO 或对象创建。A12 Host 的两个具体站点不等于可以自己添加任意新站点；Host 编译期显式声明和组合授权才创建可用目标。

## 有界执行与退役

每程序最多 64 指令、栈深16、载荷8 KiB、常量1 KiB UTF-8；每点32程序、运行时256程序，每次调用最多512指令。超长、溢出、非有限运算或预算故障会回滚当前程序并在本激活禁用，不吞原函数异常。

退出/取消在指令间及提交前检查。退役不撤销已完成的宿主副作用，但阻止后续执行。不可为了保持某补丁效果而延迟 Host 关闭或复活旧激活。


## 实现依据

- [docs/xsr/sidecar-signals.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-signals.md)
- [docs/xsr/sidecar-ui-patches.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-ui-patches.md)
- [docs/xsr/function-patches.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/function-patches.md)
- [Nexa.Desktop/DesktopSidecarSignals.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Desktop/DesktopSidecarSignals.cs)
