import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/stations/radio-browser-client", () => ({
  radioBrowserGet: vi.fn(),
}));

import { radioBrowserGet } from "@/lib/stations/radio-browser-client";
import { RadioBrowserProvider, toSearchParams } from "@/lib/stations/radio-browser-provider";
import { stationQuerySchema } from "@/lib/stations/types";

const get = vi.mocked(radioBrowserGet);
const uuid = "042d3140-227c-4fac-9387-4903b692d5f2";

describe("toSearchParams", () => {
  it("maps filters and always hides broken stations", () => {
    const query = stationQuerySchema.parse({
      text: "fm",
      country: "jp",
      language: "Japanese",
      tag: "Jazz",
      limit: 10,
      offset: 20,
    });
    expect(toSearchParams(query)).toEqual({
      name: "fm",
      countrycode: "JP",
      language: "japanese",
      languageExact: true,
      tag: "jazz",
      tagExact: true,
      order: "clickcount",
      reverse: true,
      limit: 10,
      offset: 20,
      hidebroken: true,
    });
  });

  it.each([
    ["popular", "clickcount", true],
    ["votes", "votes", true],
    ["name", "name", false],
    ["random", "random", false],
  ] as const)("maps order %s", (order, expected, reverse) => {
    const params = toSearchParams(stationQuerySchema.parse({ order }));
    expect(params.order).toBe(expected);
    expect(params.reverse).toBe(reverse);
    expect(params.tagExact).toBeUndefined();
  });
});

describe("RadioBrowserProvider", () => {
  const provider = new RadioBrowserProvider();

  beforeEach(() => get.mockReset());

  it("does not cache random searches", async () => {
    get.mockResolvedValue([]);
    await provider.search(stationQuerySchema.parse({ order: "random" }));
    expect(get.mock.calls[0][2]).toEqual({ revalidate: 0 });
  });

  it("returns normalized stations", async () => {
    get.mockResolvedValue([
      { stationuuid: uuid, name: "A", url: "https://a.test/s" },
      { stationuuid: "bad", name: "", url: "" },
    ]);
    const stations = await provider.search(stationQuerySchema.parse({}));
    expect(stations.map((s) => s.id)).toEqual([uuid]);
  });

  it("returns null for invalid ids without calling the API", async () => {
    await expect(provider.getById("nope")).resolves.toBeNull();
    expect(get).not.toHaveBeenCalled();
  });

  it("returns the first station for a valid id", async () => {
    get.mockResolvedValue([{ stationuuid: uuid, name: "A", url: "https://a.test/s" }]);
    await expect(provider.getById(uuid)).resolves.toMatchObject({ id: uuid });
    expect(get.mock.calls[0][0]).toBe(`/json/stations/byuuid/${uuid}`);
  });

  it("keeps only countries with valid codes", async () => {
    get.mockResolvedValue([
      { name: "Japan", iso_3166_1: "JP", stationcount: 3 },
      { name: "Nowhere", stationcount: 9 },
    ]);
    await expect(provider.getCountries()).resolves.toEqual([
      { name: "Japan", code: "JP", stationCount: 3 },
    ]);
  });

  it("lowercases languages", async () => {
    get.mockResolvedValue([{ name: "Bengali", iso_639: "bn", stationcount: 4 }]);
    await expect(provider.getLanguages()).resolves.toEqual([{ name: "bengali", stationCount: 4 }]);
  });

  it("limits tags", async () => {
    get.mockResolvedValue([
      { name: "pop", stationcount: 3 },
      { name: "rock", stationcount: 2 },
    ]);
    await expect(provider.getTags(1)).resolves.toEqual([{ name: "pop", stationCount: 3 }]);
    expect(get.mock.calls[0][1]).toMatchObject({ limit: 1, order: "stationcount" });
  });

  it("reports clicks without caching", async () => {
    get.mockResolvedValue({ ok: true });
    await provider.reportClick(uuid);
    expect(get).toHaveBeenCalledWith(`/json/url/${uuid}`, {}, { revalidate: 0 });
  });
});
