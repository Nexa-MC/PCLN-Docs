# UI 模块与扩展

## 从声明到显示

UiModule 和 Resource 在注册阶段传入内容与 SHA-256；Host 完整准入后缓存，打开已注册页面不再向 Sidecar 请求 UI。声明被保留不等于已获得执行权；Host 还必须授予并实现具体槽位/目标适配器。

A12 的交互模块使用 `SidecarUiDocument`（schema 2），最多 64 节点，编码最多 32 KiB。节点种类为 Text、Button、TextInput、Toggle、Image、Stack、Row；按钮/输入引用当前会话已声明的 Command，值和 enabled/visible 引用已声明的 State。

TextInput 草稿上限 512 字符；Toggle 要求 Boolean Command 和 ValueState codec，并协商 BinaryPayloads。图片只能引用模块 RequiredResources 中的当前会话 Resource，不能传 URL 或文件路径要求宿主读取。单图最多 1 MiB 编码、1024×1024 像素，模块像素及独立编码资源分别有 8 MiB 预算。

当前生产交互文档入口是资源扩展槽。不要假定可替换任意宿主页面、创建任意 NXML 或运行脚本。

## UI Patch

标题补丁使用 `SidecarUiCaptionPatch` 的有限 ABI，不是修改整棵 UI 树。首个目标 `ui.resources.search-label.v1` 上限 16 字符；文字和无障碍标签一起变化，补丁退役后恢复原始本地化。

## 信号和函数补丁

EventCatch/EventListen、IntentCatch/IntentWait 使用显式目标、二进制载荷和会话所有权。FunctionPatch 只能作用于 Host 已生成的允许站点及已支持的 ABI；它不提供任意 CLR/Harmony 注入。

重新显示模块产生新的 exposure 身份。旧点击、离开页面前排队的 intent、取消的会话结果都不能重新获得权限。会话停用、失败和释放会移除对应模块及订阅。

继续阅读：[交互模块](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-ui-modules.md)、[标题补丁](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-ui-patches.md)、[信号](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-signals.md)、[函数补丁](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/function-patches.md)。
