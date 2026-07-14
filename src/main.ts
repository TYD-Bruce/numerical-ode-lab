import {
  createCurrentCompatibilitySession,
  mount,
} from "./ode/initialValueProblemsRoute";

const target = document.querySelector<HTMLElement>("#app");
if (!target) throw new Error("The application root #app is missing.");

const mounted = mount({
  target,
  session: createCurrentCompatibilitySession(),
  navigate: () => undefined,
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => mounted.dispose());
}
