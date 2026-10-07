import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null | undefined;

// Upstash isn't configured yet in every environment. Fail open (allow the
// request) rather than take checkout down entirely when it's missing -
// wiring up Upstash is a recommended, not required, part of the stack.
function getRatelimit(): Ratelimit | null {
  if (ratelimit !== undefined) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    ratelimit = null;
    return ratelimit;
  }

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, "60 s"),
  });
  return ratelimit;
}

export async function checkRateLimit(bucket: string, identifier: string): Promise<boolean> {
  const rl = getRatelimit();
  if (!rl) return true;
  const result = await rl.limit(`${bucket}:${identifier}`);
  return result.success;
}

export function getClientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
