# NXML 宿主界面开发教程

本路线详细讲 NexaCL 的专用标记语言，不要求你先了解它。适用于学习 XSR 呈现模型、参与 Host 页面开发或编写受控组合测试的作者。**NTP 不能携带替换页面，Sidecar 当前 UI 使用独立 schema 1/2；学习 NXML 不会自动获得注入 Host 的权限。**

## 目标与运行模型

NXML 声明“有哪些语义节点、如何布局、读哪些状态、发什么意图”。业务服务执行动作并发布事实；Renderer 不解析 C#、调用服务或通过反射寻找处理器。

```text
外部 .nxml/.c.nxml + 基础 .nss
 → 有界解析/组件展开 → 类型化 Host IR
 → 解析预先注册的 State → 保留 UI 树
 → 本地状态投影、布局、命中、绘制
用户输入 → semantic Intent → Host 组合层 → 业务执行/State
```

这是运行期有限标记编译，不是 CLR JIT 或动态生成 C#。因此可以与 NativeAOT 共存。Host IR 是内部结构，不是承诺给插件的稳定序列化 ABI。

## 从可运行实验开始

[Authoring Lab](https://github.com/Nexa-MC/PCLN-Docs/tree/main/examples/authoring-lab)包含完整页面、组件、动态片段、基础样式和 C# 组合。它生成可检查的语义场景，不打开原生窗口，不声称完成了第三方页面安装接口。

```sh
dotnet run --project examples/authoring-lab/Authoring.Lab.csproj -c Release -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -- /absolute/path/to/PCLN-Docs
```

## 完整学习路线

1. [语法与组件](./syntax-and-components)：命名空间、根、属性、值、展开与身份。
2. [布局与样式](./layout-and-style)：容器、尺寸、滚动、基础 NSS 与主题 NSS/1 的区别。
3. [状态与输入](./state-and-input)：预注册 State、绑定、Command intent、输入草稿和有限控件。
4. [动态内容与重载](./dynamic-and-reload)：参数化片段、所有权、保留更新、替换、重排。
5. [弹层与无障碍](./overlays-and-accessibility)：遮罩、锚点、关闭路由、播报和交互退役。
6. [完整参考](./reference)：所有内置组件、属性族、支持绑定和预算。
7. [综合实验](./complete-example)：逐段理解真实项目，验证正反例及 NativeAOT。

每章从目标出发，先确定当前事实和界面职责，再给声明及调用实例。新页面的成功标准包括状态正确、输入可用、离页清理和旧结果隔离，不只是能绘制。


## 实现依据

- [docs/xsr/nxml-renderer.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nxml-renderer.md)
- [Nexa.Xsr.Renderer.Nxml.Compiler/NxmlParser.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Compiler/NxmlParser.cs)
- [Nexa.Xsr.Renderer.Nxml.Runtime/NxmlUiLoader.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Renderer.Nxml.Runtime/NxmlUiLoader.cs)
