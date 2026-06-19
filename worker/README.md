# Direct submit backend

This Worker lets `docs/submit.html` trigger GitHub Actions without exposing a GitHub token in the public page.

Required Worker environment variables:

- `FEED_USER`
- `FEED_PASSWORD`
- `GITHUB_TOKEN`
- `GITHUB_OWNER` default: `yanglei-985`
- `GITHUB_REPO` default: `article`
- `GITHUB_WORKFLOW` default: `process-link.yml`
- `PAGES_BASE_URL` default: `https://yanglei-985.github.io/article`
- `ALLOWED_ORIGIN` default: `https://yanglei-985.github.io`

After deployment, set the Worker URL in `docs/submit-config.js`:

```js
window.ARTICLE_SUBMIT_ENDPOINT = "https://your-worker.example.workers.dev";
```
