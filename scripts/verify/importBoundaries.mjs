import { readFile, readdir } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const sourceRoots = [
  ["frontend", resolve(repoRoot, "frontend/src")],
  ["backend", resolve(repoRoot, "backend/src")],
  ["numerics", resolve(repoRoot, "packages/numerics/src")],
  ["contracts", resolve(repoRoot, "packages/contracts/src")],
];

const importPatterns = [
  /(?:import|export)\s+(?:type\s+)?(?:[^"'`;]*?\s+from\s+)?["']([^"']+)["']/g,
  /import\s*\(\s*["']([^"']+)["']\s*\)/g,
];

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await sourceFiles(path)));
    else if (
      extname(entry.name) === ".ts" &&
      !entry.name.endsWith(".test.ts") &&
      !entry.name.endsWith(".d.ts")
    ) {
      files.push(path);
    }
  }
  return files;
}

function importsFrom(source) {
  const imports = new Set();
  for (const pattern of importPatterns) {
    pattern.lastIndex = 0;
    for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
      imports.add(match[1]);
    }
  }
  return [...imports];
}

function localTarget(file, specifier) {
  if (!specifier.startsWith(".")) return undefined;
  return resolve(dirname(file), specifier);
}

function isWithin(path, directory) {
  const rel = relative(directory, path);
  return rel === "" || (!rel.startsWith(`..${sep}`) && rel !== "..");
}

function forbidden(owner, file, specifier) {
  const target = localTarget(file, specifier);
  const reaches = (directory) => target !== undefined && isWithin(target, resolve(repoRoot, directory));

  if (owner === "numerics") {
    return (
      specifier.startsWith("@numerical-t-lab/frontend") ||
      specifier.startsWith("@numerical-t-lab/backend") ||
      reaches("frontend") ||
      reaches("backend") ||
      reaches("api")
    );
  }
  if (owner === "contracts") {
    return specifier.startsWith("@numerical-t-lab/") || reaches("frontend") || reaches("backend") || reaches("api");
  }
  if (owner === "backend") {
    return (
      specifier.startsWith("@numerical-t-lab/frontend") ||
      specifier.startsWith("@numerical-t-lab/numerics") ||
      reaches("frontend") ||
      reaches("packages/numerics")
    );
  }
  return owner === "frontend" && (specifier.startsWith("@numerical-t-lab/backend") || reaches("backend") || reaches("api"));
}

const violations = [];
for (const [owner, directory] of sourceRoots) {
  for (const file of await sourceFiles(directory)) {
    const source = await readFile(file, "utf8");
    for (const specifier of importsFrom(source)) {
      if (forbidden(owner, file, specifier)) {
        violations.push(`${relative(repoRoot, file)} -> ${specifier}`);
      }
    }
  }
}

const apiAdapter = resolve(repoRoot, "api/chat.ts");
const adapterImports = importsFrom(await readFile(apiAdapter, "utf8"));
if (!adapterImports.includes("@numerical-t-lab/backend/chat-handler")) {
  violations.push("api/chat.ts must delegate to @numerical-t-lab/backend/chat-handler");
}
if (adapterImports.some((specifier) => specifier.startsWith("@numerical-t-lab/frontend"))) {
  violations.push("api/chat.ts must not import frontend implementation");
}

if (violations.length > 0) {
  console.error("Import-boundary violations:\n" + violations.map((item) => `- ${item}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Import boundaries passed (${sourceRoots.length} owners plus the Vercel adapter).`);
}
