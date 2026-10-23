# 从可工作的 Sidecar 开始

目标：构建一个独立原生端点，完成真实进程启动、认证、注册、Int32 查询、健康检查与清理。先读[目标与 XSR](../development/)，再建立这个闭环并添加业务；不要先画 UI 再用硬编码模拟远程完成。

## 1. 获取明确的版本

安装 .NET 10 SDK；NativeAOT 另外需要当前平台的原生工具链。源码使用 A12 标签，文档仓库使用当前 main：

```sh
git clone --branch v2.0.0.alpha.12 --depth 1 https://github.com/Nexa-MC/NexaCL.git
git clone https://github.com/Nexa-MC/PCLN-Docs.git
```

```text
examples/sidecar/
├── Example.Sidecar.csproj    仅引用 Protocol、Transport
├── Program.cs               小型独立端点
├── SmokeHost.cs             测试专用 Host 对端
└── ContractRecipes.cs       编码/状态/流/UI 的可运行实例
```

项目通过 `NexaCLSourceRoot` 显式引用当前源码。不要改成工作站私有路径提交给别人，也不要假设有同名 SDK NuGet。

## 2. 运行真实子进程自测

在文档仓库根运行，替换为源码绝对路径：

```sh
dotnet run --project examples/sidecar/Example.Sidecar.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- --self-test
```

预期输出：

```text
PASS: native IPC bootstrap, registration, empty snapshot, binary query, health, unregister and shutdown.
```

自测创建随机当前用户端点、启动同一个程序的子进程模式、通过 stdin 给出 32 字节一次性 challenge，随后经真实本地 IPC 认证。测试 Host 只用来证明协议，不跳过或替换正式启动器的签名准入。

## 3. 逐阶段理解程序

| 代码阶段 | 做什么 | 为什么必须这样 |
| --- | --- | --- |
| 参数检查 | 仅接收 `--nexa-sidecar --endpoint …` 或自测模式 | 不把无效参数当正常启动 |
| Bootstrap.ConnectAsync | 读取 stdin 证明并建立连接 | 认证在任何帧流之前完成 |
| HELLO/WELCOME | 检查 version、协商功能交集 | 未协商能力不得直接使用 |
| REGISTER | 声明 `example.echo` Query，I32→I32 | 明确输入和结果 codec |
| 空快照 | BEGIN(0)、END | 没有 State 也必须完成阶段 |
| READY / ACTIVATE | 进入执行期 | READY 不等于已经允许业务执行 |
| QueryRequest | 检查 Active、契约 ID 1、I32 | 不凭消息名猜类型 |
| QueryResult | 按原 correlation 返回 Int32 | 结果不能完成别的请求 |
| 健康/注销/退出 | 保留 nonce、退役并返回 | 长期运行需要完整清理路径 |

`example.echo` 是 Query 种类中的第 1 项，所以本会话 Query ID=1。它不是字符串哈希，也不是永久全局 ID。新的 State ID 仍从 1 开始，与 Query 表无关。

## 4. 运行编码实例

```sh
dotnet run --project examples/sidecar/Example.Sidecar.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- --recipes
```

实例验证 versioned DTO、帧相关 ID、State/Event、Stream 的序号/credit 编码、schema 2、标题补丁、HookSignal 及非法值。它展示线格式，不声称流的真实背压、Host UI 或目标授权已经执行。

## 5. 发布 NativeAOT 并验证发布后文件

Linux x64 示例：

```sh
dotnet publish examples/sidecar/Example.Sidecar.csproj -c Release -r linux-x64 -p:PublishAot=true -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -o out/sidecar
out/sidecar/Example.Sidecar --self-test
out/sidecar/Example.Sidecar --recipes
```

在对应平台将 RID 改为 win-x64/win-arm64/linux-arm64/osx-x64/osx-arm64，并安装各自 AOT 工具链。不能仅改文件名就跨架构运行。

完成发布验证后，将原生文件重命名为 `example.nsc`（Windows 原文件通常为 `.exe`），Unix 保留执行位。正式发现还要求同级 `.nsc.asc` 及 Host 信任的发布者，见[签名与发现](./packaging-and-discovery)。

## 6. 从 echo 扩展自己的目标

保留握手/注册/快照骨架，先新增一个自己的业务契约，声明它的参数、结果与状态。涉及多个并发请求时，建立唯一接收循环和按 correlation 的任务表；不能让每个命令各自直接读同一连接。

下一章学习[完整生命周期](./protocol-and-lifecycle)，然后按照[资源页便签设计](../development/walkthrough)实现有限业务。


## 实现依据

- [Nexa.Sidecar.Transport/SidecarBootstrap.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Transport/SidecarBootstrap.cs)
- [Nexa.Sidecar.Protocol/SidecarHandshake.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Protocol/SidecarHandshake.cs)
- [docs/xsr/sidecar-host-api.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-host-api.md)
