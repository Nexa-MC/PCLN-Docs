# 执行并观察后台工作流

本章使用 SDK 中完整的 `samples/WasmWorkflow/plugin.c`。它依次注册动作、工作流、间隔计划和清理回调，并在激活后启动工作流。在 SDK 根目录执行：

```sh
python eng/build_wasm_sample.py --clang clang
```

在兼容开发宿主加载 `artifacts/wasm-sample/workflow.zip`。动作返回 `C callback completed`，计划间隔为 60,000 毫秒。

## 先注册，后执行

Initialize 中的四次注册按回复顺序串联，每次使用自己的幂等键。工作流指向已声明的动作，输入为 Empty，输出为 TextResult。计划使用 UTC 和 Coalesce，清理回调编号为 2。

Activated 才调用 Workflows.Start。返回 OperationRef 只表示工作被接受，应通过 Tasks.Read 或 Workflows.Read 读取结果，或订阅进度。不要收到句柄就展示“执行完成”。

## 理解恢复边界

持久工作流保存定义指纹和进度。恢复要求插件版本、定义、输入与保存的版本匹配；改变定义后不能解释旧程序位置。检查点只保存已知进度，无法证明被中断的外部副作用没有发生。

OUTCOME_UNKNOWN 表示结果不确定，不能当作可安全自动重试的失败。计划在分发前持久化下一到期时间，因此崩溃窗口可能漏掉一次触发；Coalesce 不是恰好执行一次的保证。

## 验证停止与恢复

运行中停止插件，观察取消和清理。禁用计划，确认不再分发。分别用不变和已修改的定义测试已保存运行，检查任务记录，而不是根据“没看到回调”推断成功。

继续阅读[异步调用](../guides/asynchronous-calls.md)和[运行时详细语义](../runtime-services.md)。

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/zh-CN/tutorials/workflows.md) · Apache-2.0.
