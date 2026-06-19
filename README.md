# Article

Daily article generator for the **AI习语** public account.

Every run creates:

- `docs/index.html`: the latest web preview with a copy button
- `docs/latest.html`: a redirect to the latest article page
- `docs/articles/YYYY-MM-DD.html`: readable preview page
- `outputs/YYYY-MM-DD/article.html`: WeChat-ready HTML snippet
- `outputs/YYYY-MM-DD/draft.md`: Chinese draft
- `outputs/YYYY-MM-DD/source.json`: selected source article metadata

## Daily Flow

```text
RSS sources / Source API
→ score and select one article for AI习语
→ refined translation and rewrite
→ AI信息Gap-style WeChat HTML
→ static webpage preview
→ GitHub Pages deployment
```

## Feed One Link

Open:

```text
https://yanglei-985.github.io/article/submit.html
```

Paste an article URL and submit. The page opens a prefilled GitHub Issue. After you create the issue, `Process Submitted Link` runs in GitHub Actions:

```text
Issue URL
→ fetch article page
→ refined translation and rewrite
→ AI信息Gap-style WeChat HTML
→ GitHub Pages deployment
→ reply to the issue with the article URL
```

For safety, the issue-triggered workflow only processes requests opened by `yanglei-985`.

## GitHub Secrets

Required for real daily generation:

- `OPENAI_API_KEY`: API key for an OpenAI-compatible chat completions endpoint

Optional:

- `OPENAI_BASE_URL`: defaults to `https://api.openai.com/v1`
- `OPENAI_MODEL`: defaults to `gpt-4.1-mini`
- `SOURCE_API_URL`: an endpoint returning one article or a list of candidate articles. If omitted, the generator reads RSS feeds from `config/sources.json`.
- `SOURCE_API_KEY`: sent as `Authorization: Bearer ...` when present

The source endpoint may return either:

```json
{
  "articles": [
    {
      "title": "Example",
      "url": "https://example.com/post",
      "source": "Example Blog",
      "publishedAt": "2026-06-16",
      "summary": "Short summary",
      "content": "Full article text or extracted body",
      "tags": ["AI", "language learning"]
    }
  ]
}
```

or a single article object with the same fields.

## Local Run

```powershell
npm run generate
npm run check
```

Open `docs/index.html` after generation.
