import { describe, expect, it, vi } from "vitest";
import { createRouteLoader } from "./routeLoader";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
}

describe("route loader", () => {
  it("shares one pending promise between prefetch and navigation", async () => {
    const attempt = deferred<string>();
    const importer = vi.fn(() => attempt.promise);
    const loader = createRouteLoader(importer);

    loader.prefetch();
    const navigation = loader.load();

    expect(importer).toHaveBeenCalledTimes(1);
    expect(loader.getAttempt().status).toBe("pending");

    attempt.resolve("loaded");
    await expect(navigation).resolves.toBe("loaded");
    expect(loader.getAttempt()).toMatchObject({
      status: "fulfilled",
      value: "loaded",
    });
    await expect(loader.load()).resolves.toBe("loaded");
    expect(importer).toHaveBeenCalledTimes(1);
  });

  it("catches prefetch rejection while navigation still observes it", async () => {
    const failure = new Error("chunk unavailable");
    const importer = vi.fn(() => Promise.reject(failure));
    const loader = createRouteLoader(importer);

    loader.prefetch();
    await vi.waitFor(() => expect(loader.getAttempt().status).toBe("rejected"));

    await expect(loader.load()).rejects.toBe(failure);
    expect(importer).toHaveBeenCalledTimes(1);
  });

  it("evicts only a rejected attempt for Retry", async () => {
    const importer = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("first"))
      .mockResolvedValueOnce("second");
    const loader = createRouteLoader(importer);

    await expect(loader.load()).rejects.toThrow("first");
    await expect(loader.retry()).resolves.toBe("second");
    await expect(loader.retry()).resolves.toBe("second");
    expect(importer).toHaveBeenCalledTimes(2);
  });

  it("does not cancel or duplicate work when hover intent ends", async () => {
    const attempt = deferred<string>();
    const importer = vi.fn(() => attempt.promise);
    const loader = createRouteLoader(importer);

    loader.prefetch();
    loader.prefetch();
    attempt.resolve("done");

    await expect(loader.load()).resolves.toBe("done");
    expect(importer).toHaveBeenCalledTimes(1);
  });
});
