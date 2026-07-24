import { describe, expect, it, vi } from "vitest";
import { createGlossarySurfaceLoader } from "./glossarySurfaceLoader";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (cause: unknown) => void;
  const promise = new Promise<T>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}

describe("Glossary surface loader", () => {
  it("shares one pending attempt and reuses its fulfilled module", async () => {
    const pending = deferred<{ name: string }>();
    const importer = vi.fn(() => pending.promise);
    const loader = createGlossarySurfaceLoader(importer);
    const mounted: string[] = [];
    const first = loader.load({
      generation: 1,
      isCurrent: () => true,
      mount: (module) => mounted.push(`first:${module.name}`),
    });
    const second = loader.load({
      generation: 2,
      isCurrent: () => true,
      mount: (module) => mounted.push(`second:${module.name}`),
    });
    pending.resolve({ name: "surface" });

    await expect(first).resolves.toBe("mounted");
    await expect(second).resolves.toBe("mounted");
    await loader.load({
      generation: 3,
      isCurrent: () => true,
      mount: (module) => mounted.push(`third:${module.name}`),
    });

    expect(importer).toHaveBeenCalledOnce();
    expect(mounted).toEqual([
      "first:surface",
      "second:surface",
      "third:surface",
    ]);
  });

  it("evicts only a rejected attempt for Retry", async () => {
    const importer = vi
      .fn<() => Promise<{ name: string }>>()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({ name: "recovered" });
    const loader = createGlossarySurfaceLoader(importer);
    const request = {
      generation: 1,
      isCurrent: () => true,
      mount: vi.fn(),
    };

    await expect(loader.load(request)).rejects.toThrow("offline");
    await expect(loader.retry(request)).resolves.toBe("mounted");
    await expect(loader.retry(request)).resolves.toBe("mounted");

    expect(importer).toHaveBeenCalledTimes(2);
  });

  it("does not mount a fulfilled stale generation", async () => {
    const pending = deferred<{ name: string }>();
    const mount = vi.fn();
    let currentGeneration = 1;
    const loader = createGlossarySurfaceLoader(() => pending.promise);
    const loading = loader.load({
      generation: 1,
      isCurrent: (generation) => generation === currentGeneration,
      mount,
    });
    currentGeneration = 2;
    pending.resolve({ name: "late" });

    await expect(loading).resolves.toBe("stale");
    expect(mount).not.toHaveBeenCalled();
  });
});
