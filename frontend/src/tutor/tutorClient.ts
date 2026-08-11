import type { ChatRequest, ChatResponse } from "@numerical-t-lab/contracts/tutor";

export const PUBLIC_TUTOR_UNAVAILABLE_MESSAGE =
  "AI Tutor is temporarily unavailable. Please try again later.";

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
    throw new Error(PUBLIC_TUTOR_UNAVAILABLE_MESSAGE);
  }
  if (typeof data.message !== "string") {
    throw new Error("Invalid response from tutor API.");
  }
  return data;
}
