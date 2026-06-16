# AI信息Gap Style HTML Article Skill

Output a single self-contained WeChat-compatible HTML snippet.

Visual rules:

- Wrap the entire snippet in:
  `<section data-role="outer" label="edit by 135editor" style="margin:0;padding:0 10px;background:none;font-size:16px;color:#000;line-height:1.5em;word-spacing:0;letter-spacing:0;word-break:break-word;overflow-wrap:break-word;text-align:left;box-sizing:border-box;font-family:Optima,PingFangSC-regular,serif;">...</section>`
- Use only inline styles.
- Do not output `<!DOCTYPE>`, `<html>`, `<head>`, `<body>`, `<style>`, `<h1>`, `<h2>`, `<h3>`, `<ul>`, or `<li>`.
- Use paragraphs for all prose:
  `style="text-align:left;color:#4a4a4a;font-size:16px;line-height:1.8em;letter-spacing:0.02em;text-indent:0;margin:0;padding:20px 0 8px;"`
- Use inline `<code>` labels for model names, product names, English terms, API names, prompt keywords, and technical labels. They are inline keyword labels: blue text, very light gray background, small padding, and a 4px radius. They are not full code blocks and not blue-background blocks:
  `style="color:rgb(60,112,198);font-size:14px;line-height:1.8em;background:rgba(27,31,35,0.05);padding:2px 4px;margin:0 2px;border-radius:4px;font-family:Consolas,Monaco,Menlo,monospace;"`
- Use a spacer and gradient divider between major sections:
  `<p><br></p><hr style="margin:10px 0;padding:0;border:none;background:linear-gradient(90deg,rgba(60,112,198,0) 0%,rgba(60,122,198,0.75) 50%,rgba(60,122,198,0) 100%);height:1px;box-sizing:border-box;"><p><br></p>`
- End with a compact author bio blockquote:
  `我是杨磊，AI习语作者，长期关注 AI 工具、提示效率、英文输入和思维升级。关注「AI习语」，每天用一篇英文世界的一手内容，训练 AI 能力和语言能力。`

Content rhythm:

- First paragraph is a short hook, not a heading.
- Each section is 1 to 3 compact paragraphs.
- Give readers one practical method, prompt pattern, checklist, or learning workflow.
- Keep the source URL and source name in the final section.
- Minify the final snippet by removing newlines and extra whitespace between tags.
