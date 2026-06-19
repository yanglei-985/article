export default {
  async fetch(request, env) {
    const corsHeaders = buildCorsHeaders(env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed." }, 405, corsHeaders);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON body." }, 400, corsHeaders);
    }

    const accountUser = String(payload.accountUser || "").trim();
    const accountPassword = String(payload.accountPassword || "");
    if (accountUser !== env.FEED_USER || accountPassword !== env.FEED_PASSWORD) {
      return json({ ok: false, error: "账号或密码不正确。" }, 401, corsHeaders);
    }

    let articleUrl;
    try {
      articleUrl = new URL(String(payload.articleUrl || "").trim());
    } catch {
      return json({ ok: false, error: "请输入有效链接。" }, 400, corsHeaders);
    }

    if (!["http:", "https:"].includes(articleUrl.protocol)) {
      return json({ ok: false, error: "只支持 http 或 https 链接。" }, 400, corsHeaders);
    }

    const owner = env.GITHUB_OWNER || "yanglei-985";
    const repo = env.GITHUB_REPO || "article";
    const workflow = env.GITHUB_WORKFLOW || "process-link.yml";
    const ref = env.GITHUB_REF || "main";
    const requestId = slugify(payload.requestId || `manual-${Date.now()}-${articleUrl.hostname}`);
    const pagesBaseUrl = (env.PAGES_BASE_URL || "https://yanglei-985.github.io/article").replace(/\/$/, "");

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "ai-xiyu-submit-worker",
        "X-GitHub-Api-Version": "2022-11-28"
      },
      body: JSON.stringify({
        ref,
        inputs: {
          article_url: articleUrl.toString(),
          request_id: requestId
        }
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      return json({ ok: false, error: `GitHub Actions 触发失败：${detail.slice(0, 240)}` }, 502, corsHeaders);
    }

    const articleKey = `${dateStamp()}-${requestId}`;
    return json({
      ok: true,
      requestId,
      articleUrl: `${pagesBaseUrl}/articles/${articleKey}.html`,
      snippetUrl: `${pagesBaseUrl}/articles/${articleKey}.wechat.html`
    }, 202, corsHeaders);
  }
};

function buildCorsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "https://yanglei-985.github.io",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    Vary: "Origin"
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), { status, headers });
}

function dateStamp() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96) || "manual-link";
}
