# 让 AI 直接进入剪辑时间线：Palmier Pro 给内容工作流的提示

过去我们常说“用 AI 做视频”，多数时候指的是：先在一个工具里生成片段，再下载、导入、剪辑、改字幕、调节奏。今天这个 GitHub Trending 项目更有意思：它不是又一个生成视频的网站，而是把 AI Agent 接进了视频编辑器的时间线。

Palmier Pro 是一个面向 macOS 的开源视频编辑器，官方定位是“The video editor built for AI”。它要求 macOS 26 Tahoe，并且只支持 Apple Silicon。它从 Swift 原生构建，目标参照 Premiere Pro，但重点不是复刻传统剪辑软件，而是把生成式 AI 和 Agent 协作放进剪辑流程本身。

对 AI习语读者来说，这个项目值得看，不只是因为“AI 视频”很热，而是因为它代表了一个更重要的方向：AI 不再只是聊天窗口里的建议者，而是进入具体工具，理解项目结构，并对真实工作对象执行操作。

Palmier Pro 的核心能力有三层。第一，它本身是一个 Mac 视频编辑器，可以像 CapCut 或 Adobe Premiere 那样使用。第二，它在时间线里集成生成式 AI，可以调用 Seedance、Kling、Nano Banana Pro 等模型生成视频和图片。第三，它通过 MCP 与 Claude、Codex、Cursor 或应用内 Agent 连接，让 Agent 和你一起编辑同一个项目。

这里的关键词是 MCP，也就是 Model Context Protocol。应用打开时，Palmier Pro 会在本地暴露一个 HTTP MCP server，地址是 http://127.0.0.1:19789/mcp。官方给出的连接方式包括：Claude Code 使用 `claude mcp add --transport http palmier-pro http://127.0.0.1:19789/mcp`，Codex 使用 `codex mcp add palmier-pro --url http://127.0.0.1:19789/mcp`，Cursor 可以在应用里的 Help -> MCP Instructions -> Install in Cursor 一键安装，也可以手动写入 ~/.cursor/mcp.json。

这说明一种新工作流正在形成：不是“我问 AI 怎么剪”，而是“我让 AI 读取时间线、理解素材、提出剪辑方案，并在约束内完成一部分编辑动作”。对内容创作者来说，价值不在于完全自动化，而在于把低层重复操作交出去，把人的注意力留给叙事、节奏和判断。

一个可直接使用的提示词模式是：角色 + 项目目标 + 时间线现状 + 操作任务 + 风格约束 + 检查标准。你可以这样写：你是我的短视频剪辑副驾。请先读取当前时间线，识别所有片段的主题、时长和节奏问题。目标是做一条 60 秒以内的英文学习短视频，风格清晰、紧凑、适合公众号和视频号读者。请提出三种剪辑方案，每种说明开头钩子、段落顺序、需要补充的画面或字幕。不要直接删除素材，先给我确认清单。

如果已经确认方案，可以继续用第二段提示：请根据方案二执行初剪。保留核心观点，删除重复停顿，把每个段落控制在 8 到 15 秒。为每个转场添加一句中文解释性字幕，并在关键英文术语旁边保留英文原词。完成后列出你做过的改动、仍不确定的地方、建议我人工复核的时间点。

这个模式的关键不是让 AI“自由发挥”，而是把 Agent 放进一个可审计的协作流程：先观察，再提案，再确认，再执行，再复核。它也适合迁移到写作、翻译、PPT、代码和资料整理场景。只要工具能通过 MCP 暴露上下文，提示词就应该从“请回答”升级成“请读取对象、说明计划、等待确认、执行并回报”。

顺手做一个英文学习动作：把 Palmier Pro 文档里的高频表达记下来。比如 built for AI 不是“为 AI 建造”那么生硬，更自然是“面向 AI 工作流设计”；inside the timeline 是“在时间线内”；exposes an MCP server 是“暴露/提供一个 MCP 服务端”；one click install 是“一键安装”；interact with your timeline editor 是“与你的时间线编辑器交互”。读技术文档时，优先积累这些能直接迁移到产品表达和提示词表达里的短语。

也要注意边界：Palmier Pro 的视频编辑器本体、MCP server 和 Agent chat 是开源的；生成式 AI 处理部分不是开源的。编辑器免费、无需登录即可下载使用，MCP server 也可以免费试验；但生成式 AI 功能需要登录和订阅。平台目前只支持 Apple Silicon 上的 macOS 26 Tahoe。

今天这篇的价值，不是推荐每个人立刻换剪辑软件，而是提醒我们：下一代 AI 工具的竞争点，可能不在“模型回答得多好”，而在“AI 能否进入你的真实工作界面，并按你的规则协作”。会写提示词的人，也要开始学会设计工作流。

来源：GitHub Trending Daily
原文：https://github.com/palmier-io/palmier-pro
