# 状态与持久化存储

State 用于发布当前、带版本的视图；Storage 用于保存插件自己的持久数据。界面显示了新值，不代表持久化已经完成。本章使用完整的 `samples/WasmStateStorage/plugin.c`，它不创建页面，而是恢复私有数据并发布到 State。

## 构建完整示例

在 SDK 根目录执行：

```sh
python eng/build_wasm_sample.py --clang clang
```

加载 `artifacts/wasm-sample/state.zip`。Initialize 打开 `example.state:data` 并声明 `example.state:message`；激活后读取私有 message 项。只有 NOT_FOUND 才创建默认文字，其他错误不会被当成空数据。随后读取 State 的实际版本，条件更新为存储中的 TextResult。

示例在让出执行前把命名空间和数据复制到专用缓冲区，避免保留下一次 resume 会覆盖的借用视图。默认数据也采用条件创建，竞争写入会导致冲突而非覆盖。

实际运行时检查验证了首次创建、通过授权接口修改、宿主重启后的持久恢复、State 投影和过期版本拒绝。SDK CI 编译该示例；编译结果与运行时验证是不同层次的证据。

## 先确定数据契约

选择宿主接受的 schema、属于插件命名空间的状态 ID，以及明确的作用域。生成模型的指纹可复现，但自定义 schema 仍需宿主提供验证策略；声明一个摘要不会自动安装验证器。

在允许的初始化阶段定义状态、打开获授权的私有命名空间。命名空间句柄仅属于当前加载，不能借此读取其他插件的数据。

## 使用版本避免覆盖

```text
State.Read → 当前值和版本
根据当前值构造下一份数据
State.CompareExchangeOwned → 携带刚才读取的版本
冲突 → 重新读取、合并修改，再决定是否重试
```

版本原样保存，不要递增或猜测。未初始化状态可能返回 Null 和明确的 `uninitialized` 版本；这不同于读取失败，也不同于有效空值。不能把失败读取转换为空数据后覆盖原内容。

## 保存与订阅

有并发写入时使用 Storage.CompareExchange；一组关联写入使用事务并按实际版本提交。只有持久化成功后才展示“已保存”。迁移是显式操作，当前迁移输入有 256 项上限；失败时不能重置命名空间。

State.Watch 返回订阅。Resources.ReadSubscription 消费有界批次，不确定回复需要保留原幂等键。发生缺口时重新读取权威快照，再恢复界面。视图关闭后释放订阅，插件停止后丢弃所有旧句柄。

## 验证

让两个编辑使用同一初始版本，确认冲突不会静默覆盖。重启后读回持久值。拒绝存储权限时，界面应明确保存不可用。模拟订阅缺口，确认界面能通过新快照恢复。

详细字段见 [State](../api/state.md)、[Storage](../api/storage.md) 和 [Resources](../api/resources.md)。

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/zh-CN/tutorials/state-and-storage.md) · Apache-2.0.
