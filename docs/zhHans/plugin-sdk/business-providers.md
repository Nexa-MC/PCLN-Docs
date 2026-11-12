# 实现业务 Provider

Provider 向宿主提供某一受支持业务族的实现。注册描述符不会赋予拦截全部启动器行为的权限，也不意味着所有 Provider 族已经接入。

## 当前可用范围

自定义 Catalog 读取 Provider 支持 Search、ReadProject、ListVersions、ReadVersion、ReadChangelog、ResolveFiles、ResolveDependencies 七类查询。它不自动提供混合内置／自定义搜索、安装或收藏写入。

## 描述符与回调

回调信封使用 BusinessProviderCall，SchemaHash 使用其生成的 Digest，Configuration 使用 Empty，ContractVersion 为 100，SupportedScopes 为 application。ID 属于自己的命名空间，不能替换内置 ID。Capabilities 使用宿主闭合方法表中的准确名称。

回调先核对 Kind、Method、InputSchema、OutputSchema，再按输入 schema 解码 Inputs，直接返回输出模型，不再包一层信封。分页结果使用生成的集合 schema，保留资源提供方身份和查询范围。

## 并发和失败

当前读取边界支持 ExplicitRequest，以及 Queue、RejectDuplicate、Parallel；并发最多 4 个，队列最多 32 个。描述符超时为 1–30000 毫秒，包含排队时间，还会受到调用者剩余预算限制。

调用者或 Provider 停止会取消在途工作。回调持有注册时不能释放它；只读回调不能嵌套执行宿主修改。FailOperation 保留错误码，Unavailable 将失败映射为 PROVIDER_UNAVAILABLE。RetryBounded 和 ReplacePending 在本边界尚不接受。

## 验证

通过另一个消费者插件测试七类查询，验证类型和提供方身份；伪造项目 ID、无效文件元数据、跨查询复用游标都应失败。Provider 停止后应从列表消失，消费者不得自动绑定替代加载。详细回调字段见英文技术参考及 [API](api/catalog.md)。

---

来源: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/e721c6232c1ac280d3a1d6ac7a4c68dacfd97fc6/docs/zh-CN/business-providers.md) · Apache-2.0.
