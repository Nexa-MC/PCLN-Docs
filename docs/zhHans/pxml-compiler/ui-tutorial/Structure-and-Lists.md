# 条件、列表与虚拟化

使用结构指令创建和移除子树，通过稳定项身份保留列表状态。仅改变可见性与移除结构具有不同寿命。

**适用版本：**历史 PXML 1.0 及其匹配运行时。当前插件请使用 [ABI 100](/plugin-sdk/)。

结构指令改变 Blueprint subtree，而不是只切换绘制透明度。选择正确的指令可以避免无效 Entity 和无界内存。

## x:If

```xml
<x:If Condition="{bind Account.IsLoggedIn}">
  <Text Text="已登录" />
  <x:Else>
    <Button Text="登录" Command="{cmd Account.Login}" />
  </x:Else>
</x:If>
```

`x:If` 是运行时结构 Binding。分支变化会实例化/销毁对应 subtree，并遵守 generation-safe reconcile。

## x:Switch

```xml
<x:Switch Value="{bind Download.State}">
  <x:Case Value="Idle"><Text Text="等待" /></x:Case>
  <x:Case Value="Downloading"><Text Text="下载中" /></x:Case>
  <x:Default><Text Text="未知状态" /></x:Default>
</x:Switch>
```

状态互斥且超过两个分支时使用 Switch，比嵌套多层 If 更清楚。

## x:For

小规模集合可以直接展开：

```xml
<x:For Each="{bind RecentFiles}" As="file" Key="{file.Id}">
  <Text Text="{file.Name}" />
</x:For>
```

同一 collection version 内，Key 必须唯一且稳定。插入或重排后，Runtime 依靠 Key 保留 presentation identity。

## VirtualList

```xml
<VirtualList
  Items="{bind Mods}"
  Key="{item.Id}"
  EstimatedItemHeight="48"
  OverscanBefore="2"
  OverscanAfter="3">
  <Template As="item">
    <ModItem Mod="{item}" />
  </Template>
</VirtualList>
```

VirtualList 的核心 contract：

- 逻辑项不等于 Entity；只为 viewport + overscan 建立 slot。
- 滚动时优先保留仍在新窗口内的 slot，只重绑定进入窗口的 item。
- `Version` 只在集合拓扑、Key 或可观察 binding 数据变化时递增。
- offset/index 查询保持 `O(log N)`；100,000 项不能导致逐帧 `O(N)` 扫描。
- 变长项的实测 extent 按当前 source 的 Key 缓存；source refresh 会清理已消失 Key。

## 如何选择

| 需求 | 选择 |
|---|---|
| 两个互斥分支 | `x:If` + `x:Else` |
| 多状态互斥分支 | `x:Switch` |
| 少量、全部需要存在的项 | `x:For` |
| 大量可滚动项 | `VirtualList` |
| 平台/版本在构建时决定 | `x:IfBuild`，不是运行时 If |

下一章：[组件、模板与 Slot](./Components-and-Templates)。

## 检查结果

在行获得焦点时插入、删除和重排项，再测试足以启用虚拟化的列表。
