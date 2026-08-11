export type LoaderAttempt<T> =
  | { status: "idle" }
  | { status: "pending"; promise: Promise<T> }
  | { status: "fulfilled"; promise: Promise<T>; value: T }
  | { status: "rejected"; promise: Promise<T>; error: unknown };

export interface RouteLoader<T> {
  load(): Promise<T>;
  prefetch(): void;
  retry(): Promise<T>;
  evictRejected(): void;
  getAttempt(): LoaderAttempt<T>;
}

export function createRouteLoader<T>(importer: () => Promise<T>): RouteLoader<T> {
  let attempt: LoaderAttempt<T> = { status: "idle" };

  const load = (): Promise<T> => {
    if (attempt.status !== "idle") return attempt.promise;

    let promise: Promise<T>;
    try {
      promise = importer();
    } catch (error) {
      promise = Promise.reject(error);
    }
    attempt = { status: "pending", promise };

    void promise.then(
      (value) => {
        if (attempt.status === "pending" && attempt.promise === promise) {
          attempt = { status: "fulfilled", promise, value };
        }
      },
      (error: unknown) => {
        if (attempt.status === "pending" && attempt.promise === promise) {
          attempt = { status: "rejected", promise, error };
        }
      }
    );

    return promise;
  };

  return {
    load,
    prefetch() {
      void load().catch(() => undefined);
    },
    retry() {
      if (attempt.status === "rejected") attempt = { status: "idle" };
      return load();
    },
    evictRejected() {
      if (attempt.status === "rejected") attempt = { status: "idle" };
    },
    getAttempt() {
      return attempt;
    },
  };
}
