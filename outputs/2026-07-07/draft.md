一个很值得借鉴的 AI 编程案例：Simon Willison 在发布 `sqlite-utils 4.0` 稳定版前，让 `Claude Fable` 做了一次“发布前最终审查”。结果，AI 不只是帮他改代码，还提前抓到了可能导致数据丢失的严重 bug。

这篇文章的价值不在于“AI 又写了多少代码”，而在于：当你把 AI 当成发布前的审稿人、风险扫描器和文档校对员时，它能显著提高关键工作的安全边界。

Simon 正在准备 `sqlite-utils 4.0` 的稳定版。几周前他已经发布过 `4.0rc1`，但因为他尽量遵守 `SemVer`（Semantic Versioning，语义化版本），不希望轻易发布破坏兼容性的主版本，所以在最终发布前，他决定让 `Claude Fable` 再做一次严肃检查。

他在手机上的 `Claude Code for web` 里输入的提示词非常简单，但方向很准：

`Final review before shipping a stable 4.0 release - very important to spot any last minute things that would be a breaking change if we fix them later`

可以翻成中文：在发布稳定版 4.0 之前做最终审查——非常重要，请找出那些如果以后再修就会变成破坏性变更的问题。

这个提示词的重点不是“帮我看看有没有 bug”，而是明确了一个判断标准：哪些问题如果现在不修，之后修复就会破坏兼容性。也就是说，它让 AI 按“发布风险”和“版本承诺”来思考，而不是泛泛地做代码审查。

`Claude Fable` 给出的初始报告中，有 5 个问题被归类为 `release blockers`，也就是阻止发布的问题。其中最严重的一个是 `delete_where()` 没有正确提交事务，并且会“污染”数据库连接。

具体来说，`Table.delete_where()` 执行 `DELETE` 时直接调用了 `self.db.execute()`，但没有像 `Table.delete()` 那样包在 `atomic()` 事务里。结果是连接会停留在 `in_transaction=True` 的状态。之后每一次 `atomic()` 调用都会进入保存点分支，却不会真正提交。最终可能出现非常危险的结果：删除、插入、新建表这些操作看起来执行了，但关闭数据库再打开，数据全都没有保存。

Simon 的评价很直接：这是一个非常糟糕的 bug。幸好没有把它带进稳定版。即使它理论上可以在 `4.0.1` 里修复，也说明发布前审查真的有价值。

接下来，他和 `Claude Fable` 一共进行了 37 轮提示，产生了 34 个提交，改动涉及 30 个文件，代码变化为 `+1,321 -190`。他们逐项处理反馈，同时也顺手做了若干设计改进。

这篇文章还有一个很现实的细节：Simon 并不是一直坐在电脑前。他甚至一边参加 Half Moon Bay 的 7 月 4 日游行，一边用手机偶尔查看进展、给 Fable 下一个指令。等到最后审查阶段，他才切回笔记本，在 GitHub 的 PR 界面里完成最终 review。

这说明 AI 编程代理的工作节奏和传统结对编程不一样。越复杂的任务，AI 有时越需要 10 到 15 分钟去运行、分析、修改。人类反而可以在中间做别的事，只在关键节点给方向、做判断、收口。

这次最重要的变化集中在事务处理上。`sqlite-utils 4.0rc2` 补充了更完整的事务模型文档。核心规则是：库中所有会写入数据库的方法，例如 `insert()`、`upsert()`、`update()`、`delete()`、`delete_where()`、`transform()`、`create_table()`、`create_index()`、`enable_fts()` 等，都会在自己的事务中运行，并在返回前提交。

换句话说，方法调用结束，改动就应该已经保存到磁盘。用户不需要额外调用 `commit()`，也不需要靠关闭数据库来持久化更改。

只有两种情况需要用户主动考虑事务：第一，你想把多个写操作组合成“要么全部成功，要么全部失败”的单元，这时使用 `db.atomic()`；第二，你自己用 `db.begin()` 管理事务，那么在你手动提交之前，库不会替你提交你自己打开的事务。

这里还有一个值得学习的工作方法：Simon 说，他在审查 Fable 的修改时，会先看文档改动。因为文档往往是理解代码变化的最快入口。先看文档，可以快速建立“这个版本到底改变了什么”的整体模型，再回头看代码和测试。

这对普通 AI 使用者也很有启发。我们不一定都在发布 Python 库，但在写方案、改产品、整理知识库、准备英文材料时，都可以把 AI 放在“发布前审查”的位置，而不是只让它生成初稿。

你可以直接复用这个提示词模式：

`Final review before shipping [deliverable]. Focus on issues that would become costly, breaking, misleading, or hard to fix after release. Classify findings as release blockers, important fixes, nice-to-haves. For each issue, explain the risk, how to reproduce or verify it, and the smallest safe fix.`

中文版本是：

请在发布/提交 `[交付物]` 前做最终审查。重点找出那些发布后会变得代价高、破坏兼容、误导用户或难以修复的问题。请把问题分成三类：阻止发布、重要修复、可选优化。每个问题请说明风险、如何验证，以及最小安全修复方案。

如果你的交付物是英文文章、简历、产品文档或提示词模板，也可以把 `breaking change` 换成 `misleading claim`、`ambiguous wording`、`unverifiable statement`、`reader confusion`。这既是 AI 工作流，也是英文表达训练：你会学会用更精确的风险词汇来描述问题。

一个实用流程如下：第一步，让 AI 做最终审查，不要让它直接重写；第二步，要求它按严重程度分类；第三步，先处理 `release blockers`；第四步，先审文档或说明，再审正文/代码；第五步，让 AI 为每个改动补一条验证方法。

这篇文章给我的最大提醒是：AI 最有价值的角色之一，不是替你“多写一点”，而是帮你在发布前“少犯一次大错”。尤其是当你已经有初稿、有代码、有版本、有用户承诺时，AI 的审查能力会比它的生成能力更重要。

来源：Simon Willison，`sqlite-utils 4.0rc2, mostly written by Claude Fable (for about $149.25)`
链接：https://simonwillison.net/2026/Jul/5/sqlite-utils-fable/#atom-everything
