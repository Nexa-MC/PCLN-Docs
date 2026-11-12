# 共享 NXML、独立页面与引导

把协商后的 Sidecar UI 契约连接到宿主渲染的 NXML。区分页面资源、模型投影和输入意图，避免可见控件成为未声明的权限入口。

**适用版本：**本章源码级示例固定于 `v2.0.0.alpha.14`。当前 Wasm 插件开发请阅读[插件 SDK](/plugin-sdk/)。

目标：声明一个属于当前 Sidecar 会话的页面，从导航入口打开，输入后发出命令，退役后恢复宿主页面。Alpha 14 使用共享 NXML schema 3；不是把 XML 塞进旧 schema 2，也不发送内部 IR。

## 协商与所有权

需要 `Nxml=16`；独立 Page/OnboardingPage 还需要 `Pages=64`。命令参数使用非字符串 codec 时继续遵守 BinaryPayloads。只使用 WELCOME 实际协商的能力，不从 version=1 推断 All。

Peer 提供不可变文本包和完整 SHA-256。Host 注册阶段校验全部内容、状态引用及命令，在 READY 前编译初始投影；状态变化在合并的后台工作中重新编译。Renderer 消费本地不可变快照，不在画帧时解析源文本或请求 peer。

## 一个可以编码的页面包

```csharp
var page = new SidecarNxmlDocument("#ExamplePage", SidecarNxmlOperation.Page,
    "main.nxml", new Dictionary<string, string> {
        ["main.nxml"] = """
            <nxml-page>
              <Page Key="ExamplePage">
                <StackPanel>
                  <TextInput Key="Draft" Label="Note" Height="36" />
                  <Button Key="Submit" Label="Save" Height="36"
                    Command="example.note.set" ArgumentFrom="Draft" />
                </StackPanel>
              </Page>
            </nxml-page>
            """
    });
byte[] payload = SidecarNxmlDocument.Encode(page);
var module = new SidecarRegistrationItem(SidecarRegistrationKind.UiModule,
    "example.note.page", 0, 0, payload,
    System.Security.Cryptography.SHA256.HashData(payload));
```

此前必须在同一会话声明 `example.note.set` Command，codec 0 表示 UTF-8 参数。编码成功只证明包格式；完整注册仍需 Host 命令／状态准入、协商与激活。可运行编码及分块回归在 `examples/sidecar/ContractRecipes.cs`；Host 真正打开页面的验收在源码 `SidecarNxmlPresentationTests.cs`。

导航按钮是另一份 UiModule，Target 使用实际宿主 Key，例如 `#navigation-toggle`，Operation=Before；内容如下：

```xml
<NavigationItem Key="ExampleNavigation" Label="Notes" Content="Local extension"
  Icon="lucide/file-text" Height="42" Command="ui.sidecar.page.open"
  Argument="#ExamplePage" />
```

`ui.sidecar.page.open` 只能从活动模块的 exposure 解析同会话的 Page，不能借另一个插件的页面。不存在的 Key 不表示自动创建宿主位置；应针对目标版本核对选择器，测试布局及可用性。

## 操作、文件与预算

| 操作 | 数值 | 语义 |
|---|---|---|
| Append / Prepend | 1 / 2 | 添加为目标子节点 |
| Before / After | 3 / 4 | 相对命中节点插入 |
| Modify | 5 | 覆盖普通呈现组件，保留逻辑子节点 |
| Replace | 6 | 覆盖呈现根／子树，保留宿主逻辑及其后台更新 |
| Page | 7 | 同会话独立页面，Target 为唯一 `#Key` |
| OnboardingPage | 8 | 引导页面，Target 同样为唯一 `#Key` |

普通目标支持 `#Key` 和 `#Ancestor/#Child`，匹配所有对应的活动、保留及未来实例；不将模块自己的节点再当宿主目标。后激活的层优先，退役恢复之前仍存活的层或宿主最新内容。

文件最多 96 个，严格相对便携文件名；包的 UTF-8 源文本及文件元数据总预算 512 KiB。每会话最多 32 个文档／4 MiB，运行时最多 128 个活动文档；每文档展开后最多 16384 节点。文件名不变成本机任意路径。`.c.nxml` 扩展不可变组件库，`.nss` 叠加当前样式。

注册层把载荷分成 60 KiB 的 TLV 块；使用 `SidecarRegistration.EncodeItem/DecodeItem`，不要手写超长字段。哈希覆盖完整载荷，分块不是取消源预算。

## 状态、动态片段与表单

`{data example.note.current}` 读取当前会话标量镜像，输入永远作为字面数据，不插入 XML 源文本。Host `{state ...}` 仍使用宿主预注册状态绑定。

`<Dynamic Key="Rows"/>` 可由 `Rows.d.nxml` 或 `Rows/001.d.nxml` 等文件填充，目录内按文件名排序。更新保留实体身份、焦点、选择、光标、输入草稿及嵌套动态槽。

`ArgumentFrom="Draft"` 读取本地输入值；缺失 Key、循环及过深引用在加载前拒绝。普通输入、开关和范围控件保留自己的意图值语义。宿主按当前活动 exposure 派发 Sidecar 注册命令，codec 与取消／超时规则仍有效；过期点击不能重新激活已退役模块。

## 引导、退出和内存压力

OnboardingPage 的继续按钮使用 `ui.sidecar.onboarding.continue`。继续或退役会取消相关待定交换、移除页面及敏感草稿，恢复宿主设置流程；不得靠页面可见就判定登录成功。

停止、失败、卸载和严重内存压力导致的协作停用都必须释放激活租约。恢复可能在同一个已注册会话中 ACTIVATE，因此将进程生命周期与激活生命周期分开。不要为恢复页面重新索取一个已缓存的 UI 包。

验收至少包括：缺少 feature 被拒绝、hash 错误、超预算、错误状态引用、实际点击与参数值、动态重载保留草稿、切换页面、停用取消、崩溃移除和旧 exposure 拒绝。仅 Encode/Decode 通过不能宣称真实 UI 交互已通过。

依据：[SidecarNxmlDocument](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.14/Nexa.Sidecar.Protocol/SidecarNxmlDocument.cs)、[运行时](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.14/Nexa.Xsr.Runtime/Sidecar/XsrNxmlModuleRuntime.cs)、[真实页面测试](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.14/tests/Nexa.Desktop.Tests/SidecarNxmlPresentationTests.cs)。

## 检查结果

加载合法页面，拒绝无效资源或 schema，再停用所有者。界面贡献应退出，不能留下仍可触发的输入路径。
