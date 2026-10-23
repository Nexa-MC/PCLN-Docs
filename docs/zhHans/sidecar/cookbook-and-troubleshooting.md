# Sidecar 综合案例与排错

## 案例一：私有便签表单

按[综合设计](../development/walkthrough)定义业务长度与失败行为，再注册 Command set、State current/enabled、Event changed 和有限 UiModule。先通过 --self-test 建立 IPC，再用 --recipes 理解声明和文档，最后在获准 Host 验证输入、提交、状态变化与离页。

不要用 Query 每帧读取便签；不要给 TextInput 另加一个需要越界读取草稿的按钮；不要把注册成功写成正式发行已获授权。若持久化不在第一版目标中，就明确“内存便签”。

## 案例二：有连续输出的独立任务

Command 启动任务，State 保存当前阶段/进度，Event 通知一次完成，Stream 提供有界结果。写出取消、重试和操作去重；切勿在超时后用新 correlation 盲重发非幂等副作用。

消费者慢时让 credit 阻止生产，不无限缓存文本。用户离页则取消所属流；任务若允许后台继续，必须明确业务所有者，不把已离页控件当任务生命周期。

## 案例三：只改展示字段

只改搜索标签用 UiPatch；只给资源标题加标识用已授权 string FunctionPatch。先确认文字/计数是展示目标，不改变目录、账户或下载信任。比较注册前、激活后、停用后结果，记录还原证据。

## 按阶段定位问题

| 现象 | 阶段 | 首要检查 |
| --- | --- | --- |
| 无法发现 | 文件/身份 | BaseDirectory 顶层、后缀、空/重名、候选预算 |
| 启动前拒绝 | 原生/信任 | OS/RID、文件字节、同级签名、固定发布者；不是网络故障 |
| 子进程启动后立即退出 | 参数/bootstrap | 参数形式、stdin32字节、当前用户端点、首帧前认证 |
| WELCOME 后失败 | 功能/注册 | 交集、种类/codec、计数、hash、target、必需资源 |
| 永远不到 Active | 快照/READY | 包括零状态在内完整快照，覆盖无重复、正确顺序 |
| 请求被拒绝 | 路由/状态 | Active、PackageName、kind-local ID、参数与结果 codec |
| 已接受但用户看不到成功 | 完成语义 | 是否观察 Completion，是否发布权威 State |
| 总是超时 | 调度 | 接收循环是否阻塞、多个读者争抢、任务是否可取消 |
| 流中途失败 | 序号/credit | 从1计数，End下一序号，额度和队列预算 |
| UI 已缓存但不显示 | 展示准入 | slot grant、schema、Active、曝光生命周期 |
| 输入控件被禁用 | 绑定可用性 | Bool enabled/visible、ValueState 类型、祖先状态 |
| 重启后旧点击生效 | 退役错误 | Session/activation/exposure 是否仍被错误复用 |
| 第三次后不恢复 | 监督策略 | Quarantined，查看失败码并显式修复/重启 |

## 什么不应作为修复

不要关闭签名/资源校验来解决 codec 错误；不要把错误码改为成功空值；不要加同步 RPC 解决状态设计缺口；不要通过无限重试、无限队列或反射宿主对象绕开生命周期。

先建立一条当前可工作的最小链路，再比较真实差异。确实缺少目标时，向 Host 维护者提交目标、归属、类型、取消/退役和测试提案，避免把未开放能力伪装成插件内部实现。


## 实现依据

- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
- [docs/xsr/sidecar-ui-modules.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-ui-modules.md)
- [Nexa.Xsr.Runtime/Sidecar/SidecarSupervisor.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Runtime/Sidecar/SidecarSupervisor.cs)
