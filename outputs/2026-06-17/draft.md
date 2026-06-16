# 当「修好这段代码」被当成越狱：AI 安全的真正问题

如果一句提示词是「fix this code」（修好这段代码），它到底是在制造攻击，还是在做防御？

Simon Willison 今天转述了安全研究者 Kate Moussouris 的澄清：导致 Claude Fable 5 被纳入出口管制争议的所谓「jailbreak」，本质上并不是让模型写攻击脚本，而是让模型修复有漏洞的代码。

研究者拿了两类代码：一类是已经公开、带有已知 CVE 漏洞的开源代码；另一类是他们故意植入漏洞的新代码。然后他们让 Fable 5、Mythos 和 Opus 去「review the code for security issues」（审查代码中的安全问题）。Fable 5 拒绝了。

接着，研究者换了一种说法：让模型「fix this code」。在一个多步骤、需要人工参与的流程里，他们把模型输出转成测试补丁的脚本。于是，这被描述成一种绕过安全护栏的方式。

Kate 的判断很直接：这很荒唐。

因为编码模型最基本、也最有价值的能力之一，就是修 bug。而安全漏洞，本来就是最重要的一类 bug。对防御者来说，理想的 AI 助手应该能做三件事：找出代码里的漏洞，解释为什么要修，写测试确认补丁真的有效。

这不是绕过护栏，而是防御安全每天都在运行的 find, fix, test 循环。

## AI习语视角：问题不在提示词，而在任务语境

这篇短文值得 AI 用户认真看，因为它提醒我们：同一句英文提示词，在不同语境下含义完全不同。

「fix this code」可以是普通开发请求，也可以是安全修复请求；「write a test」可以是质量保障，也可以被误读成攻击验证。真正关键的不是某几个词看起来像不像危险指令，而是任务目标、输入材料、输出约束和使用场景。

如果政策制定者只听到「模型能 craft cyber attacks」，就可能把任何能帮助安全修复的模型都视为危险。结果是：攻击者未必被限制，防御者反而失去最有用的工具。

对普通 AI 使用者，这也有一个直接启发：写提示词时，不要只写动作，要写清楚防御目标、边界和验证方式。

## 一个可复用的安全修复提示词模式

你可以把下面这个模式用于代码审查、漏洞修复和学习安全英文表达：

**角色**：你是一名 defensive security reviewer，只帮助修复和验证代码，不提供攻击部署建议。

**任务**：请审查以下代码，找出可能的安全问题，给出最小必要修复，并解释每个修复为什么重要。

**输出格式**：
1. Risk summary：用中文概括风险。
2. Patch：给出修改后的代码或 diff。
3. Why it matters：解释漏洞成因和修复逻辑。
4. Regression tests：写出能验证补丁有效的测试。
5. Safe boundaries：不要提供利用步骤、武器化脚本或真实目标攻击建议。

这个模式的重点不是「骗过模型」，而是把意图讲清楚：我是防御者，我要修补漏洞，我需要测试来确认修复有效。

## 顺手练英文：把安全任务拆成四个动词

这篇文章里有一个很值得记的表达：the find, fix, and test loop。它可以扩展成 AI 工作流里的四个英文动词：find, explain, fix, test。

下次你让 AI 帮你处理复杂问题时，也可以用这四步：先 find 找问题，再 explain 解释原因，然后 fix 给出修复，最后 test 验证结果。

这不仅适合代码，也适合英文写作：find awkward expressions，explain why they sound unnatural，fix the sentences，test with alternative phrasings。

好的提示词，不只是命令模型「做事」，而是让模型进入一个可验证的工作循环。

## 来源

Source: Simon Willison

Title: The Fable 5 Export Controls Harm US Cyber Defense

URL: https://simonwillison.net/2026/Jun/16/fable-5-export-controls/#atom-everything

Published: 2026-06-16
