import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = resolve(repoRoot, "src");
const indexPath = resolve(srcDir, "index.html");
const requiredSections = [
  "hero",
  "how-it-works",
  "packages",
  "agentcore",
  "quickstart",
  "roadmap"
];

const index = await readFile(indexPath, "utf8");
for (const section of requiredSections) {
  if (!index.includes(`id="${section}"`)) {
    throw new Error(`Missing required section #${section}`);
  }
}

const requiredMeta = [
  'property="og:title"',
  'property="og:description"',
  'property="og:image"',
  'property="og:image:width" content="1280"',
  'property="og:image:height" content="640"',
  'name="twitter:card" content="summary_large_image"',
  'name="twitter:image"'
];
for (const meta of requiredMeta) {
  if (!index.includes(meta)) {
    throw new Error(`Missing required social metadata: ${meta}`);
  }
}

const socialPreviewPath = resolve(srcDir, "assets", "repo-social-preview.png");
if (!existsSync(socialPreviewPath)) {
  throw new Error("Missing required social preview image: src/assets/repo-social-preview.png");
}

for (const placeholder of ["TODO", "lorem", "ipsum", "undefined"]) {
  if (index.toLowerCase().includes(placeholder.toLowerCase())) {
    throw new Error(`Found placeholder text: ${placeholder}`);
  }
}

for (const match of index.matchAll(/(?:href|src)="([^"]+)"/g)) {
  const target = match[1];
  if (target.startsWith("http") || target.startsWith("#") || target.startsWith("mailto:")) continue;
  const localPath = resolve(dirname(indexPath), target);
  if (!existsSync(localPath)) {
    throw new Error(`Broken local asset reference: ${target}`);
  }
}

const css = await readFile(resolve(srcDir, "styles.css"), "utf8");
if (!css.includes("@media") || !css.includes(":root")) {
  throw new Error("CSS must include responsive rules and root design tokens.");
}

const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir)) {
    const path = resolve(dir, entry);
    const metadata = await stat(path);
    if (metadata.isDirectory()) await walk(path);
    else files.push(path);
  }
}
await walk(srcDir);

console.log(`Validated AgentDispatch website (${files.length} source files).`);
