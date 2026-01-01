import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkRateLimit, RATE_LIMITS, getRateLimitKey } from '@/lib/rate-limit';

describe('Rate Limit (In-Memory)', () => {
    beforeEach(() => {
        // Clear any mocking between tests
        vi.clearAllMocks();
    });

    describe('checkRateLimit', () => {
        it('should allow first request', () => {
            const result = checkRateLimit('test-user-1', 10, 60000);
            expect(result.allowed).toBe(true);
            expect(result.remaining).toBe(9);
        });

        it('should track remaining requests correctly', () => {
            const userId = 'test-user-2';
            const limit = 5;

            // First request
            let result = checkRateLimit(userId, limit, 60000);
            expect(result.remaining).toBe(4);

            // Second request
            result = checkRateLimit(userId, limit, 60000);
            expect(result.remaining).toBe(3);

            // Third request
            result = checkRateLimit(userId, limit, 60000);
            expect(result.remaining).toBe(2);
        });

        it('should block requests after limit is reached', () => {
            const userId = 'test-user-3';
            const limit = 3;

            // Use up all requests
            checkRateLimit(userId, limit, 60000);
            checkRateLimit(userId, limit, 60000);
            checkRateLimit(userId, limit, 60000);

            // Fourth request should be blocked
            const result = checkRateLimit(userId, limit, 60000);
            expect(result.allowed).toBe(false);
            expect(result.remaining).toBe(0);
        });

        it('should use different counters for different identifiers', () => {
            const limit = 2;

            // User A uses their requests
            checkRateLimit('user-a', limit, 60000);
            checkRateLimit('user-a', limit, 60000);
            const userABlocked = checkRateLimit('user-a', limit, 60000);
            expect(userABlocked.allowed).toBe(false);

            // User B should still have their full limit
            const userBFirstRequest = checkRateLimit('user-b', limit, 60000);
            expect(userBFirstRequest.allowed).toBe(true);
            expect(userBFirstRequest.remaining).toBe(1);
        });

        it('should return positive resetIn value', () => {
            const result = checkRateLimit('test-user-4', 10, 60000);
            expect(result.resetIn).toBeGreaterThan(0);
            expect(result.resetIn).toBeLessThanOrEqual(60000);
        });

        it('should use default limit of 100 if not specified', () => {
            const result = checkRateLimit('test-user-defaults');
            expect(result.remaining).toBe(99); // 100 - 1 (first request)
        });
    });

    describe('RATE_LIMITS configuration', () => {
        it('should have api limit defined', () => {
            expect(RATE_LIMITS.api).toBeDefined();
            expect(RATE_LIMITS.api.limit).toBe(100);
            expect(RATE_LIMITS.api.windowMs).toBe(60000);
        });

        it('should have ai limit defined', () => {
            expect(RATE_LIMITS.ai).toBeDefined();
            expect(RATE_LIMITS.ai.limit).toBe(20);
            expect(RATE_LIMITS.ai.windowMs).toBe(60000);
        });

        it('should have export limit defined', () => {
            expect(RATE_LIMITS.export).toBeDefined();
            expect(RATE_LIMITS.export.limit).toBe(10);
        });

        it('should have auth limit defined', () => {
            expect(RATE_LIMITS.auth).toBeDefined();
            expect(RATE_LIMITS.auth.limit).toBe(10);
        });

        it('AI limit should be lower than API limit', () => {
            expect(RATE_LIMITS.ai.limit).toBeLessThan(RATE_LIMITS.api.limit);
        });
    });

    describe('getRateLimitKey', () => {
        it('should create key from userId and endpoint', () => {
            const key = getRateLimitKey('user123', 'api');
            expect(key).toBe('user123:api');
        });

        it('should handle special characters in userId', () => {
            const key = getRateLimitKey('user@example.com', 'auth');
            expect(key).toBe('user@example.com:auth');
        });

        it('should handle empty strings', () => {
            const key = getRateLimitKey('', '');
            expect(key).toBe(':');
        });
    });
});
