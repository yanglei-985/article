让 AI 编程助手真正进入你的工作流之前，最好先问一个问题：如果它误执行了 `git reset --hard`、`rm -rf ./src`，或者删掉数据库，你有刹车吗？

今天 GitHub Trending 上的项目 `destructive_command_guard`，简称 `dcg`，解决的就是这个问题：给 AI coding agent 加一道执行前的安全钩子（hook），在危险命令真正运行之前拦截它。

`dcg` 的定位很明确：它不是另一个代码生成工具，而是一个面向 `Claude Code`、`Codex CLI`、`Gemini CLI`、`GitHub Copilot CLI`、`VS Code Copilot Chat`、`Cursor`、`Hermes Agent`、`Grok` 等工具的“破坏性命令守卫”。当 AI 代理准备执行高风险 shell、git、数据库、云服务或基础设施命令时，`dcg` 会先检查，再决定是否放行。

这类工具开始重要，是因为 AI 编程助手已经从“给建议”进入“替你动手”。过去我们担心的是模型回答错；现在更现实的问题是：它可能在你的真实仓库、真实终端、真实环境里把错变成操作。

原项目给出的典型风险包括：`git reset --hard` 让未提交工作瞬间消失，`rm -rf ./src` 删除源码目录，或者类似 `DROP TABLE users` 的数据库破坏操作。`dcg` 的做法是在命令执行前拦截，给出拒绝原因，并尽量提供更安全的替代建议。

它的几个设计点值得学习。第一，默认零配置保护，安装后即可阻止一批常见危险命令。第二，它支持 50+ security packs，覆盖数据库、Kubernetes、Docker、AWS/GCP/Azure、Terraform 等场景。第三，它强调低延迟，使用 SIMD 加速过滤，目标是不让你明显感到它存在。

更有意思的是上下文判断。项目说明里提到，它不会因为你在 `grep "rm -rf"` 里搜索文本就误拦截，但会阻止真正执行 `rm -rf /`。它还会扫描 heredoc、inline script，例如 `python -c "os.remove(...)"` 这类把危险操作藏在脚本片段里的命令。

安装方面，项目提供了 Linux、macOS、WSL 的 quick install，也提供 Windows 原生 PowerShell 安装方式。Windows 下默认启用 `windows.filesystem` 和 `windows.system` 规则包，因此 `del /s`、`rd /s`、`Remove-Item -Recurse -Force`、`format`、`vssadmin delete shadows` 等命令会被默认拦截。这里要补一句 AI习语 视角：任何 `curl | bash` 或远程 PowerShell 安装，都不建议盲跑。先读脚本、看 release、固定版本、在测试环境验证，是更稳妥的习惯。

这篇内容给我们的启发，不只是“装一个工具”。更重要的是：当 AI 工具获得执行权限时，你的提示词里必须加入操作边界，你的工作流里必须加入自动防线。

一个可直接使用的 AI 编程安全工作流如下：

第一步，所有 AI agent 只在干净分支工作。让它先创建分支，例如 `ai/task-name`，禁止直接在 `main` 或生产分支上操作。

第二步，在提示词里明确三条红线：不要删除文件，除非先列出文件清单并获得确认；不要执行会重写历史或丢弃改动的 git 命令；不要执行数据库、云资源、容器、Kubernetes 的破坏性操作，除非进入单独的确认步骤。

第三步，给本地环境加执行前检查。可以使用 `dcg` 这类 hook，也可以至少配置 git hooks、pre-commit、备份分支和自动 stash。提示词约束靠模型自觉，hook 约束靠系统执行，后者更可靠。

第四步，每次让 AI 执行命令前，要求它先用“计划—命令—风险—回滚”格式输出。你可以直接复制这个提示词：

在执行任何终端命令前，请先输出四项：1. 计划：你要改变什么；2. 命令：逐条列出将执行的命令；3. 风险：哪些命令可能删除文件、重写 git 历史、修改数据库、修改云资源或影响系统配置；4. 回滚：如果结果错误，如何恢复。未经我确认，不要执行高风险命令，包括 rm、mv 覆盖、git reset --hard、git clean、drop、delete、truncate、kubectl delete、docker rm、terraform destroy、云资源删除命令。

如果你正在学英文，这个项目也很适合积累一组高频技术表达：`destructive command` 是破坏性命令，`hook` 是钩子/拦截机制，`intercept before execution` 是执行前拦截，`safer alternatives` 是更安全的替代方案，`fail-open design` 指发生超时或解析错误时不阻断工作流，`machine-readable output` 指机器可读输出。

我建议把今天的文章当作一个信号：AI 编程的下一阶段，不只是模型更强，而是权限更大。权限越大，越需要 guardrail。好提示词能减少误操作，好工作流能限制误操作，而像 `dcg` 这样的执行层防线，能在关键时刻帮你踩下刹车。

来源：GitHub Trending Daily
原文：Dicklesworthstone/destructive_command_guard
链接：https://github.com/Dicklesworthstone/destructive_command_guard
