如果你还把 AI 工具理解成“打开一个聊天框，问它问题”，那已经落后一代了。Simon Willison 今天转述 Ethan Mollick 的最新 AI 使用指南时，最值得注意的变化不是哪个模型跑分更高，而是：AI 的主战场正在从聊天，转向能连续替你完成数小时工作的 agentic systems。

## 从 Chat 到 Agent：选择 AI 的标准变了

一年前，很多人的 AI 选择题还很简单：ChatGPT、Claude、Gemini，外加 o3、Claude 4 Opus、Gemini 2.5 Pro 这些强模型；如果要做更长的资料搜集，就用 Deep Research。

但现在，Ethan Mollick 的指南明显转向了 agentic systems，也就是那种“AI 可以一次性完成相当于真人数小时工作的系统”。这类系统不只是回答问题，而是能规划步骤、访问环境、使用工具、运行代码，甚至在你授权后操作电脑。

Simon Willison 观察到，Gemini 暂时从 Ethan 的推荐列表中掉了下来，原因是 Google 还没有在 Codex、ChatGPT Work、Claude Cowork 这一类“可执行工作”的产品形态里建立稳定入口。Gemini Spark 还需要证明自己。

## 最关键的一句话：给 AI 一台电脑

Ethan 的核心建议很直接：最强大的 AI 用法，是给它访问电脑的能力。

这句话听上去有点夸张，但逻辑很清楚。聊天框里的 AI 只能根据你输入的信息推理；有工具的 AI 可以检索、写文件、跑代码；有电脑访问权限的 AI，则可以接近真实工作流：打开资料、整理文件、执行脚本、检查结果、继续修正。

目前，ChatGPT 和 Claude 都在往这个方向走。你可以下载它们的桌面应用，并选择不同的 agent 模式。ChatGPT 里有 Work 和 Codex；Claude 里有 Cowork 和 Code。麻烦的是，这些名字并不对应，甚至很难靠名字记住它们的能力边界。

## 命名混乱，但用法可以简化

Simon 特别吐槽了一点：ChatGPT 移动端的 Work 和桌面端的 Work 并不是一回事。桌面端里的 ChatGPT Work，本质上更像是 Codex 的一个更容易上手的外壳；而移动端从 Chat 切换到 Work，则会得到一个解除联网限制的 Code Interpreter 容器。

这说明一个现实问题：未来 AI 产品的名称会越来越像“内部功能名”，普通用户不能只看名字判断能力。更可靠的判断方式是问三个问题：它能不能联网？能不能读写文件？能不能执行代码或操作你的工作环境？

对普通读者来说，别急着背产品名。你真正需要建立的是一张“任务—权限—交付物”的选择表。

## AI习语工作流：三步选择该用哪个 AI

第一步，判断任务类型。如果只是解释概念、改写句子、翻译邮件，用普通 Chat 模式就够了。如果要跨网页查资料、比较多篇文章、整理引用，用 Deep Research 或带浏览能力的研究模式。如果要处理文件、表格、代码、项目资料，就优先考虑 Work、Cowork、Codex、Code 这类 agent 模式。

第二步，明确授权边界。不要一上来就让 AI 自由操作。你可以告诉它：先只读取，不修改；先列计划，等我确认；所有外部操作前必须询问；生成的文件放到指定文件夹；不要删除或覆盖原文件。

第三步，定义交付物。Agent 模式最怕目标模糊。与其说“帮我整理这些资料”，不如说“请读取这个文件夹里的 8 篇英文文章，输出一份 1200 字中文摘要、一张术语表、5 个可复用提示词，并标注每条结论来自哪篇文章”。

## 可直接复制的提示词模式

你可以把下面这个模板用于 Work、Cowork、Codex 或 Code 模式：

任务：请帮我完成【具体任务】。

环境：你可以访问【文件夹/网页/项目/数据】。

权限：第一阶段只允许读取和分析，不要修改、删除或提交任何内容。需要执行外部操作前，先说明原因并等待我确认。

步骤：先列出你的工作计划；然后执行；最后检查结果是否满足要求。

交付物：请输出【摘要/表格/代码/报告/学习卡片】，格式为【具体格式】，并附上关键依据、未解决问题和下一步建议。

质量标准：结果要准确、可复查、可继续迭代；如果信息不足，请先提问，不要编造。

这个模板的重点不是“让 AI 更聪明”，而是把 AI 从聊天对象变成受约束的工作代理。

## 顺手学几个英文表达

今天这篇文章里有几个值得记住的表达。

agentic systems：具备自主执行能力的系统，不只是对话，而是能规划和行动。

where the AI is capable of doing the equivalent of many hours of real human work in one go：AI 可以一次性完成相当于真人数小时的工作。

give it access to your computer：给它访问你电脑的权限。这里的 access 不只是“看见”，还可能包括读取文件、执行命令、操作应用。

spectacularly unintuitive：极其不直观。Simon 用这个词形容 ChatGPT 不同 Work 模式之间的混乱差异。

## 今天的结论

AI 工具选择的核心，正在从“哪个模型最强”变成“哪个系统能在合适权限下完成真实工作”。

以后使用 AI，不要只问：我该用 ChatGPT、Claude 还是 Gemini？更好的问题是：我的任务需要聊天、研究、代码执行，还是电脑级代理？我愿意给它什么权限？我期待什么交付物？

这才是 agent 时代真正的提示效率。

来源：Simon Willison，An opinionated guide to which AI to use to do stuff
链接：https://simonwillison.net/2026/Jul/27/an-opinionated-guide-to-which-ai-to-use-to-do-stuff/#atom-everything
