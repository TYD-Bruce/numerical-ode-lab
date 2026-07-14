import { describe, expect, it } from "vitest";
import {
  appendNewExperimentDivider,
  appendTutorMessage,
  clearTutorConversation,
  createEmptyModuleTutorSession,
  messagesForTutorRequest,
  setTutorDesktopOpen,
  updateTutorDraft,
} from "./moduleTutorSession";

describe("Module Tutor session values", () => {
  it("updates immutable transcript, draft, and desktop preference independently", () => {
    const empty = createEmptyModuleTutorSession();
    const opened = setTutorDesktopOpen(empty, true);
    const drafted = updateTutorDraft(opened, "Explain Euler");
    const messaged = appendTutorMessage(drafted, "user", "Why is it first order?");

    expect(empty).toEqual({ items: [], draftMessage: "", desktopOpen: false });
    expect(messaged.items).toEqual([
      { kind: "message", role: "user", content: "Why is it first order?" },
    ]);
    expect(Object.isFrozen(messaged.items)).toBe(true);
    expect(clearTutorConversation(messaged)).toEqual({
      items: [],
      draftMessage: "",
      desktopOpen: true,
    });
  });

  it("retains dividers for rendering but excludes them from API messages", () => {
    const divided = appendNewExperimentDivider(
      appendTutorMessage(createEmptyModuleTutorSession(), "user", "Old question"),
      { id: "experiment-2", body: "The Lab returned to its starter state." }
    );
    const session = appendTutorMessage(divided, "assistant", "New answer");

    expect(session.items[1]).toMatchObject({
      kind: "divider",
      title: "New experiment started",
    });
    expect(messagesForTutorRequest(session)).toEqual([
      { role: "user", content: "Old question" },
      { role: "assistant", content: "New answer" },
    ]);
  });
});
