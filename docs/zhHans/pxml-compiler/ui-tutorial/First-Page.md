# 创建第一个界面

编译一个小型 PXML 页面并检查蓝图产物。编译器输出 PXB 文件，显示界面仍需要兼容运行时。

**适用版本：**历史 PXML 1.0 及其匹配运行时。当前插件请使用 [ABI 100](/plugin-sdk/)。

## 1. 编写页面

新建 `Hello.pxml`：

```xml
<?pxml version="1.0" strict="true"?>
<Page xmlns="pcl://ui" xmlns:x="urn:pcl:pxml:x">
  <Column Padding="16" Gap="8">
    <Text Text="Hello, PXML!" />
    <Button Text="继续" Command="{cmd Navigation.Continue}" />
  </Column>
</Page>
```

`Page` 是页面根节点；`Column` 按纵向排列子节点；`Text` 显示文本；`Button` 把激活行为交给 `Navigation.Continue` Command。PXML 不在 UI 文件中执行任意代码。

## 2. 检查源码

```bash
pxmlc check Hello.pxml --strict
```

成功时退出码为 `0`。语法、类型或结构错误会以 `path:line:column` 格式报告。

## 3. 生成 PXB

```bash
pxmlc --full Hello.pxml -o Hello.pxb --release --strict
```

`--full` 在同一进程内完成展开、优化和编译，不会把中间 PXML 或 PXIR 写入磁盘。`--release` 省略调试 Source Map。

## 4. 检查产物

```bash
pxmlc inspect Hello.pxb
pxmlc dump Hello.pxb
```

`inspect` 用于检查 PXB 的 header 与 section；`dump` 输出可读结构，便于确认节点和属性是否符合预期。生成的 `Hello.pxb` 由 PCL.UI.Next Runtime 加载，编译器本身不会创建测试窗口。

下一步可以阅读 [命令行参考](/pxml-compiler/CLI) 和 [编译阶段与 PXB](/pxml-compiler/Pipeline-and-PXB)。

## 检查结果

检查源码、构建二进制并查看区段，不把编译成功当作窗口已显示。
