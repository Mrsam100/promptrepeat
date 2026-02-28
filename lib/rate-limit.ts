/**
 * Simple in-memory rate limiter.
 * Works well for single-instance deployments (Vercel serverless has per-function isolation,
 * so this provides per-invocation-instance limiting — still useful for burst protection).
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds to prevent memory leaks
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now >= entry.resetTime) {
        store.delete(key);
      }
    }
  }, 60_000);
  // Allow the process to exit without waiting for the interval
  if (typeof cleanupInterval === 'object' && 'unref' in cleanupInterval) {
    cleanupInterval.unref();
  }
}

interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

export function rateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  ensureCleanup();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetTime) {
    // Start a new window
    store.set(key, {
      count: 1,
      resetTime: now + options.windowSeconds * 1000,
    });
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      resetInSeconds: options.windowSeconds,
    };
  }

  // Within existing window
  entry.count++;
  const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000);

  if (entry.count > options.limit) {
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      resetInSeconds,
    };
  }

  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - entry.count,
    resetInSeconds,
  };
}
