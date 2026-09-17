// Minimal stand-in for the Radio Browser API plus a silent audio stream, so
// end-to-end tests are fast and deterministic. Run: node e2e/mock-radio-browser.mjs
import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_PORT || 4177);
const ORIGIN = `http://127.0.0.1:${PORT}`;

const station = (id, name, countrycode, country, tags, language = "") => ({
  stationuuid: id,
  name,
  url: `${ORIGIN}/stream.wav`,
  url_resolved: `${ORIGIN}/stream.wav`,
  homepage: "https://example.com/",
  favicon: "",
  country,
  countrycode,
  state: "",
  language,
  tags,
  codec: "MP3",
  bitrate: 128,
  hls: 0,
  votes: 100,
  clickcount: 50,
  lastcheckok: 1,
  lastchecktime_iso8601: "2026-09-01T00:00:00Z",
});

export const STATIONS = [
  station(
    "11111111-1111-4111-8111-111111111111",
    "Tokyo Jazz Test FM",
    "JP",
    "Japan",
    "jazz,lounge",
    "japanese",
  ),
  station(
    "22222222-2222-4222-8222-222222222222",
    "Dhaka Test Radio",
    "BD",
    "Bangladesh",
    "bangla,music",
    "bengali",
  ),
  station(
    "33333333-3333-4333-8333-333333333333",
    "Paris Test News",
    "FR",
    "France",
    "news,talk",
    "french",
  ),
  station(
    "44444444-4444-4444-8444-444444444444",
    "Rio Test Samba",
    "BR",
    "Brazil",
    "samba,latin",
    "portuguese",
  ),
  station(
    "55555555-5555-4555-8555-555555555555",
    "London Test Rock",
    "GB",
    "United Kingdom",
    "rock",
    "english",
  ),
  station(
    "66666666-6666-4666-8666-666666666666",
    "Osaka Test Pop",
    "JP",
    "Japan",
    "pop,j-pop",
    "japanese",
  ),
];

const COUNTRIES = [...new Map(STATIONS.map((s) => [s.countrycode, s.country])).entries()].map(
  ([code, name]) => ({
    name,
    iso_3166_1: code,
    stationcount: STATIONS.filter((s) => s.countrycode === code).length * 30,
  }),
);

// 30 seconds of silent 8 kHz mono PCM audio.
function silentWav(seconds = 30, rate = 8000) {
  const samples = seconds * rate;
  const buffer = Buffer.alloc(44 + samples);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples, 4);
  buffer.write("WAVEfmt ", 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(rate, 24);
  buffer.writeUInt32LE(rate, 28);
  buffer.writeUInt16LE(1, 32);
  buffer.writeUInt16LE(8, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples, 40);
  buffer.fill(128, 44);
  return buffer;
}
const WAV = silentWav();

function json(res, body) {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

function search(params) {
  let list = STATIONS;
  const name = params.get("name")?.toLowerCase();
  if (name) list = list.filter((s) => s.name.toLowerCase().includes(name));
  const country = params.get("countrycode");
  if (country) list = list.filter((s) => s.countrycode === country);
  const tag = params.get("tag");
  if (tag) list = list.filter((s) => s.tags.split(",").includes(tag));
  const language = params.get("language");
  if (language) list = list.filter((s) => s.language === language);
  const offset = Number(params.get("offset") || 0);
  const limit = Number(params.get("limit") || 30);
  return list.slice(offset, offset + limit);
}

createServer((req, res) => {
  const url = new URL(req.url, ORIGIN);
  const path = url.pathname;
  if (path === "/stream.wav") {
    res.writeHead(200, {
      "content-type": "audio/wav",
      "content-length": WAV.length,
      "access-control-allow-origin": "*",
    });
    return res.end(WAV);
  }
  if (path === "/json/stations/search") return json(res, search(url.searchParams));
  if (path.startsWith("/json/stations/byuuid/")) {
    const id = path.split("/").pop();
    return json(
      res,
      STATIONS.filter((s) => s.stationuuid === id),
    );
  }
  if (path === "/json/countries") return json(res, COUNTRIES);
  if (path === "/json/languages") {
    return json(
      res,
      [...new Set(STATIONS.map((s) => s.language))].map((name) => ({ name, stationcount: 30 })),
    );
  }
  if (path === "/json/tags") {
    const tags = [...new Set(STATIONS.flatMap((s) => s.tags.split(",")))];
    return json(
      res,
      tags.map((name) => ({ name, stationcount: 25 })),
    );
  }
  if (path.startsWith("/json/url/")) return json(res, { ok: true });
  res.writeHead(404);
  res.end();
}).listen(PORT, "127.0.0.1", () => console.log(`mock radio browser on ${ORIGIN}`));
