import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleChatRequest, type ChatHandlerBody } from "./chatHandler.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const result = await handleChatRequest(req.body as ChatHandlerBody);
  res.status(result.status).json(result.body);
}
