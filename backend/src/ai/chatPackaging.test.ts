import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import ts from "typescript";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const apiEntry = resolve(repoRoot, "api/chat.ts");
const backendHandler = resolve(repoRoot, "backend/src/ai/chatHandler.ts");
const expectedHandlerSpecifier = "../backend/src/ai/chatHandler.js";
const temporaryPackages: string[] = [];

function transpile(sourcePath: string): string {
  return ts.transpileModule(readFileSync(sourcePath, "utf8"), {
    fileName: sourcePath,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
    },
  }).outputText;
}

function writePackageFile(
  packageRoot: string,
  relativePath: string,
  contents: string,
): void {
  const outputPath = join(packageRoot, relativePath);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, contents, "utf8");
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const packageRoot of temporaryPackages.splice(0)) {
    rmSync(packageRoot, { recursive: true, force: true });
  }
});

describe("Vercel chat function packaging contract", () => {
  it("keeps one thin adapter with one statically traceable backend owner", () => {
    const source = readFileSync(apiEntry, "utf8");

    expect(source).toContain(`from "${expectedHandlerSpecifier}"`);
    expect(source).not.toContain("@numerical-t-lab/backend");
    expect(source.match(/handleChatRequest/g)).toHaveLength(2);
    expect(source).not.toContain("SYSTEM_PROMPT");
    expect(source).not.toContain("OPENAI_API_KEY");
  });

  it("does not expose test files as Vercel functions", () => {
    const apiSources = readdirSync(resolve(repoRoot, "api"))
      .filter((name) => name.endsWith(".ts"))
      .sort();

    expect(apiSources).toEqual(["chat.ts"]);
  });

  it("loads the locally emitted function package and reaches validation", async () => {
    const packageRoot = mkdtempSync(join(tmpdir(), "ntl-chat-function-"));
    temporaryPackages.push(packageRoot);
    writePackageFile(packageRoot, "package.json", '{"type":"module"}\n');
    writePackageFile(packageRoot, "api/chat.js", transpile(apiEntry));
    writePackageFile(
      packageRoot,
      "backend/src/ai/chatHandler.js",
      transpile(backendHandler),
    );

    const emittedAdapter = readFileSync(join(packageRoot, "api/chat.js"), "utf8");
    const emittedHandler = join(
      packageRoot,
      "backend/src/ai/chatHandler.js",
    );
    const unavailableWorkspaceSource = join(
      packageRoot,
      "node_modules/@numerical-t-lab/backend/src/ai/chatHandler.ts",
    );

    expect(emittedAdapter).toContain(`from "${expectedHandlerSpecifier}"`);
    expect(emittedAdapter).not.toContain("@numerical-t-lab/backend");
    expect(existsSync(emittedHandler)).toBe(true);
    expect(existsSync(unavailableWorkspaceSource)).toBe(false);

    const module = (await import(
      `${pathToFileURL(join(packageRoot, "api/chat.js")).href}?test=${Date.now()}`
    )) as { default: (request: unknown, response: unknown) => Promise<void> };
    const response = {
      setHeader: vi.fn(),
      status: vi.fn(),
      json: vi.fn(),
    };
    response.status.mockReturnValue(response);

    await module.default({ method: "POST", body: {} }, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: "messages array is required.",
    });
  });
});
