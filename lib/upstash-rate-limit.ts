/**
 * Production-ready rate limiter using Upstash Redis
 * Works correctly in serverless environments (Vercel, etc.)
 * 
 * Setup:
 * 1. Create a free account at https://upstash.com
 * 2. Create a Redis database
 * 3. Copy UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.local
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Lazy initialization to avoid errors if env vars are missing
let ratelimit: Ratelimit | null = null;
let isConfigured = false;

/**
 * Get the Upstash rate limiter instance
 * Returns null if Upstash is not configured (falls back to no rate limiting)
 */
function getRatelimit(): Ratelimit | null {
    if (ratelimit) return ratelimit;

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        if (!isConfigured) {
            console.warn(
                '⚠️ Upstash Redis not configured. Rate limiting is disabled.\n' +
                'Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable.'
            );
            isConfigured = true; // Only warn once
        }
        return null;
    }

    const redis = new Redis({ url, token });

    ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'), // Default: 100 requests per minute
        analytics: true,
        prefix: 'career-black-box',
    });

    return ratelimit;
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
    api: { requests: 100, window: '1 m' as const },      // Standard API calls
    ai: { requests: 20, window: '1 m' as const },        // AI endpoints (cost-sensitive)
    export: { requests: 10, window: '1 m' as const },    // Export (infrequent)
    auth: { requests: 10, window: '1 m' as const },      // Auth attempts
    payments: { requests: 5, window: '1 m' as const },   // Payment operations
} as const;

export type RateLimitType = keyof typeof RATE_LIMITS;

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetIn: number; // milliseconds until reset
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (user ID or IP)
 * @param type - Type of rate limit to apply
 */
export async function checkRateLimit(
    identifier: string,
    type: RateLimitType = 'api'
): Promise<RateLimitResult> {
    const limiter = getRatelimit();

    // If Upstash not configured, allow all requests
    if (!limiter) {
        return {
            allowed: true,
            remaining: 999,
            resetIn: 0,
        };
    }

    const config = RATE_LIMITS[type];
    const key = `${type}:${identifier}`;

    try {
        const result = await limiter.limit(key);

        return {
            allowed: result.success,
            remaining: result.remaining,
            resetIn: result.reset - Date.now(),
        };
    } catch (error) {
        console.error('Rate limit check failed:', error);
        // On error, allow the request (fail open)
        return {
            allowed: true,
            remaining: 999,
            resetIn: 0,
        };
    }
}

/**
 * Helper to create rate limit key
 */
export function getRateLimitKey(userId: string, endpoint: string): string {
    return `${userId}:${endpoint}`;
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    return {
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.resetIn / 1000)),
    };
}
