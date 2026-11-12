# 加载、激活与退出

插件必须完成协商、暂存注册和原子激活后，才能执行 Active 阶段的工作。拿到上下文、完成某个回调或进入 Ready 状态，都不等于已经激活。

## 协商与上下文

托管 Bootstrap 的 `GetABIContext(100, options)` 返回草稿。声明必需及可选能力后，通过协商器完成 Make，得到宿主确认的最终上下文。`GetExpermentABI` 保留历史拼写；不受支持的 ABI 不会自动降级。

`GetAbility`、`GetExperiment` 只访问已经确认的契约，不会再次协商或授予权限。可选能力缺失时，应禁用对应功能；核心能力缺失时，不应伪装成成功加载。

| 阶段 | 应完成的工作 |
| --- | --- |
| PreInitialize | 协商，准备回调和清理归属 |
| Initialize | 暂存允许注册的页面、动作、服务和定义 |
| PostInitialize | 建立允许的跨插件绑定 |
| Checkup | 探测依赖，返回明确的检查结果 |
| Finalize | 完成收尾，不再新增注册项 |
| Activated | 原子提交后开始运行时工作 |
| Abort | 清理未成功加载的实例；协商失败时最终上下文可能不存在 |
| Stop | 取消运行中的工作，释放本地资源并丢弃旧句柄 |

## 控制视图寿命

加载阶段使用 `abi.ForStage100(stage)`，并在回调返回前释放视图。运行时使用 `abi.AsAbi100()` 和实际调用范围。阶段视图携带阶段 ID、取消和剩余预算；重新创建包装器不会重置超时。已释放视图的代理不能继续调用。

Wasm 通过 `nexa_resume` 接收回调。一次 Host 调用会让出执行，结果在下一次 resume 返回。模型视图借用当前输入缓冲区，不能跨 resume 保留；只保留自有标量或复制后的数据。

## 保留真实失败

先检查 `AbiReply<T>.Success`，再读取 Value。失败时的默认值不是成功空结果。让 Abort 或 Stop 执行相应清理，且不要在清理回调中同步等待无关工作。

注册项在整组激活后才可见。停止后，文件、订阅、绑定和计划等句柄属于已退休的加载实例；同一个插件 ID 的新加载也必须重新获取。

[页面调用链](tutorials/page-and-action.md) · [权限](permissions.md) · [异步调用](guides/asynchronous-calls.md)

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/loading-contract.md) · Apache-2.0.
