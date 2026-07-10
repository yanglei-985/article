今天这篇不是普通的求职工具推荐，而是一个很值得拆解的 AI 工作流样本：把找工作这件事，从“看到岗位—焦虑—改简历—写求职信”改造成一条可复用的自动化流水线。

GitHub Trending Daily 上的开源项目 MadsLorentzen/ai-job-search，是一个基于 Claude Code 的 AI 求职申请框架。它的思路很直接：你 fork 项目，填入自己的职业资料，然后让 Claude 帮你评估岗位匹配度、定制简历、写 cover letter，并准备面试。

项目作者特别说明：这是独立开源项目，不隶属于 Anthropic，也没有得到 Anthropic 的赞助或维护。这里提到 Claude Code，只是因为这套工作流使用了它作为工具链。

这套项目真正有价值的地方，不是“AI 帮你写求职信”这么简单，而是它把求职拆成了三个阶段：/setup、/scrape、/apply。

/setup 是自我建档。你可以让 Claude Code 读取 documents 文件夹里的材料，比如 CV PDF、LinkedIn 导出、学历证明、推荐信、过去的申请材料；也可以直接粘贴一份简历；或者让 AI 像面试官一样一步步追问，帮你建立职业画像。

/scrape 是岗位搜索。项目内置的岗位门户主要面向丹麦市场，比如 Jobindex、Jobnet、Akademikernes Jobbank 等，也包括 LinkedIn 搜索工具。不过作者强调，核心流程是语言和国家无关的，本地岗位站点可以替换。

/apply 是申请生成。AI 会读取岗位链接，评估岗位与个人背景的匹配度，然后生成定制版 CV 和 cover letter。框架里还设计了 drafter-reviewer pipeline：先由起草代理生成版本，再由 reviewer agent 批评、修改，最后输出更稳的申请材料。

这对 AI习语读者的启发是：不要只把 AI 当成“帮我写一封求职信”的文本工具，而要把它当成一个可审计、可复用、可迭代的职业决策系统。

你可以把这套方法迁移到中文求职场景，不一定非要安装完整项目。核心是建立四个文件：Profile、Target Roles、Evidence Bank、Application Log。

Profile 记录你的职业画像：经历、技能、项目、行业、偏好、限制条件。Target Roles 记录你要投的岗位类型。Evidence Bank 记录可证明你能力的事实素材，比如数据、项目结果、英文表达、领导力案例。Application Log 记录每个岗位的 JD、匹配分、修改过的简历版本、面试反馈。

一个可直接使用的提示词模式是：

你是我的求职策略顾问和英文写作教练。请基于我的 Profile、Evidence Bank 和岗位 JD，完成四步：1. 用 0-100 分评估岗位匹配度，并说明加分项与风险项；2. 提取 JD 中最重要的 8 个关键词，区分硬技能、软技能和行业语境；3. 重写我的简历要点，要求更贴近岗位语言，但不得虚构经历；4. 生成一封 forward-looking cover letter，重点写我入职后能解决什么问题，而不是重复简历。

这里有一个英文学习动作也很值得做：每次分析 JD 时，不要只看中文意思，要建立自己的 Job Description Vocabulary。比如 fit evaluation、tailored CV、cover letter、ATS parseability、salary benchmarking、reviewer agent、forward-looking framing。这些词本身就是职场英语输入材料。

尤其是 cover letter。很多人写求职信时只会回顾过去：我做过什么，我有什么经验。但这个项目提到 forward-looking cover letter framing，也就是面向未来的求职信框架：少一点自我介绍，多一点“我能为这个岗位解决什么问题”。这是很实用的表达升级。

如果你想进一步自动化，可以参考该项目的技术栈：Claude Code CLI、Python 3.10+、Bun、LaTeX，以及可选的 pdftotext。项目还会检查 CV 的 ATS parseability，也就是简历是否容易被招聘系统解析。即使你不用 LaTeX，也应该养成一个原则：简历格式越花哨，机器越可能读不懂。

今天的实践建议：选一个你真的感兴趣的岗位，把 JD 复制下来，用上面的四步提示词跑一遍。不要急着投递，先让 AI 给你做一次 fit evaluation。你会更清楚：这个岗位是真的适合你，还是只是标题看起来诱人。

来源：GitHub Trending Daily
原文：MadsLorentzen/ai-job-search
链接：https://github.com/MadsLorentzen/ai-job-search
