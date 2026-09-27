// @vitest-environment node
import { promises as fs } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getAllWritingEntries } from "@/lib/content/loaders";

function fsError(code: string): NodeJS.ErrnoException {
  return Object.assign(new Error(`${code}: scandir`), { code });
}

afterEach(() => vi.restoreAllMocks());

describe("content collection loading", () => {
  it("treats a collection directory missing from the deployment as empty", async () => {
    // Deployed functions only contain traced content files, so an empty collection has no directory.
    vi.spyOn(fs, "readdir").mockRejectedValueOnce(fsError("ENOENT"));
    await expect(getAllWritingEntries()).resolves.toEqual([]);
  });

  it("still surfaces other filesystem errors", async () => {
    vi.spyOn(fs, "readdir").mockRejectedValueOnce(fsError("EACCES"));
    await expect(getAllWritingEntries()).rejects.toMatchObject({ code: "EACCES" });
  });
});
