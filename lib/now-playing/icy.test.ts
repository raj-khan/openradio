import { describe, expect, it } from "vitest";
import { MAX_METAINT, parseIcyMetadata, readIcyTitle } from "@/lib/now-playing/icy";

const enc = new TextEncoder();

function metadataBlock(text: string) {
  const bytes = enc.encode(text);
  const length = Math.ceil(bytes.length / 16);
  const block = new Uint8Array(1 + length * 16);
  block[0] = length;
  block.set(bytes, 1);
  return block;
}

function streamOf(bytes: Uint8Array, chunkSize: number) {
  let offset = 0;
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>(
    {
      pull(controller) {
        if (offset >= bytes.length) return controller.close();
        controller.enqueue(bytes.slice(offset, offset + chunkSize));
        offset += chunkSize;
      },
      cancel() {
        cancelled = true;
      },
    },
    { highWaterMark: 0 },
  );
  return { stream, wasCancelled: () => cancelled, read: () => offset };
}

function icyPayload(metaint: number, text: string, tail = 50_000) {
  const block = metadataBlock(text);
  const bytes = new Uint8Array(metaint + block.length + tail);
  bytes.fill(7, 0, metaint);
  bytes.set(block, metaint);
  return bytes;
}

describe("parseIcyMetadata", () => {
  it("extracts titles", () => {
    expect(parseIcyMetadata(enc.encode("StreamTitle='Artist - Song';StreamUrl='';\0\0"))).toBe(
      "Artist - Song",
    );
  });

  it("keeps apostrophes and semicolons inside titles", () => {
    expect(parseIcyMetadata(enc.encode("StreamTitle='Guns N' Roses - Don't Cry; Live';"))).toBe(
      "Guns N' Roses - Don't Cry; Live",
    );
  });

  it("decodes utf-8 and falls back to latin1", () => {
    expect(parseIcyMetadata(enc.encode("StreamTitle='Björk - Jóga';"))).toBe("Björk - Jóga");
    const latin1 = Uint8Array.from(
      [..."StreamTitle='Caf"].map((c) => c.charCodeAt(0)).concat([0xe9, 0x27, 0x3b]),
    );
    expect(parseIcyMetadata(latin1)).toBe("Café");
  });

  it("ignores empty and placeholder titles", () => {
    expect(parseIcyMetadata(enc.encode("StreamTitle='';"))).toBeNull();
    expect(parseIcyMetadata(enc.encode("StreamTitle=' - ';"))).toBeNull();
    expect(parseIcyMetadata(enc.encode("StreamTitle='9999999 - 9999999';"))).toBeNull();
    expect(parseIcyMetadata(enc.encode("StreamTitle='_';"))).toBeNull();
    expect(parseIcyMetadata(enc.encode("StreamTitle='Blink-182 - 1979';"))).toBe(
      "Blink-182 - 1979",
    );
    expect(parseIcyMetadata(enc.encode("garbage"))).toBeNull();
  });
});

describe("readIcyTitle", () => {
  it("reads the first metadata block across chunk boundaries and stops", async () => {
    const payload = icyPayload(16_000, "StreamTitle='Artist - Song';");
    const { stream, wasCancelled, read } = streamOf(payload, 1_000);
    await expect(readIcyTitle(stream, 16_000)).resolves.toBe("Artist - Song");
    expect(wasCancelled()).toBe(true);
    expect(read()).toBeLessThan(payload.length);
  });

  it("returns null when the metadata block is empty", async () => {
    const bytes = new Uint8Array(9000);
    const { stream } = streamOf(bytes, 4096);
    await expect(readIcyTitle(stream, 8192)).resolves.toBeNull();
  });

  it("refuses unreasonable metaint values without reading", async () => {
    const { stream, read } = streamOf(new Uint8Array(10), 10);
    await expect(readIcyTitle(stream, MAX_METAINT + 1)).resolves.toBeNull();
    await expect(readIcyTitle(stream, 0)).resolves.toBeNull();
    expect(read()).toBe(0);
  });

  it("returns null when the stream ends early", async () => {
    const { stream } = streamOf(new Uint8Array(100), 50);
    await expect(readIcyTitle(stream, 16_000)).resolves.toBeNull();
  });
});
