# Contribute developer documentation

A reader should be able to identify whether a page applies to their version, follow
its instructions and distinguish success from a plausible-looking failure. Optimize
for that outcome rather than page length or the number of headings.

## Choose one primary purpose

- **Tutorial:** a continuous path from a known starting point to a working result.
  Include tools, working directory, complete files, commands and observations.
- **Task guide:** solve one named problem; state prerequisites and the decision that
  chooses this route. Include cancellation, cleanup or rollback where relevant.
- **Explanation:** connect behavior to ownership and constraints. Use a concrete
  example before introducing an abstraction.
- **Reference:** specify fields, units, required/nullable behavior, return values,
  errors, authority, lifecycle, limits and compatibility. Link to a working example.

A page can link to another purpose instead of trying to teach everything at once.
Keep historical proposals separate from current contracts and released behavior.

## Write precise prose

Lead with what the reader can do or understand. Use complete sentences around code
and tables; explain why a sequence matters. Prefer one concrete example over a string
of slash-separated terms. Define an acronym before relying on it. Keep Host,
PluginSidecar, action, task, provider, registration and subscription distinct.

Avoid promises such as “fully supported” without versioned evidence. A type existing
in the SDK is not implementation evidence. Do not infer numeric defaults, platform
support or retry safety from a method name. State an actual unknown as unknown.

English is the source language. Provide Simplified Chinese entry points and tutorials;
preserve identifiers, commands and error codes. Label untranslated technical material
instead of changing only its heading and presenting it as a translation.

## Keep examples trustworthy

Complete runnable code belongs in a source file compiled by CI. Mark excerpts and
pseudocode explicitly. SDK tutorial excerpts are synchronized with their actual
source files. A successful build proves syntax and linkage; permission denial,
confirmation and retirement require runtime tests. State which evidence exists.

For a behavior change, update its example, explanation, reference and support status
together. Review links and the rendered page. Do not change a pinned version just to
make a command look current without testing against that version.

## Review and validate

Run `pnpm docs:check` and `pnpm docs:build`. For SDK changes, edit the SDK source,
run its document/example checks, commit that source, then synchronize this website.
For theme, Sidecar and NXML examples, run the relevant authoring checks or inspect
CI before claiming they pass. Retain old URLs as explicit migration entry points.

The editorial organization draws on Django and Forge's developer documentation:
clear prerequisites, a complete first result, focused topics and searchable references.
Use their structure as guidance; NexaCL contracts must be established from NexaCL code.

## 简体中文

每页先说明适用版本和读者目标，再给出完整步骤与可观察结果。教程教会一条可运行路线，任务指南解决一个问题，原理说明解释原因，参考文档准确列出契约。用完整句子连接代码与表格，不用堆砌术语代替解释。

未知行为明确标为未知；SDK 有类型不代表宿主已经实现。完整示例进入 CI，片段和伪代码明确标注。提交前检查链接、构建和相关示例；修改 SDK 源文档后再同步网站，并保留旧地址的迁移入口。
