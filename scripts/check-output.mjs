import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const docsIndex = path.join(root, "docs", "index.html");
const docsLatest = path.join(root, "docs", "latest.html");
const outputsDir = path.join(root, "outputs");

await mustExist(docsIndex);
await mustExist(docsLatest);

const articleDirs = await fs.readdir(outputsDir, { withFileTypes: true });
const datedDirs = articleDirs.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();

if (!datedDirs.length) {
  throw new Error("No generated output directories found.");
}

const latest = datedDirs.at(-1);
const snippetPath = path.join(outputsDir, latest, "article.html");
const snippet = await fs.readFile(snippetPath, "utf8");

if (!snippet.includes('data-role="outer"')) {
  throw new Error("Generated snippet is missing the WeChat outer section.");
}

if (snippet.includes("<html") || snippet.includes("<body") || snippet.includes("<style")) {
  throw new Error("Generated snippet contains full-page tags or style tags.");
}

await mustExist(path.join(root, "docs", "articles", `${latest}.html`));
await mustExist(path.join(root, "docs", "articles", `${latest}.wechat.html`));

console.log(`Output check passed for ${latest}.`);

async function mustExist(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`Missing required file: ${path.relative(root, filePath)}`);
  }
}
