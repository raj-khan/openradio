import { z } from "zod";

export const STATION_ORDERS = ["popular", "votes", "name", "random"] as const;
export const DEFAULT_LIMIT = 30;
export const MAX_LIMIT = 100;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value === "" ? undefined : value))
    .optional();

export const stationQuerySchema = z.object({
  text: optionalText(100),
  country: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/, "Country must be a two letter ISO code")
    .transform((value) => value.toUpperCase())
    .optional(),
  language: optionalText(50).transform((value) => value?.toLowerCase()),
  tag: optionalText(50).transform((value) => value?.toLowerCase()),
  order: z.enum(STATION_ORDERS).default("popular"),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
  offset: z.coerce.number().int().min(0).max(10_000).default(0),
});

/** Query as accepted from callers (all fields optional). */
export type StationQueryInput = z.input<typeof stationQuerySchema>;
/** Query after validation and defaults. */
export type StationQuery = z.output<typeof stationQuerySchema>;

export const stationIdSchema = z.guid();

export interface Station {
  id: string;
  name: string;
  streamUrl: string;
  homepageUrl?: string;
  faviconUrl?: string;
  country?: string;
  countryCode?: string;
  state?: string;
  languages: string[];
  tags: string[];
  codec?: string;
  bitrate?: number;
  isHls: boolean;
  votes: number;
  clickCount: number;
  lastCheckOk: boolean;
  lastCheckedAt?: string;
  source: "radio-browser";
}

export interface Facet {
  name: string;
  code?: string;
  stationCount: number;
}

export interface StationProvider {
  search(query: StationQuery): Promise<Station[]>;
  getById(id: string): Promise<Station | null>;
  getCountries(): Promise<Facet[]>;
  getLanguages(): Promise<Facet[]>;
  getTags(limit?: number): Promise<Facet[]>;
  reportClick(id: string): Promise<void>;
}

/** Validate untrusted input (e.g. URL search params) into a StationQuery. */
export function parseStationQuery(input: unknown) {
  return stationQuerySchema.safeParse(input);
}
