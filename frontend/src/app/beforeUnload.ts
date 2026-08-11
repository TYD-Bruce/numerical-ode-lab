import type { AppSessionStore } from "./appSessionStore";

export function createBeforeUnloadHandler(
  store: Pick<AppSessionStore, "hasMeaningfulWork">
): (event: BeforeUnloadEvent) => void {
  return (event: BeforeUnloadEvent): void => {
    if (!store.hasMeaningfulWork()) return;
    event.preventDefault();
    event.returnValue = "";
  };
}
