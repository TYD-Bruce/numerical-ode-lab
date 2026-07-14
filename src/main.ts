import {
  createCurrentCompatibilitySession,
  mount,
} from "./ode/initialValueProblemsRoute";
import { createAppSessionStore } from "./app/appSessionStore";
import { createPlatformTutorHost } from "./app/platformTutorHost";

const target = document.querySelector<HTMLElement>("#app");
if (!target) throw new Error("The application root #app is missing.");

const layout = document.createElement("div");
layout.className = "compatibility-tutor-layout";
const labRegion = document.createElement("div");
labRegion.className = "compatibility-lab-region";
const tutorRegion = document.createElement("div");
tutorRegion.className = "compatibility-tutor-region";
layout.append(labRegion, tutorRegion);
target.replaceChildren(layout);

const store = createAppSessionStore();
const mounted = mount({
  target: labRegion,
  session: createCurrentCompatibilitySession(),
  navigate: () => undefined,
  lifecycle: {
    updateSession: (session, metadata) => store.setLab("ode", session, metadata),
  },
});
const tutorHost = createPlatformTutorHost({
  target: tutorRegion,
  labTarget: labRegion,
});
tutorHost.connect(
  mounted.getTutorBinding(),
  store.createTutorSessionAccess("ode")
);

const dispose = (): void => {
  tutorHost.close({ restoreFocus: false });
  tutorHost.disconnect();
  mounted.dispose();
  tutorHost.dispose();
  target.replaceChildren();
};

if (import.meta.hot) {
  import.meta.hot.dispose(dispose);
}
