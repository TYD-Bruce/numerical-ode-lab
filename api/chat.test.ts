import { beforeEach, describe, expect, it, vi } from "vitest";

const { handleChatRequest } = vi.hoisted(() => ({
  handleChatRequest: vi.fn(),
}));

vi.mock("@numerical-t-lab/backend/chat-handler", () => ({
  handleChatRequest,
}));

import handler from "./chat";

function responseDouble() {
  const response = {
    setHeader: vi.fn(),
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
}

describe("Vercel chat adapter", () => {
  beforeEach(() => {
    handleChatRequest.mockReset();
  });

  it("preserves the POST-only deployment boundary", async () => {
    const response = responseDouble();

    await handler({ method: "GET" } as never, response as never);

    expect(response.setHeader).toHaveBeenCalledWith("Allow", "POST");
    expect(response.status).toHaveBeenCalledWith(405);
    expect(response.json).toHaveBeenCalledWith({ error: "Method not allowed" });
    expect(handleChatRequest).not.toHaveBeenCalled();
  });

  it("forwards the backend status and body without reinterpretation", async () => {
    const requestBody = { messages: [], context: {} };
    const responseBody = { error: "messages array is required." };
    handleChatRequest.mockResolvedValue({ status: 400, body: responseBody });
    const response = responseDouble();

    await handler(
      { method: "POST", body: requestBody } as never,
      response as never,
    );

    expect(handleChatRequest).toHaveBeenCalledWith(requestBody);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(responseBody);
  });
});
