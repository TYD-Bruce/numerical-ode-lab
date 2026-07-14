import type {
  ModuleTutorSession,
  TutorTranscriptItem,
} from "../app/contracts";

function freezeSession(
  items: readonly TutorTranscriptItem[],
  draftMessage: string,
  desktopOpen: boolean
): ModuleTutorSession {
  return Object.freeze({
    items: Object.freeze([...items]),
    draftMessage,
    desktopOpen,
  });
}

export function createEmptyModuleTutorSession(): ModuleTutorSession {
  return freezeSession([], "", false);
}

export function appendTutorMessage(
  session: ModuleTutorSession,
  role: "user" | "assistant",
  content: string
): ModuleTutorSession {
  const item = Object.freeze({ kind: "message" as const, role, content });
  return freezeSession([...session.items, item], session.draftMessage, session.desktopOpen);
}

export function updateTutorDraft(
  session: ModuleTutorSession,
  draftMessage: string
): ModuleTutorSession {
  if (session.draftMessage === draftMessage) return session;
  return freezeSession(session.items, draftMessage, session.desktopOpen);
}

export function setTutorDesktopOpen(
  session: ModuleTutorSession,
  desktopOpen: boolean
): ModuleTutorSession {
  if (session.desktopOpen === desktopOpen) return session;
  return freezeSession(session.items, session.draftMessage, desktopOpen);
}

export function clearTutorConversation(
  session: ModuleTutorSession
): ModuleTutorSession {
  if (session.items.length === 0 && session.draftMessage === "") return session;
  return freezeSession([], "", session.desktopOpen);
}

export function appendNewExperimentDivider(
  session: ModuleTutorSession,
  divider: { readonly id: string; readonly body: string }
): ModuleTutorSession {
  const item = Object.freeze({
    kind: "divider" as const,
    id: divider.id,
    title: "New experiment started" as const,
    body: divider.body,
  });
  return freezeSession([...session.items, item], session.draftMessage, session.desktopOpen);
}

export function hasUserTutorMessage(session: ModuleTutorSession): boolean {
  return session.items.some((item) => item.kind === "message" && item.role === "user");
}
