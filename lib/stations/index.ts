import "server-only";

import { RadioBrowserProvider } from "@/lib/stations/radio-browser-provider";
import type { StationProvider } from "@/lib/stations/types";

let provider: StationProvider | undefined;

/** The station provider used by the app. Swap implementations here. */
export function getStationProvider(): StationProvider {
  provider ??= new RadioBrowserProvider();
  return provider;
}
