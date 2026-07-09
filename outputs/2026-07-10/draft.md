今天这条 GitHub Trending，不是一个普通的提示词仓库，而是一套给 AI 编程代理使用的“工程习惯包”。它提醒我们：真正让 AI 变强的，往往不是一句神奇咒语，而是把高手的工作流固化成可重复执行的步骤。

## 把高级工程师的习惯，打包给 AI Agent

这个项目叫 `addyosmani/agent-skills`，作者把它定义为：Production-grade engineering skills for AI coding agents，也就是“面向生产级 AI 编程代理的工程技能”。

它的核心思想很简单：高级工程师写软件时，不只是写代码。他们会先澄清需求、拆解任务、逐步实现、写测试、做代码审查、检查性能，最后再发布。这个仓库把这些流程、质量门槛和最佳实践，打包成 AI Agent 可以稳定遵循的 `skills`。

换句话说，它不是让 AI “更会聊天”，而是让 AI 在开发全流程里更像一个有纪律的工程搭档。

## 关键不是命令，而是生命周期

仓库里最值得借鉴的是 8 个 slash commands，它们对应软件开发的完整生命周期：

- `/spec`：定义要做什么，原则是 Spec before code，先规格，后代码。
- `/plan`：规划怎么做，原则是 Small, atomic tasks，把任务拆成小而原子的步骤。
- `/build`：增量构建，原则是 One slice at a time，一次只完成一个切片。
- `/test`：证明它能工作，原则是 Tests are proof，测试就是证据。
- `/review`：合并前审查，目标是改善代码健康度。
- `/webperf`：审计网页性能，原则是 Measure before you optimize，优化前先测量。
- `/code-simplify`：简化代码，原则是 Clarity over cleverness，清晰胜过炫技。
- `/ship`：发布到生产环境，原则是 Faster is safer，更快、更小步地发布通常更安全。

这里最有价值的不是斜杠命令本身，而是它背后的思维顺序：先定义，再计划；先小步构建，再用测试证明；先审查，再发布。

这套顺序同样适用于写文章、做课程、搭建知识库、准备英文演讲，甚至训练自己的 AI 提示词。

## 一个值得抄走的 AI 工作流

如果你经常觉得 AI 输出“看起来很努力，但不够靠谱”，可以直接借用这个项目的工作流，把任何任务改成六步：

`Define → Plan → Build → Verify → Review → Ship`

对应中文就是：定义目标、拆解计划、逐步生成、验证结果、审查质量、交付发布。

你可以把下面这段作为通用提示词模板：

```text
你现在不是直接给答案，而是按一个生产级工作流协助我完成任务。

任务：{填写你的任务}
目标读者/使用场景：{填写场景}
成功标准：{填写什么算做好}

请按以下步骤执行：
1. Define：先澄清目标、边界、输入输出和潜在风险。
2. Plan：把任务拆成小而独立的步骤，每一步都有可检查结果。
3. Build：一次只完成一个切片，不要跳步。
4. Verify：说明如何验证结果是否正确，包括事实、逻辑、格式或测试方法。
5. Review：从质量、清晰度、可维护性和用户价值角度审查。
6. Ship：给出最终可直接使用的版本，并列出后续改进建议。

如果信息不足，请一次只问我一个最关键的问题。
```

这个模板的关键，是阻止 AI 直接进入“生成答案”模式。你是在要求它先建立规格，再进入执行。

## 对非程序员也有用：把 Prompt 写成流程，而不是愿望

很多提示词的问题，是它只表达愿望：帮我写得更好、帮我分析一下、帮我优化一下。

但高级提示词更像流程：先问什么，后做什么；每一步的输出是什么；怎样判断完成；哪里需要暂停确认。

这也是 `agent-skills` 对普通 AI 用户的启发：不要只给 AI 一个目标，要给它一套质量门槛。比如写英文邮件时，不要只说“帮我润色”，可以改成：

1. 先判断语气是否适合收件人；
2. 再检查表达是否自然；
3. 再压缩冗余句子；
4. 最后给出英文版本和中文修改说明。

这就是把“润色”变成了一个可执行的 skill。

## 顺手学几个高频英文表达

这个项目里的英文很适合积累成 AI 工作流词汇：

- `Spec before code`：先规格，后代码。
- `Small, atomic tasks`：小而原子的任务。
- `One slice at a time`：一次完成一个切片。
- `Tests are proof`：测试就是证明。
- `Measure before you optimize`：优化前先测量。
- `Clarity over cleverness`：清晰胜过炫技。
- `Quality gate`：质量门槛。
- `Production-grade`：生产级，能用于真实环境的。

今天的英文学习动作：选其中 3 句，改写到你自己的工作场景里。比如把 `Spec before code` 改成 `Outline before writing`，写作前先列大纲；把 `Measure before you optimize` 改成 `Diagnose before you rewrite`，重写前先诊断。

## AI习语的判断

`addyosmani/agent-skills` 值得关注，不是因为它提供了某个神奇命令，而是因为它把“资深工程师如何控制质量”翻译成了 AI Agent 能执行的结构。

未来我们使用 AI 的差距，很可能不在于谁知道更多工具，而在于谁更会把自己的工作方法编码成流程、检查表和可复用提示词。

来源：GitHub Trending Daily  
项目：`addyosmani/agent-skills`  
链接：https://github.com/addyosmani/agent-skills
