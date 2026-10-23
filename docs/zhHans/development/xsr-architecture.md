# XSR 架构与作者职责

XSR 中，X 是执行与交换运行时，S 是业务服务，R 是语义渲染器。当前渲染器实现名为 `Nexa.Xsr.Renderer`；早期设计中的 UI.Next/PXML 名称是历史背景，不能据此为当前插件引用旧程序集。

## 一个动作经过哪些层

```text
用户输入 → Renderer 发出 Intent → Desktop 组合层
                                     ↓
                          XSR 命令/查询路由
                                     ↓
                         业务服务或已准入 Sidecar
                                     ↓
                          State / Event 发布
                                     ↓
                Host 本地 State → Renderer 绘制
```

跨进程的一侧是 Sidecar 私有逻辑，另一侧是 Host 的数字路由、状态镜像和有限展示。没有从绘制回调直接调用子进程这一条箭头。

## X：执行、路由与生命周期

X 负责注册、数字分发、相关 ID、取消、作用域、队列和资源退役。它不决定你的业务规则，也不拥有一个业务页面“应该显示成功”的事实。

开发时使用可读语义 ID，如 `example.note.set`。注册完成后使用会话内数字句柄。Host 内部封闭注册表与 Sidecar 的逐种类注册序号是两种映射，不能假设它们数值相同。重连后重新解析，不能把数字 ID 写入配置长期保存。

一个请求至少关联：包身份、会话身份、契约 ID、correlation ID、取消/截止时间。把这些一起考虑，才能防止旧会话结果写回新页面。

## S：业务行为有唯一所有者

业务层验证输入、决定副作用、管理私有存储并发布事实。它不持有窗口、控件、Avalonia 或全局服务定位器。比如便签功能的业务层应返回“内容超长”的稳定失败，而不是打开对话框或直接把按钮设灰。

UI 是否可交互由本地投影依据明确的可用性事实决定。不要在界面和业务层各维护一份互相竞争的“当前便签”。Host 镜像是跨进程事实的投影，不是任意修改 Sidecar 私有对象的远程引用。

## R：读本地状态，发出意图

Renderer 处理布局、输入、动画和绘制，不发现服务、不读主题文件、不进行网络或 IPC。NXML 编译为受限宿主 IR；NSS 计算外观；已准备的资源由后端消费。

选择器匹配、布局和输入命中必须使用一致几何。更改主题外观不能绕过 Host 的虚拟列表视口、滚动锚点或弹层归属。动态数据使用保留实体的投影更新，不能每次更新重建整页并重播入场动画。

## 四类通信的设计规则

| 原语 | 回答的问题 | 生命周期 | 常见误用 |
| --- | --- | --- | --- |
| Command | 请执行什么动作？ | 准入、执行、完成/失败 | 把接受请求等同于业务已完成 |
| Query | 现在求一个什么结果？ | 一次请求，有取消与超时 | 每帧询问进度或当前文字 |
| State | 现在真实情况是什么？ | 初始快照、修订与可用性 | 用 Event 补丁维持唯一当前值 |
| Event | 刚才发生了什么？ | 有界、有顺序的瞬时记录 | 像可合并进度一样静默丢弃事件 |

State 的值与可用性分开。保留旧值不代表它仍可信或可操作。会话失败后 Host 撤销展示与交互授权；重新显示必须经过新快照、新激活与新 exposure。

## 三种外观描述不可互换

| 格式 | 作者写什么 | 谁决定行为 |
| --- | --- | --- |
| NTP/1 + NSS/1 | 主题清单、选项、资源、有限样式 | Host 的原始页面与业务规则 |
| NXML | Host 页面、组件、绑定、动态槽与输入语义 | Host 组合层与已声明 State/Command |
| Sidecar UI schema 1/2 | 有限卡片或 Text/Button/Input/Toggle/Image/Stack/Row | Host 准入、模块投影与当前会话声明 |

把 `.nxml` 放入主题包不会获得新页面；把 NXML 字符串放进 UiModule 不会成为合法 schema 2。旧 SDK/PXML 的包、CLR 对象和动态补丁 API 也不是这里的线协议。

## 资源、权限和退役

每个订阅、任务、资源 lease 和动态片段都要有所有者。来源退役就停止监听；页面离开就取消相关请求；会话关闭就完成所有待定交换并移除活动扩展。

签名证明可信发布者，不自动授予目标。进程隔离不等于 OS 沙箱；NativeAOT 不等于权限控制。主题外部资源必须由用户通过 Host 选择器授权，导出的配置文本不携带文件读取权。

## 完整功能的最小证据

用行为测试证明有效/无效输入；用协议测试证明编解码和契约；用生命周期测试证明取消、重启和旧结果隔离；用目标平台执行证明 NativeAOT、资源与安装；用页面证据证明布局和输入。不要用其中一种替代其他所有证据。

下一章把这些规则用于一个可实现的[资源页便签扩展](./walkthrough)。


## 实现依据

- [docs/xsr/architecture.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/architecture.md)
- [docs/xsr/service-model.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/service-model.md)
- [docs/xsr/state-model.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/state-model.md)
- [docs/xsr/nxml-renderer.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nxml-renderer.md)
