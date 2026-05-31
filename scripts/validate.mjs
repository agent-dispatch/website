import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = resolve(repoRoot, "src");
const indexPath = resolve(srcDir, "index.html");
const requiredSections = [
  "top",
  "why",
  "install"
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
const socialPreviewDimensions = await readPngDimensions(socialPreviewPath);
if (socialPreviewDimensions.width !== 1280 || socialPreviewDimensions.height !== 640) {
  throw new Error(
    `Social preview image must be 1280x640; got ${socialPreviewDimensions.width}x${socialPreviewDimensions.height}.`
  );
}

const orgLogoPath = resolve(srcDir, "assets", "org-logo.svg");
if (!existsSync(orgLogoPath)) {
  throw new Error("Missing required organization logo: src/assets/org-logo.svg");
}

for (const placeholder of ["TODO", "lorem", "ipsum", "undefined"]) {
  if (index.toLowerCase().includes(placeholder.toLowerCase())) {
    throw new Error(`Found placeholder text: ${placeholder}`);
  }
}

for (const expected of [
  "docs",
  "live-aws-verification.md",
  "spawn_cloud_agent",
  "@agent-dispatch/mcp-server",
  "Live AWS dispatch remains opt-in"
]) {
  if (!index.includes(expected)) {
    throw new Error(`Missing required website copy: ${expected}`);
  }
}

for (const match of index.matchAll(/(?:href|src)="([^"]+)"/g)) {
  const target = match[1];
  if (target.startsWith("http") || target.startsWith("#") || target.startsWith("mailto:")) continue;
  const localTarget = target.split(/[?#]/, 1)[0];
  const localPath = resolve(dirname(indexPath), localTarget);
  if (!existsSync(localPath)) {
    throw new Error(`Broken local asset reference: ${target}`);
  }
}

const css = await readFile(resolve(srcDir, "styles.css"), "utf8");
if (!css.includes("@media") || !css.includes(":root")) {
  throw new Error("CSS must include responsive rules and root design tokens.");
}
if (/letter-spacing:\s*-[0-9.]/.test(css)) {
  throw new Error("CSS must not use negative letter spacing.");
}
if (/font-size:\s*[^;]*vw/.test(css)) {
  throw new Error("CSS must not scale font size directly with viewport width.");
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

async function readPngDimensions(path) {
  const bytes = await readFile(path);
  const signature = bytes.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") {
    throw new Error(`${path} is not a PNG file`);
  }

  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20)
  };
}
