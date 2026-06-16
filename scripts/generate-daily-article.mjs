import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const docsDir = path.join(root, "docs");
const outputsDir = path.join(root, "outputs");

const today = getDateStamp();
const runDir = path.join(outputsDir, today);
const articlePagePath = path.join(docsDir, "articles", `${today}.html`);
const snippetPagePath = path.join(docsDir, "articles", `${today}.wechat.html`);

const profile = await readJson("config/profile.json");
const sampleArticles = await readJson("data/sample-articles.json");
const baoyuPrompt = await readText("prompts/baoyu-refined.md");
const stylePrompt = await readText("prompts/ai-gap-style.md");

await fs.mkdir(runDir, { recursive: true });
await fs.mkdir(path.dirname(articlePagePath), { recursive: true });

const candidates = await loadCandidates();
const selected = selectArticle(candidates, profile);
const hasModel = Boolean(process.env.OPENAI_API_KEY);

const generated = hasModel
  ? await generateWithModel(selected, profile, baoyuPrompt, stylePrompt)
  : generateFallback(selected, profile);

const snippet = ensureWechatSnippet(generated.html, selected);
const preview = buildPreviewPage({
  date: today,
  source: selected,
  draft: generated.draft,
  snippet,
  mode: hasModel ? "model" : "fallback"
});

await fs.writeFile(path.join(runDir, "source.json"), `${JSON.stringify(selected, null, 2)}\n`, "utf8");
await fs.writeFile(path.join(runDir, "draft.md"), `${generated.draft.trim()}\n`, "utf8");
await fs.writeFile(path.join(runDir, "article.html"), snippet, "utf8");
await fs.writeFile(articlePagePath, preview, "utf8");
await fs.writeFile(snippetPagePath, snippet, "utf8");
await fs.writeFile(path.join(docsDir, "index.html"), buildIndexPage(today), "utf8");
await fs.writeFile(path.join(docsDir, "latest.html"), buildRedirect(`articles/${today}.html`), "utf8");

console.log(`Generated ${path.relative(root, articlePagePath)}`);
console.log(`Selected: ${selected.title}`);
console.log(`Mode: ${hasModel ? "model" : "fallback"}`);

