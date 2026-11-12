# 页面与确认动作

从[入门项目](../quickstart.md)继续。本章解释模板如何把包内资源、NXML 页面、动作描述和回调连成一个功能。

## 按顺序注册

`wasm/plugin.c` 使用独立的输入、输出和参数缓冲区，避免序列化调用时覆盖正在使用的参数。Initialize 首先调用 `Files.OpenPackageFile` 打开 `page.nxml`；收到成功回复后，构造 `UIPage` 并注册页面；页面注册成功后，再调用 `Actions.Register`。

`step` 只保存下一条回复的处理位置。回复中的模型视图借用输入缓冲区，不能跨下一次 resume 保存。任意注册失败时结束初始化，让宿主统一回滚暂存内容。

## 连接按钮与动作

模板按钮使用以下绑定：

```xml
<Button Key="ExamplePluginAction"
        Content="Run action / 执行操作"
        Command="ui.plugin.action"
        Argument="{{PLUGIN_ID}}:hello"
        Width="220" Height="44" />
```

`{{PLUGIN_ID}}` 由构建脚本替换，不是运行时 NXML 表达式。Key 标识界面元素，Argument 指向动作；改变按钮文字不改变动作，改变 Argument 则必须同步修改注册目标。

## 理解动作契约

该动作的输入为 Empty，输出为 TextResult，处理器为回调 1，并要求 UserConfirmation。它声明为只读，但只读不会取消明确要求的用户确认。宿主批准后才分发回调，回调通过 `nx_handler_success` 返回 TextResult。

把返回文字改为 `Notes action completed`，保持 schema 不变，重新构建并加载。依次验证批准、拒绝和卸载。以后新增输入字段时，需要一起修改描述符、输入生产者和解码器，不能只改一端。

真实写操作必须声明真实副作用，并使用对应业务计划。不要为了避开幂等或确认要求，把写操作标成只读。

## 验证发布时机

页面和动作在初始化时暂存，整组通过检查并激活后才对用户可见。加载失败时不应闪现可交互页面；停止后页面和注册项应消失。SDK 的 `samples/WasmDesktop` 是固定身份的完整示例，`samples/WasmAdvancedUi` 进一步展示组件和对话框。

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/zh-CN/tutorials/page-and-action.md) · Apache-2.0.
