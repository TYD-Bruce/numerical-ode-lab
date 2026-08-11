export interface GlossarySurfaceLoadRequest<TModule> {
  readonly generation: number;
  readonly isCurrent: (generation: number) => boolean;
  readonly mount: (module: TModule) => void;
}

export type GlossarySurfaceLoadResult = "mounted" | "stale";

export interface GlossarySurfaceLoader<TModule> {
  load(
    request: GlossarySurfaceLoadRequest<TModule>
  ): Promise<GlossarySurfaceLoadResult>;
  retry(
    request: GlossarySurfaceLoadRequest<TModule>
  ): Promise<GlossarySurfaceLoadResult>;
}

export function createGlossarySurfaceLoader<TModule>(
  importer: () => Promise<TModule>
): GlossarySurfaceLoader<TModule> {
  let attempt: Promise<TModule> | undefined;
  let rejected = false;

  const getAttempt = (): Promise<TModule> => {
    if (attempt) return attempt;
    rejected = false;
    let current: Promise<TModule>;
    current = importer().catch((cause) => {
      if (attempt === current) rejected = true;
      throw cause;
    });
    attempt = current;
    return attempt;
  };

  const load = async (
    request: GlossarySurfaceLoadRequest<TModule>
  ): Promise<GlossarySurfaceLoadResult> => {
    const module = await getAttempt();
    if (!request.isCurrent(request.generation)) return "stale";
    request.mount(module);
    return "mounted";
  };

  return Object.freeze({
    load,
    retry(
      request: GlossarySurfaceLoadRequest<TModule>
    ): Promise<GlossarySurfaceLoadResult> {
      if (rejected) {
        attempt = undefined;
        rejected = false;
      }
      return load(request);
    },
  });
}
