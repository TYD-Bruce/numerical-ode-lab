// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { installGlossaryDevelopmentControls } from "./glossaryDevelopmentControls";

const PLAYGROUND_PATH = "/__dev/glossary-playground";

function dispatchShortcut(
  target: EventTarget,
  init: KeyboardEventInit = {}
): KeyboardEvent {
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key: "G",
    code: "KeyG",
    ctrlKey: true,
    shiftKey: true,
    ...init,
  });
  target.dispatchEvent(event);
  return event;
}

describe("Glossary development controls", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    history.replaceState({}, "", "/");
  });

  it.each([
    [{ ctrlKey: true, metaKey: false, key: "G" }, "Ctrl+Shift+G"],
    [{ ctrlKey: true, metaKey: false, key: "g" }, "lowercase Ctrl+Shift+G"],
    [{ ctrlKey: false, metaKey: true, key: "G" }, "Command+Shift+G"],
  ])("handles %s", async (eventInit) => {
    const navigate = vi.fn(async () => undefined);
    const cleanup = installGlossaryDevelopmentControls({
      eventTarget: window,
      navigate,
      getPathname: () => location.pathname,
      playgroundPath: PLAYGROUND_PATH,
    });

    const event = dispatchShortcut(window, eventInit);

    expect(event.defaultPrevented).toBe(true);
    expect(navigate).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledWith(PLAYGROUND_PATH);
    cleanup();
  });

  it.each([
    [{ defaultPrevented: true }, "prevented"],
    [{ repeat: true }, "repeat"],
    [{ shiftKey: false }, "missing Shift"],
    [{ ctrlKey: false, metaKey: false }, "missing Ctrl or Meta"],
    [{ ctrlKey: true, metaKey: true }, "ambiguous Ctrl+Meta"],
    [{ altKey: true }, "Alt combination"],
    [{ key: "K", code: "KeyK" }, "unrelated key"],
  ])("ignores a %s event", (eventInit, _label) => {
    const navigate = vi.fn(async () => undefined);
    const cleanup = installGlossaryDevelopmentControls({
      eventTarget: window,
      navigate,
      getPathname: () => location.pathname,
      playgroundPath: PLAYGROUND_PATH,
    });
    let event: KeyboardEvent;
    if ("defaultPrevented" in eventInit) {
      event = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "G",
        code: "KeyG",
        ctrlKey: true,
        shiftKey: true,
      });
      event.preventDefault();
      window.dispatchEvent(event);
    } else {
      event = dispatchShortcut(window, eventInit);
    }

    expect(navigate).not.toHaveBeenCalled();
    if (!("defaultPrevented" in eventInit)) {
      expect(event.defaultPrevented).toBe(false);
    }
    cleanup();
  });

  it.each([
    ["input", "<input>"],
    ["textarea", "<textarea></textarea>"],
    ["select", "<select><option>Fixture</option></select>"],
    ["contenteditable", '<div contenteditable="true"></div>'],
    ["nested contenteditable", '<div contenteditable="true"><span></span></div>'],
    ["math-field", "<math-field></math-field>"],
    ["nested math-field", "<math-field><span></span></math-field>"],
  ])("ignores %s targets", (_label, markup) => {
    document.body.innerHTML = markup;
    const root = document.body.firstElementChild!;
    const target = root.querySelector("span") ?? root;
    const navigate = vi.fn(async () => undefined);
    const cleanup = installGlossaryDevelopmentControls({
      eventTarget: window,
      navigate,
      getPathname: () => location.pathname,
      playgroundPath: PLAYGROUND_PATH,
    });

    const event = dispatchShortcut(target);

    expect(event.defaultPrevented).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
    cleanup();
  });

  it("does not duplicate navigation while already on the Playground", () => {
    history.replaceState({}, "", PLAYGROUND_PATH);
    const navigate = vi.fn(async () => undefined);
    const cleanup = installGlossaryDevelopmentControls({
      eventTarget: window,
      navigate,
      getPathname: () => location.pathname,
      playgroundPath: PLAYGROUND_PATH,
    });

    const event = dispatchShortcut(window);

    expect(event.defaultPrevented).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
    cleanup();
  });

  it("installs one listener and cleans it up idempotently", () => {
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const navigate = vi.fn(async () => undefined);
    const cleanup = installGlossaryDevelopmentControls({
      eventTarget: window,
      navigate,
      getPathname: () => location.pathname,
      playgroundPath: PLAYGROUND_PATH,
    });

    expect(
      add.mock.calls.filter(([type]) => type === "keydown")
    ).toHaveLength(1);
    cleanup();
    cleanup();
    expect(
      remove.mock.calls.filter(([type]) => type === "keydown")
    ).toHaveLength(1);

    dispatchShortcut(window);
    expect(navigate).not.toHaveBeenCalled();
    add.mockRestore();
    remove.mockRestore();
  });
});
