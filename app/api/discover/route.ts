import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, logError } from "@/lib/api/responses";
import { runDiscover, type DiscoverResult } from "@/lib/discover/run";
import { clientKey, createRateLimiter, retryAfterSeconds } from "@/lib/security/rate-limit";

const bodySchema = z.object({ prompt: z.string().trim().min(1).max(200) });
const limiter = createRateLimiter({ limit: 20, windowMs: 60_000 });

export async function POST(request: Request) {
  const limit = limiter(clientKey(request));
  if (!limit.ok) {
    return apiError(429, "Too many requests. Please slow down.", {
      "Retry-After": String(retryAfterSeconds(limit)),
    });
  }

  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success)
    return apiError(400, "Tell us what you'd like to hear (up to 200 characters).");

  try {
    const result = await runDiscover(body.data.prompt);
    return NextResponse.json<DiscoverResult>(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    logError("discover", error);
    return apiError(502, "Discovery isn't available right now. Try search instead.");
  }
}
