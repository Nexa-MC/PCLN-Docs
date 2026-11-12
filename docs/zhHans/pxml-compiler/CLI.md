# PXML 编译器命令参考

以下命令属于历史 PXML 1.0 工具链，输出供匹配运行时使用的蓝图，不是当前 NexaCL 插件的 NXML。先安装工具并加入 PATH，再在页面所在目录执行。

## 一次完成构建

```sh
pxmlc --full Hello.pxml -o Hello.pxb --release --strict
```

该命令在一个进程完成展开、优化与编译，中间 PXML／PXIR 保留在内存。strict 要求 `pcl://ui` 命名空间并拒绝未知属性；release 省略 SMAP 源映射。需要定位源码时保留调试构建。

## 分阶段定位问题

```sh
pxml-expand Hello.pxml -o Hello.expanded.pxml
pxml-opt Hello.expanded.pxml -o Hello.pxir
pxml-compile Hello.pxir -o Hello.pxb --strict
```

优化器读取展开后的 PXML，生成二进制 PXIR；编译器直接读取该 IR，不会重新展开源文件。把错误中间格式改一个后缀，不能让它成为合法输入。

| 选项 | 含义 |
| --- | --- |
| `-o FILE` | 当前阶段的输出路径 |
| `--component FILE` | 显式注册组件，可重复 |
| `--import FILE` | 显式注册允许的导入，不隐式读取任意路径 |
| `-D SYMBOL` | 定义构建符号，可重复 |
| `--debug` | 在支持的阶段保留调试信息 |
| `--strict` | 使用严格语法和属性契约 |
| `--warn-as-error` | 警告也导致失败 |
| `--release` | 全流程发布输出，不含 SMAP |

组件、导入和符号选项用于展开或完整流程，不应把所有选项无差别传给每个程序。

## 验证与检查

```sh
pxmlc check Hello.pxml --strict
pxmlc inspect Hello.pxb
pxmlc dump Hello.pxb
```

check 检查源码，inspect 展示区段，dump 输出可读结构；format 用于源码格式化。退出码 0 表示成功，1 表示源码、语义或二进制诊断，2 表示命令用法错误。CI 遇到失败应停止并保留诊断，不能继续安装旧输出。

继续阅读[首个页面](ui-tutorial/First-Page)和[流水线说明](Pipeline-and-PXB)。
