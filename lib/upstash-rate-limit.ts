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
import { logger } from '@/lib/logger';

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
    ai_public: { requests: 5, window: '1 d' as const },  // Public AI (anonymous, 5/day per IP)
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
 * Simple in-memory rate limiter fallback for when Redis is unavailable
 * Uses a Map with automatic cleanup every 5 minutes
 */
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();
let lastCleanup = Date.now();

function cleanupInMemoryStore() {
    const now = Date.now();
    // Cleanup every 5 minutes
    if (now - lastCleanup > 5 * 60 * 1000) {
        for (const [key, value] of inMemoryStore.entries()) {
            if (value.resetAt < now) {
                inMemoryStore.delete(key);
            }
        }
        lastCleanup = now;
    }
}

function getWindowMs(window: string): number {
    if (window.endsWith(' m')) return parseInt(window) * 60 * 1000;
    if (window.endsWith(' d')) return parseInt(window) * 24 * 60 * 60 * 1000;
    return 60 * 1000; // Default 1 minute
}

function checkInMemoryRateLimit(key: string, type: RateLimitType): RateLimitResult {
    cleanupInMemoryStore();
    const config = RATE_LIMITS[type];
    const windowMs = getWindowMs(config.window);
    const now = Date.now();

    const entry = inMemoryStore.get(key);

    if (!entry || entry.resetAt < now) {
        // First request or window expired
        inMemoryStore.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: config.requests - 1, resetIn: windowMs };
    }

    if (entry.count >= config.requests) {
        // Rate limited
        return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
    }

    // Increment count
    entry.count++;
    return { allowed: true, remaining: config.requests - entry.count, resetIn: entry.resetAt - now };
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
    const key = `${type}:${identifier}`;

    // If Upstash not configured, use in-memory fallback
    if (!limiter) {
        return checkInMemoryRateLimit(key, type);
    }

    const config = RATE_LIMITS[type];

    try {
        const result = await limiter.limit(key);

        // Log rate limit exhaustion as a security event
        if (!result.success) {
            logger.warn('Rate limit exhausted', {
                identifier,
                type,
                remaining: result.remaining,
                action: 'security_rate_limit'
            });
        }

        return {
            allowed: result.success,
            remaining: result.remaining,
            resetIn: result.reset - Date.now(),
        };
    } catch (error) {
        logger.error('Rate limit check failed, using in-memory fallback', { identifier, type }, error);
        // On error, use in-memory fallback instead of allowing all requests
        return checkInMemoryRateLimit(key, type);
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
