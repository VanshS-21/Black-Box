/**
 * Simple in-memory rate limiter for API endpoints
 * 
 * ⚠️ IMPORTANT: SERVERLESS LIMITATION
 * This in-memory rate limiter does NOT work correctly on Vercel or other serverless platforms!
 * Each function invocation may run in a different instance, resetting the rate limit state.
 * 
 * For production, implement one of these solutions:
 * 1. Upstash Redis with @upstash/ratelimit (recommended for Vercel)
 * 2. Vercel KV (built-in Redis)
 * 3. Store rate limits in Supabase database
 * 
 * See: https://upstash.com/docs/oss/sdks/ts/ratelimit/overview
 */

interface RateLimitRecord {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
        if (now > record.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, 60000); // Clean up every minute

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., user ID or IP)
 * @param limit - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
    identifier: string,
    limit: number = 100,
    windowMs: number = 60000
): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime: now + windowMs,
        });
        return {
            allowed: true,
            remaining: limit - 1,
            resetIn: windowMs,
        };
    }

    if (record.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            resetIn: record.resetTime - now,
        };
    }

    record.count++;
    return {
        allowed: true,
        remaining: limit - record.count,
        resetIn: record.resetTime - now,
    };
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
    // Standard API calls
    api: { limit: 100, windowMs: 60000 }, // 100 requests per minute

    // AI endpoints (more restrictive due to cost)
    ai: { limit: 20, windowMs: 60000 }, // 20 AI requests per minute

    // Export (infrequent)
    export: { limit: 10, windowMs: 60000 }, // 10 exports per minute

    // Auth endpoints
    auth: { limit: 10, windowMs: 60000 }, // 10 auth attempts per minute
} as const;

/**
 * Helper to create rate limit key
 */
export function getRateLimitKey(userId: string, endpoint: string): string {
    return `${userId}:${endpoint}`;
}
