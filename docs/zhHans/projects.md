# 项目与源码归属

以下仓库用于查找文档对应的实现。仓库存在不代表功能已经发布，也不代表当前安装的启动器实现了全部接口。

| 项目 | 职责 |
| --- | --- |
| [NexaCL](https://github.com/Nexa-MC/NexaCL) | 启动器、业务服务及宿主接入 |
| [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK) | 公开 Bootstrap／ABI 契约、头文件、示例与 SDK 文档 |
| [NexaCL-Plugin-Template](https://github.com/Nexa-MC/NexaCL-Plugin-Template) | 固定 SDK 的可运行 Wasm 插件模板与 CI |
| [PCLN-Docs](https://github.com/Nexa-MC/PCLN-Docs) | 本文档站和版本化开发示例 |
| [PXML Compiler](https://github.com/PCL-N-Edition/PXML-Compiler) | 历史 PXML／PXB 编译器和对应格式参考 |
| [NexaCL 网站](https://pcln.top/) | 产品与 Market 网站 |

新插件从模板和[SDK 教程](plugin-sdk/quickstart)开始。旧 PCL SDK 项目请先阅读[迁移说明](plugin-sdk/migration)，不要只替换依赖名。
