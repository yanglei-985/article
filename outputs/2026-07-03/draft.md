# 用两个提示词，让 AI 自己搭出一个编程 Agent

Simon Willison 又做了一个很适合拆解的实验：他用自己的 `LLM` 库，让 `Fable 5` 帮他从零生成了一个简单的编程 Agent：`llm-coding-agent 0.1a0`。

这篇原文看起来像一次项目发布，但对「AI习语」读者更有价值的地方，不是这个工具本身有多成熟，而是它展示了一种可复制的 AI 工作流：先让 AI 写规格，再让 AI 按测试驱动开发一步步实现。

Simon 说，他的 `LLM` Python 库已经越来越像一个 Agent 框架，所以他想看看：如果基于它做一个类似 `Claude Code` 的简单编程 Agent，会是什么样子？

他先用自己的 `python-lib-template-repository` 创建了一个新的 Python 库，然后给 AI 两个提示词。第一个是：为这个项目写一份 `spec.md`，项目依赖 PyPI 上最新 alpha 版的 `llm`，实现一个 `Claude Code` 风格的编程 Agent，具备读文件、改文件、执行命令等工具。

第二个提示词更关键：提交这份规格，然后用红绿循环的 `TDD` 方式实现它，拆成一系列合理的提交；每次提交都要通过测试、更新文档，并且偶尔用环境变量里的 `OpenAI API key` 手动测试。

这就是重点。Simon 没有直接说“帮我写一个工具”，而是先要求 AI 产出规格，再要求 AI 用工程流程推进：提交规格、写失败测试、实现、跑通测试、更新文档、分阶段提交。这比单次生成代码稳定得多，因为它把“结果导向”变成了“过程约束”。

最后，Simon 把这个早期版本发布到了 PyPI。他称它为一个 `slop-alpha`，也就是很早期、很粗糙但能玩的 alpha 版本。读者可以用下面这种方式运行：`uvx --prerelease=allow --with llm-coding-agent llm code`。

这个 Agent 已经支持一些典型用法，例如 `llm code --yolo`，或者用 `--allow` 限定可执行命令，比如只允许 `pytest*` 和 `git diff*`。它还意外生成了一个 Python API：`CodingAgent(model="gpt-5.5", root="/path", approve=True).run("Fix the failing test in tests/test_parser.py")`。Simon 说这个 API 并不是他要求的，但他很高兴看到 AI 自己实现了它。

这个项目最值得学习的是工具接口设计。它实现了一组编程 Agent 常见工具：`read_file` 用来读取带行号的文件内容，`edit_file` 用精确字符串替换文件片段并返回 diff，`write_file` 创建或覆盖文件，`list_files` 按 glob 查找文件，`search_files` 用正则搜索内容，`execute_command` 在项目根目录执行命令并返回输出和退出码。

这些工具说明了一个事实：编程 Agent 的能力并不神秘。它需要的不是“全知全能”，而是一组边界清晰、可审计、能返回结果的动作。读文件要有行号，改文件要返回 diff，执行命令要有超时和退出码，搜索要限制范围，列表要过滤无关目录。这些小约束，就是 Agent 可控性的来源。

Simon 随后做了一个试玩：运行 `llm code --yolo`，让它创建 `/tmp/demo`，并在里面做一个简单的 SwiftUI CLI 应用，用 ASCII art 显示时间。模型在推理中指出：`SwiftUI` 并不适合真正的 CLI，于是改做了一个可以通过 `swift run AsciiTime` 输出 ASCII 时间的应用。

这里也有一个提示：好 Agent 不只是执行命令，还会纠正任务设定里的不合理之处。用户说 SwiftUI CLI，模型没有机械照做，而是识别出技术栈和目标形态之间的冲突，然后选择更合适的实现方式。

给读者一个可直接复用的提示词模式：

```text
你是我的工程型 AI Agent。请不要直接开始写代码。
第一步：阅读项目结构，写一份 spec.md，说明目标、范围、接口、工具、测试策略和风险。
第二步：提交 spec。
第三步：使用 red/green TDD 实现：先写失败测试，再实现最小代码，再运行测试。
第四步：每完成一个小功能，更新文档，并给出一次清晰 commit。
第五步：所有文件修改必须可审计：改文件前先说明意图，改完后展示 diff；执行命令必须说明目的，并返回退出码。
第六步：遇到需求不合理时，先指出冲突，再给出更合适的实现方案。
```

如果你不是程序员，也可以把这个模式迁移到写作、翻译和英文学习上。比如把“代码测试”换成“检查清单”，把“commit”换成“阶段性版本”，把“diff”换成“修改说明”。核心不是写代码，而是让 AI 在一个可追踪的流程里工作。

一个英文学习动作：记住这篇文章里的几个高频表达。`coding agent` 是编程智能体，`tool use` 是工具调用，`red/green TDD` 指先让测试失败再让测试通过的开发循环，`approve=True` 暗示执行前需要人工批准，`yolo` 在工具语境里常表示“少确认、直接执行”的高风险模式。这些词以后读 AI 工具文档会反复遇到。

AI 工具的下一步，不只是更强的模型，而是更好的工作协议。你给 AI 的不是一句愿望，而是一套流程、边界和反馈机制。Simon 这次实验的价值就在这里：让我们看到，一个实用 Agent 往往是从一份清楚的规格和一组可靠的小工具开始的。

来源：Simon Willison，`llm-coding-agent 0.1a0`，https://simonwillison.net/2026/Jul/2/llm-coding-agent/#atom-everything
