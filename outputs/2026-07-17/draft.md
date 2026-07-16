# Kimi K3 发布：比参数更值得学的，是如何设计自己的“小基准”

今天这篇来自 Simon Willison。他写的是 Moonshot AI 新发布的 Kimi K3，但真正有意思的不是“又一个大模型刷新榜单”，而是他继续用一个看似荒诞的测试：让模型生成“一只骑自行车的鹈鹕”的 SVG。

这个测试不再适合用来判断模型强弱，却很适合提醒我们：普通用户也应该有自己的小型评测方法。不是为了跑分，而是为了知道一个模型到底适不适合你的工作。

## Kimi K3 的几个关键信息

Moonshot AI 宣布 Kimi K3，称它是目前最强的模型，拥有 2.8 万亿参数。现在可以通过官网和 API 使用，官方承诺会在 2026 年 7 月 27 日前开放权重。Moonshot 把它称为第一个 open 3T-class model，也就是“开放的 3 万亿级模型”。严格说是 2.8T，但四舍五入到了 3T。

根据 Moonshot 自己公布的评测，Kimi K3 多数指标超过 Claude Opus 4.8 max 和 GPT-5.5 high，但仍落后于 Claude Fable 5 和 GPT-5.6 Sol。Artificial Analysis 的报告里有几个值得看：在长周期知识工作评测中，Kimi K3 的 Elo 为 1547，比 Kimi K2.6 高 732 分，仅次于 Claude Fable 5；单任务成本约 0.94 美元，接近 GPT-5.6 Sol 的 1.04 美元，约为 Opus 4.8 的一半；在 Artificial Analysis Intelligence Index 上，Kimi K3 的输出 token 比 K2.6 少了 21%。

它还登上了 Arena.ai 的 Frontend Code 排行榜第一，甚至超过 Claude Fable 5。但价格也很醒目：每百万输入 token 3 美元，每百万输出 token 15 美元，基本接近 Anthropic Claude Sonnet 系列，也成为目前中国 AI 实验室发布过的最贵模型之一。相比 Kimi K2.6 的 0.95 / 4 美元，涨幅不小。

## 鹈鹕测试为什么有趣？

Simon 用 OpenRouter 调用 Kimi K3，让它执行这个提示词：Generate an SVG of a pelican riding a bicycle。结果生成一张“一只骑自行车的鹈鹕”的 SVG。

这次调用用了 95 个输入 token 和 16,658 个输出 token，其中 13,241 个是 reasoning tokens，总成本约 25 美分。随后他又把渲染后的 SVG 图片喂回 Kimi K3，让模型描述图片，成本约 0.6 美分。模型正确描述了白色鹈鹕、红围巾、红色自行车、道路、云、太阳、飞鸟和草地等细节。

这个 pelican benchmark 已经用了 21 个月。Simon 一开始只是开玩笑：模型之间太难比较了，不如让它们画一只骑自行车的鹈鹕。奇妙的是，在最初一年里，这个怪测试和模型整体能力居然有一定相关性。现在这种相关性基本断了。因为今天真正重要的能力，已经不是“能不能画出一个复杂 SVG”，而是 agentic tool calling：模型能否在长对话里可靠地调用工具、保持目标、修正错误、完成多步骤任务。

所以结论不是“用鹈鹕比较模型”，而是：一个固定、怪异、可重复的小任务，可以迫使你真正动手试模型。只看榜单，很容易被模型名字、参数、营销词和跑分带走；自己跑一次，才知道成本、速度、输出风格和失败方式。

## AI习语视角：为自己设计一个“小基准”

我建议读者给自己设计一个 personal benchmark，也就是“个人小基准”。它不需要科学到能发表论文，但必须贴近你的真实使用场景。

一个好用的小基准可以用四步：第一，选一个你反复遇到的任务；第二，写成固定提示词；第三，用不同模型跑同一题；第四，不只看答案好坏，还记录成本、长度、修改次数和你是否愿意继续用。

比如 AI习语读者可以准备三类小基准：英文输入类，让模型把一段中文观点改写成自然英文；知识工作类，让模型阅读一篇英文长文并提炼可执行方法；工具任务类，让模型把一个想法转成表格、提示词、邮件或网页片段。

## 一个可直接复制的提示词模式

你可以把下面这个模板作为自己的模型评测提示词：

【任务】请完成一个真实工作场景任务：把下面这段中文观点改写成自然、清晰、适合发给英文同事的英文邮件。
【要求】
1. 不要逐字翻译，要像英文母语商务写作。
2. 保留原意、语气和关键事实。
3. 给出两个版本：简洁版和更礼貌版。
4. 最后用中文解释你做了哪些表达选择。
【原文】……

跑完之后，用五个维度打分：准确性、自然度、可编辑性、解释质量、成本。对语言学习者来说，最后一项“中文解释表达选择”尤其重要，因为它能把 AI 从翻译器变成写作教练。

## 今天可以做的英文学习动作

从这篇文章里，建议记住三个表达：benchmark 是“基准测试”，但在个人工作流里也可以理解为“固定试题”；forcing function 是“促使你不得不行动的机制”，Simon 的鹈鹕测试就是 forcing function；agentic tool calling 指模型像代理一样调用工具、执行多步骤任务的能力。

把这三个词放进你的 AI 使用笔记里，并各写一个例句。比如：A personal benchmark is a forcing function for actually trying new models. 这句话的价值不在语法，而在思维方式：不要只收藏模型新闻，要建立自己的试用机制。

## 来源

本文根据 Simon Willison 的文章《Kimi K3, and what we can still learn from the pelican benchmark》精翻、改写并加入 AI习语视角。

Source: Simon Willison
URL: https://simonwillison.net/2026/Jul/16/kimi-k3/#atom-everything