async function loadCandidates() {
  if (!process.env.SOURCE_API_URL) {
    return normalizeArticles(sampleArticles);
  }

  const headers = { Accept: "application/json" };
  if (process.env.SOURCE_API_KEY) {
    headers.Authorization = `Bearer ${process.env.SOURCE_API_KEY}`;
  }

  const response = await fetch(process.env.SOURCE_API_URL, { headers });
  if (!response.ok) {
    throw new Error(`Source API failed: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  return normalizeArticles(payload);
}

function normalizeArticles(payload) {
  const list = Array.isArray(payload) ? payload : payload.articles ? payload.articles : [payload];
  return list
    .filter(Boolean)
    .map((item, index) => ({
      title: item.title || `Untitled article ${index + 1}`,
      url: item.url || item.link || "",
      source: item.source || item.site || item.author || "Unknown source",
      publishedAt: item.publishedAt || item.published_at || item.date || "",
      summary: item.summary || item.description || "",
      content: item.content || item.body || item.text || item.summary || "",
      tags: Array.isArray(item.tags) ? item.tags : []
    }))
    .filter((item) => item.content || item.summary);
}

function selectArticle(articles, profileConfig) {
  if (!articles.length) {
    throw new Error("No source articles available.");
  }

  const scored = articles.map((article) => ({
    article,
    score: scoreArticle(article, profileConfig)
  }));

  scored.sort((a, b) => b.score - a.score || a.article.title.localeCompare(b.article.title));
  return {
    ...scored[0].article,
    selectionScore: scored[0].score,
    selectedAt: new Date().toISOString()
  };
}

function scoreArticle(article, profileConfig) {
  const haystack = `${article.title} ${article.summary} ${article.content} ${article.tags.join(" ")}`.toLowerCase();
  const positive = profileConfig.positiveKeywords.reduce((sum, keyword) => {
    return sum + (haystack.includes(keyword.toLowerCase()) ? 2 : 0);
  }, 0);
  const negative = profileConfig.negativeKeywords.reduce((sum, keyword) => {
    return sum + (haystack.includes(keyword.toLowerCase()) ? 2 : 0);
  }, 0);
  const lengthBonus = article.content.length > 400 ? 2 : 0;
  const sourceBonus = article.url ? 1 : 0;
  return positive + lengthBonus + sourceBonus - negative;
}

async function generateWithModel(article, profileConfig, translateRules, htmlRules) {
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: "You create accurate Chinese public-account drafts and WeChat-compatible HTML snippets. Return valid JSON only."
        },
        {
          role: "user",
          content: buildModelPrompt(article, profileConfig, translateRules, htmlRules)
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI-compatible API failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const text = payload.choices?.[0]?.message?.content || "";
  const parsed = parseJsonObject(text);
  return {
    draft: parsed.draft || "",
    html: parsed.html || ""
  };
}

function buildModelPrompt(article, profileConfig, translateRules, htmlRules) {
  return `你要为公众号「${profileConfig.brandName}」每天生成一篇可复制到微信公众号的文章。

账号定位：
${profileConfig.positioning}

读者：
${profileConfig.audience}

选题原则：
${profileConfig.selectionPrinciples.map((item) => `- ${item}`).join("\n")}

翻译/改写方法：
${translateRules}

排版方法：
${htmlRules}

今天选中的英文内容：
${JSON.stringify(article, null, 2)}

请完成：
1. 先把原文精翻并改写成中文公众号稿，保留准确事实，加入 AI习语 视角。
2. 文章必须给读者一个可操作方法，例如提示词模式、阅读方法、AI 工作流或英文学习动作。
3. 再将中文稿排成 AI信息Gap 风格的 WeChat HTML snippet。
4. HTML 只能是 snippet，不能包含完整 HTML 文档外壳。
5. 返回 JSON，格式如下：
{
  "draft": "中文 Markdown 草稿",
  "html": "压缩后的公众号 HTML snippet"
}`;
}

function parseJsonObject(text) {
  const clean = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(clean.slice(start, end + 1));
    }
    throw new Error("Model did not return valid JSON.");
  }
}

function generateFallback(article, profileConfig) {
  const englishTerm = "thinking partner";
  const draft = `# ${article.title}

今天这篇内容适合「${profileConfig.brandName}」的原因很直接：它不是让我们把 AI 当成答案机器，而是把 AI 当成一个能陪你拆问题、改提示词、练英文表达的思考伙伴。

原文的核心提醒是：不要一上来就问 AI 要最终答案。更好的做法是，先把你的粗问题丢给模型，让它帮你找隐藏假设，再让它给出几种不同的提问方式。这个过程会直接提升提示效率。

对英文学习者来说，这套方法也很好用。你读一篇英文文章时，不只是让 AI 翻译，而是让它提取表达、解释句子为什么有说服力，再帮你模仿这个句型写出自己的例句。

今天可以试一个小流程：读一段英文，问 AI 三个问题。第一，这段话真正想解决什么问题？第二，里面有哪些值得学的英文表达？第三，我如何把这个表达迁移到自己的工作或学习场景？

这就是 AI习语 想做的事：每天用一篇英文世界的一手内容，同时训练 AI 使用能力、英文输入能力和思考能力。

来源：${article.source}
链接：${article.url || "N/A"}`;

  const paragraphs = [
    "今天这篇文章的重点很简单：不要把 <code>AI</code> 只当答案机器，要把它当成一个能陪你拆问题的 <code>thinking partner</code>。",
    "原文提醒我们，真正有用的提示方式不是直接问“给我答案”，而是先让模型帮你识别隐藏假设，再生成几种不同的问题框架。这个动作会让你的 <code>prompt</code> 更清楚，也会让你的思考更稳定。",
    "对英文学习者来说，这个方法还有第二层价值。读英文内容时，不要只让 <code>AI</code> 翻译全文，可以让它提取高频表达、解释一句话为什么有说服力，再帮你模仿这个句式写自己的例句。",
    "今天可以直接试一个三步流程：先读一段英文，再问 <code>AI</code> 这段话真正解决什么问题，然后让它提取 3 个值得学习的表达，最后把其中一个表达迁移到你的工作或学习场景。",
    "这就是 <code>AI习语</code> 想做的事：每天用一篇英文世界的一手内容，同时训练 <code>AI</code> 使用能力、英文输入能力和思考能力。",
    `来源：${escapeHtml(article.source)}。原文链接：${article.url ? `<code>${escapeHtml(article.url)}</code>` : "暂无"}。`
  ];

  return {
    draft,
    html: makeSnippet(paragraphs)
  };
}

function ensureWechatSnippet(html, article) {
  const trimmed = String(html || "").trim();
  if (trimmed.includes("data-role=\"outer\"") && trimmed.includes("</section>")) {
    return minifySnippet(trimmed);
  }

  return makeSnippet([
    `今天选中的文章是：<code>${escapeHtml(article.title)}</code>。`,
    "模型没有返回合规 HTML，所以系统生成了一个可复制的保底版本。请检查 API 返回格式或 prompt。"
  ]);
}

function makeSnippet(paragraphs) {
  const pStyle = "text-align:left;color:#4a4a4a;font-size:16px;line-height:1.8em;letter-spacing:0.02em;text-indent:0;margin:0;padding:20px 0 8px;";
  const divider = '<p><br></p><hr style="margin:10px 0;padding:0;border:none;background:linear-gradient(90deg,rgba(60,112,198,0) 0%,rgba(60,122,198,0.75) 50%,rgba(60,122,198,0) 100%);height:1px;box-sizing:border-box;"><p><br></p>';
  const body = paragraphs
    .map((paragraph, index) => `<p style="${pStyle}">${paragraph}</p>${index === 1 || index === 3 ? divider : ""}`)
    .join("");
  const bio = '<blockquote style="margin:20px 0;padding:10px 10px 10px 20px;background:#efefef;border:none;display:block;overflow:auto;box-sizing:border-box;"><p style="text-align:left;text-indent:0;padding:20px 0 8px;color:#595959;font-size:14px;line-height:1.8em;font-weight:normal;margin:0;">我是杨磊，AI习语作者，长期关注 AI 工具、提示效率、英文输入和思维升级。</p><p style="text-align:left;text-indent:0;padding:20px 0 8px;color:#595959;font-size:14px;line-height:1.8em;font-weight:normal;margin:0;">关注「AI习语」，每天用一篇英文世界的一手内容，训练 AI 能力和语言能力。</p></blockquote>';
  return minifySnippet(`<section data-role="outer" label="edit by 135editor" style="margin:0;padding:0 10px;background:none;font-size:16px;color:#000;line-height:1.5em;word-spacing:0;letter-spacing:0;word-break:break-word;overflow-wrap:break-word;text-align:left;box-sizing:border-box;font-family:Optima,PingFangSC-regular,serif;">${body}${divider}${bio}</section>`);
}

function buildPreviewPage({ date, source, draft, snippet, mode }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AI习语日报 - ${date}</title>
  <style>
    :root { color-scheme: light; --blue:#3c70c6; --ink:#20242a; --muted:#606975; --line:#dfe5ee; --bg:#f6f8fb; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ink); background: var(--bg); }
    .shell { max-width: 1100px; margin: 0 auto; padding: 28px 18px 48px; }
    .topbar { display: flex; gap: 16px; align-items: center; justify-content: space-between; margin-bottom: 18px; }
    .brand { min-width: 0; }
    .eyebrow { margin: 0 0 4px; color: var(--blue); font-size: 13px; font-weight: 700; letter-spacing: .04em; }
    h1 { margin: 0; font-size: clamp(24px, 4vw, 38px); line-height: 1.12; letter-spacing: 0; }
    .meta { margin: 10px 0 0; color: var(--muted); font-size: 14px; line-height: 1.6; }
    .actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
    button, a.button { appearance: none; border: 1px solid var(--line); background: #fff; color: var(--ink); border-radius: 8px; padding: 10px 14px; font-size: 14px; text-decoration: none; cursor: pointer; }
    button.primary { background: var(--blue); border-color: var(--blue); color: white; }
    .layout { display: grid; grid-template-columns: minmax(0, 1fr) 330px; gap: 18px; align-items: start; }
    .panel { background: white; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
    .panel-title { margin: 0; padding: 14px 16px; border-bottom: 1px solid var(--line); font-size: 15px; }
    .wechat-preview { padding: 18px 12px; background: #fff; }
    .side { display: grid; gap: 18px; }
    .box { padding: 16px; }
    .box p { margin: 0 0 10px; color: var(--muted); font-size: 14px; line-height: 1.6; }
    .box code { word-break: break-all; color: var(--blue); }
    textarea { width: 100%; height: 360px; border: 0; border-top: 1px solid var(--line); padding: 14px; resize: vertical; font: 12px/1.5 ui-monospace, SFMono-Regular, Consolas, monospace; color: #334; }
    pre { white-space: pre-wrap; word-break: break-word; margin: 0; padding: 14px; font-size: 13px; line-height: 1.6; color: #394150; }
    @media (max-width: 860px) { .layout { grid-template-columns: 1fr; } .topbar { align-items: flex-start; flex-direction: column; } .actions { justify-content: flex-start; } }
  </style>
</head>
<body>
  <main class="shell">
    <section class="topbar">
      <div class="brand">
        <p class="eyebrow">AI习语 · ${date}</p>
        <h1>${escapeHtml(source.title)}</h1>
        <p class="meta">来源：${escapeHtml(source.source)} · 生成模式：${mode === "model" ? "AI 精翻 + 排版" : "示例保底模式"}</p>
      </div>
      <div class="actions">
        <button class="primary" id="copyHtml">复制公众号 HTML</button>
        <a class="button" href="${date}.wechat.html">打开纯 HTML</a>
      </div>
    </section>
    <section class="layout">
      <article class="panel">
        <p class="panel-title">公众号预览</p>
        <div class="wechat-preview">${snippet}</div>
      </article>
      <aside class="side">
        <section class="panel box">
          <p class="panel-title" style="margin:-16px -16px 14px;">原文信息</p>
          <p><strong>Score:</strong> ${source.selectionScore ?? "N/A"}</p>
          <p><strong>URL:</strong> ${source.url ? `<a href="${escapeAttribute(source.url)}">${escapeHtml(source.url)}</a>` : "N/A"}</p>
          <p><strong>摘要:</strong> ${escapeHtml(source.summary || "N/A")}</p>
        </section>
        <section class="panel">
          <p class="panel-title">复制区</p>
          <textarea id="htmlSource" spellcheck="false">${escapeHtml(snippet)}</textarea>
        </section>
        <section class="panel">
          <p class="panel-title">中文草稿</p>
          <pre>${escapeHtml(draft)}</pre>
        </section>
      </aside>
    </section>
  </main>
  <script>
    document.getElementById("copyHtml").addEventListener("click", async () => {
      const value = document.getElementById("htmlSource").value;
      await navigator.clipboard.writeText(value);
      const button = document.getElementById("copyHtml");
      button.textContent = "已复制";
      setTimeout(() => button.textContent = "复制公众号 HTML", 1800);
    });
  </script>
</body>
</html>
`;
}

function buildIndexPage(date) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=articles/${date}.html">
  <title>AI习语日报</title>
</head>
<body>
  <p><a href="articles/${date}.html">打开今天的 AI习语日报</a></p>
</body>
</html>
`;
}

function buildRedirect(target) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0; url=${target}"><title>Latest Article</title></head><body><p><a href="${target}">Open latest article</a></p></body></html>`;
}

async function readJson(relativePath) {
  return JSON.parse(await readText(relativePath));
}

async function readText(relativePath) {
  return fs.readFile(path.join(root, relativePath), "utf8");
}

function getDateStamp() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  return formatter.format(new Date());
}

function minifySnippet(html) {
  return html.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#96;");
}
