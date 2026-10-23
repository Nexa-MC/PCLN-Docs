# 从目标验收到测试与发布

首先回到[验收目标](/development/goal-first)：用户动作、当前事实、成功/失败和退出行为是什么？测试围绕这些结果，不只断言某个私有方法被调用。

## 四种不同的证据

| 层级 | 能证明 | 不能替代 |
| --- | --- | --- |
| 编码实例 --recipes | 字段、codec、边界、序号格式与文档形状 | 实际背压、正式授权、原生 UI |
| 真子进程 --self-test | 本地 IPC、一次性证明、握手/查询/退出 | 生产签名与具体业务目标 |
| Authoring Lab 受控 Host | NFP1/NFP2 准入、激活、停用；NXML/NSS 保留更新 | 正式文件验签、所有 OS 后端 |
| 目标平台正式准入/交互 | 安装目录、签名、原生资源、页面输入与完整生命周期 | 其他未执行的平台 |

测试回环不是 OS IPC；控制台打印 PASS 不是实际目标 UI 截图；一个平台 AOT 不是全平台执行。这些区别应写入发行说明。

## 本地可重复执行命令

在文档仓库根，源码绝对路径指向 A12：

```sh
dotnet run --project examples/sidecar/Example.Sidecar.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- --recipes
dotnet run --project examples/sidecar/Example.Sidecar.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- --self-test
dotnet run --project examples/authoring-lab/Authoring.Lab.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- /absolute/path/to/PCLN-Docs
```

Authoring Lab 还编译覆盖全部 Host API 的调用示例，但不会自动停止/重启真实包。HostFixture 明确只给测试目标授权，不是替换正式签名验证。

## NativeAOT 不是只看编译退出码

```sh
dotnet publish examples/sidecar/Example.Sidecar.csproj -c Release -r linux-x64 -p:PublishAot=true -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -o out/sidecar
out/sidecar/Example.Sidecar --recipes
out/sidecar/Example.Sidecar --self-test
dotnet publish examples/authoring-lab/Authoring.Lab.csproj -c Release -r linux-x64 -p:PublishAot=true -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -o out/lab
out/lab/Authoring.Lab /absolute/path/to/PCLN-Docs
```

发布后执行才证明反射/裁剪假设没有在该路径失效。每个目标 OS 用原生工具链与自己的 RID。遇到 trim/AOT 问题先定位不兼容依赖，不以关闭全部保护或随意增加反射保留作为默认解决方案。

## 第一版就需要的回归场景

| 场景 | 检查 |
| --- | --- |
| 参数/结果 codec 错误 | 拒绝且不能完成另一请求 |
| 注册缺项/重复/超预算 | 不发布半个镜像，不进入 Active |
| 空 State 集合 | 零项快照完整结束 |
| 取消/截止时间 | 工作结束，稳定结果与相关 ID 保留 |
| 写入半帧中断 | 关闭连接，不复用残缺帧流 |
| Stream 消费慢/退出 | 额度停产、Completion 明确、数据释放 |
| UI 草稿/隐藏/离页 | 草稿与当前 exposure 契约正确，旧点击无效 |
| 补丁停用/失败 | 恢复原始或前驱展示，无旧激活复活 |
| 进程崩溃/恢复 | 待定交换终止，新会话重新注册与快照 |

## 诊断与最小复现

记录版本、OS/RID、PackageName、SessionId、correlation、契约 kind/ID/codec、阶段、稳定错误码和预算计数。不要记录 bootstrap 证明、密钥、账号令牌、私人便签或整个数据载荷。

将失败缩成一个契约和一个消息序列。如果示例能工作而自己的扩展失败，比较声明、功能位和状态覆盖；不要立即改 Host 架构或关闭验签。

## 发布说明模板

```text
目标：用户可以提交并读取本扩展便签
兼容：NexaCL v2.0.0.alpha.12；protocol1；所需功能位…
目标授权：ui.resources.extension-card.v1
数据：输入/当前状态/错误规则；是否持久化
发行：各 RID 原生文件与 detached signature
已执行：平台、构建、命令与结果
限制：外部 SDK/生产发布者准入条件、未验证平台
```

只声明已完成并有证据的结果。之后新增能力按新的目标单元设计和验证，保留既有 numeric/wire 含义，不靠改 API baseline 掩盖破坏性兼容变化。


## 实现依据

- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
- [docs/xsr/sidecar-protocol.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-protocol.md)
- [docs/xsr/nsc-and-regional-policy.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nsc-and-regional-policy.md)
