import type { Station } from "@/lib/stations/types";

export const makeStation = (id = "a", overrides: Partial<Station> = {}): Station => ({
  id,
  name: `Station ${id}`,
  streamUrl: `https://stream.test/${id}`,
  languages: [],
  tags: [],
  isHls: false,
  votes: 0,
  clickCount: 0,
  lastCheckOk: true,
  source: "radio-browser",
  ...overrides,
});
