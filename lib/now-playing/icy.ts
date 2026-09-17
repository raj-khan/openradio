/** Largest icy-metaint we are willing to skip over (bytes of audio). */
export const MAX_METAINT = 64_000;
const MAX_METADATA = 255 * 16;

/** Extract the StreamTitle value from an ICY metadata block. */
export function parseIcyMetadata(block: Uint8Array): string | null {
  let text = new TextDecoder("utf-8").decode(block);
  if (text.includes("�")) text = new TextDecoder("latin1").decode(block);
  const match = text.replace(/\0+$/, "").match(/StreamTitle='(.*?)';(?=[A-Za-z]+=|\s*$)/s);
  const title = match?.[1]?.replace(/\0/g, "").replace(/\s+/g, " ").trim();
  if (!title || title.length < 2 || !/\p{L}/u.test(title)) return null;
  return title.slice(0, 200);
}

/**
 * Read from an ICY stream until the first metadata block and return its title.
 * Reads at most metaint + 1 + 4080 bytes, then stops.
 */
export async function readIcyTitle(
  body: ReadableStream<Uint8Array>,
  metaint: number,
): Promise<string | null> {
  if (!Number.isInteger(metaint) || metaint <= 0 || metaint > MAX_METAINT) return null;

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  let needed = metaint + 1; // audio bytes plus the length byte
  let metadataLength: number | null = null;

  try {
    while (received < needed) {
      const { done, value } = await reader.read();
      if (done || !value) return null;
      chunks.push(value);
      received += value.length;

      if (metadataLength === null && received >= metaint + 1) {
        const all = concat(chunks, received);
        metadataLength = all[metaint] * 16;
        if (metadataLength === 0) return null;
        needed = metaint + 1 + Math.min(metadataLength, MAX_METADATA);
      }
    }
    const all = concat(chunks, received);
    return parseIcyMetadata(all.subarray(metaint + 1, needed));
  } finally {
    await reader.cancel().catch(() => {});
  }
}

function concat(chunks: Uint8Array[], length: number) {
  const out = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}
