import type { ChatRequest, ChatResponse } from "../aiTypes";

export async function sendTutorMessage(
  request: ChatRequest,
  signal?: AbortSignal
): Promise<ChatResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });
  const data = (await response.json()) as ChatResponse & { error?: string };
  if (!response.ok) {
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : `Chat request failed (${response.status})`
    );
  }
  if (typeof data.message !== "string") {
    throw new Error("Invalid response from tutor API.");
  }
  return data;
}
