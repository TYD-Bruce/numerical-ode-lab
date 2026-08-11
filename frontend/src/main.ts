import { createPlatformBootstrap } from "./app/platformBootstrap";

const target = document.querySelector<HTMLElement>("#app");
if (!target) throw new Error("The application root #app is missing.");

const platform = createPlatformBootstrap({ target });

if (import.meta.hot) {
  import.meta.hot.dispose(() => platform.dispose());
}
