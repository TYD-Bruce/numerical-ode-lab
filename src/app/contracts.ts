export type RouteId =
  | "home"
  | "ode-overview"
  | "ode-initial-value-problems"
  | "linear-algebra-overview"
  | "pde-overview"
  | "about"
  | "not-found";

export interface NavigateOptions {
  replace?: boolean;
  scroll?: "auto" | "top" | "preserve";
}

export type Navigate = (
  path: string,
  options?: NavigateOptions
) => Promise<void>;

export interface RouteLocation {
  pathname: string;
  search: string;
  hash: string;
}

export interface MountedRoute {
  ready?: Promise<void>;
  dispose(): void;
}

export interface RouteModule {
  mount(options: {
    target: HTMLElement;
    navigate: Navigate;
    location: RouteLocation;
  }): MountedRoute;
}
