/**
 * Local dev API server — proxies from Vite (/api/chat → http://localhost:3001).
 * Production: Vercel serves api/chat.ts as serverless.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import http from "node:http";

function loadEnvFile(filename: string): void {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");
import {
  handleChatRequest,
  type ChatHandlerBody,
} from "./ai/chatHandler.js";

const PORT = Number(process.env.API_PORT ?? 3001);

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url !== "/api/chat" || req.method !== "POST") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  try {
    const raw = await readBody(req);
    const body = JSON.parse(raw) as ChatHandlerBody;
    const result = await handleChatRequest(body);
    res.writeHead(result.status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result.body));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: msg }));
  }
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `[ode-lab-api] Port ${PORT} is already in use.\n` +
        `  • Another "npm run dev:api" may still be running — close that terminal or stop the process.\n` +
        `  • Windows: netstat -ano | findstr :${PORT}   then   taskkill /PID <pid> /F\n` +
        `  • Or use a different port: set API_PORT=3002 in .env.local and add the same proxy target in vite.config.ts`
    );
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  const mock = process.env.AI_TUTOR_MOCK?.trim().toLowerCase();
  const mockOn =
    mock === "true" || mock === "1" || mock === "yes";
  console.log(`[ode-lab-api] POST http://localhost:${PORT}/api/chat`);
  if (mockOn) {
    console.log("[ode-lab-api] AI_TUTOR_MOCK=true — OpenAI not required");
  }
});
