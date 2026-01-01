import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RATE_LIMITS, getRateLimitKey, getRateLimitHeaders, type RateLimitType } from '@/lib/upstash-rate-limit';

// Mock Upstash modules
vi.mock('@upstash/ratelimit', () => ({
    Ratelimit: vi.fn().mockImplementation(() => ({
        limit: vi.fn().mockResolvedValue({
            success: true,
            remaining: 99,
            reset: Date.now() + 60000,
        }),
    })),
}));

vi.mock('@upstash/redis', () => ({
    Redis: vi.fn(),
}));

describe('Upstash Rate Limit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('RATE_LIMITS configuration', () => {
        it('should have api limit defined', () => {
            expect(RATE_LIMITS.api).toBeDefined();
            expect(RATE_LIMITS.api.requests).toBe(100);
            expect(RATE_LIMITS.api.window).toBe('1 m');
        });

        it('should have ai limit defined', () => {
            expect(RATE_LIMITS.ai).toBeDefined();
            expect(RATE_LIMITS.ai.requests).toBe(20);
            expect(RATE_LIMITS.ai.window).toBe('1 m');
        });

        it('should have ai_public limit defined', () => {
            expect(RATE_LIMITS.ai_public).toBeDefined();
            expect(RATE_LIMITS.ai_public.requests).toBe(5);
            expect(RATE_LIMITS.ai_public.window).toBe('1 d');
        });

        it('should have export limit defined', () => {
            expect(RATE_LIMITS.export).toBeDefined();
            expect(RATE_LIMITS.export.requests).toBe(10);
        });

        it('should have auth limit defined', () => {
            expect(RATE_LIMITS.auth).toBeDefined();
            expect(RATE_LIMITS.auth.requests).toBe(10);
        });

        it('should have payments limit defined', () => {
            expect(RATE_LIMITS.payments).toBeDefined();
            expect(RATE_LIMITS.payments.requests).toBe(5);
        });

        it('AI public limit should be lower than authenticated AI limit', () => {
            expect(RATE_LIMITS.ai_public.requests).toBeLessThan(RATE_LIMITS.ai.requests);
        });

        it('payments limit should be restrictive', () => {
            expect(RATE_LIMITS.payments.requests).toBeLessThanOrEqual(5);
        });
    });

    describe('getRateLimitKey', () => {
        it('should create key from userId and endpoint', () => {
            const key = getRateLimitKey('user123', 'api');
            expect(key).toBe('user123:api');
        });

        it('should handle IP addresses', () => {
            const key = getRateLimitKey('192.168.1.1', 'ai_public');
            expect(key).toBe('192.168.1.1:ai_public');
        });

        it('should handle email as identifier', () => {
            const key = getRateLimitKey('user@example.com', 'auth');
            expect(key).toBe('user@example.com:auth');
        });

        it('should handle UUID as identifier', () => {
            const key = getRateLimitKey('550e8400-e29b-41d4-a716-446655440000', 'export');
            expect(key).toBe('550e8400-e29b-41d4-a716-446655440000:export');
        });
    });

    describe('getRateLimitHeaders', () => {
        it('should return correct headers for allowed request', () => {
            const result = {
                allowed: true,
                remaining: 99,
                resetIn: 60000,
            };

            const headers = getRateLimitHeaders(result);

            expect(headers['X-RateLimit-Remaining']).toBe('99');
            expect(headers['X-RateLimit-Reset']).toBe('60'); // 60000ms = 60s
        });

        it('should return correct headers for blocked request', () => {
            const result = {
                allowed: false,
                remaining: 0,
                resetIn: 30000,
            };

            const headers = getRateLimitHeaders(result);

            expect(headers['X-RateLimit-Remaining']).toBe('0');
            expect(headers['X-RateLimit-Reset']).toBe('30');
        });

        it('should round up reset time', () => {
            const result = {
                allowed: true,
                remaining: 50,
                resetIn: 45500, // 45.5 seconds
            };

            const headers = getRateLimitHeaders(result);

            expect(headers['X-RateLimit-Reset']).toBe('46'); // Rounded up
        });

        it('should handle very small reset times', () => {
            const result = {
                allowed: true,
                remaining: 1,
                resetIn: 500, // 0.5 seconds
            };

            const headers = getRateLimitHeaders(result);

            expect(headers['X-RateLimit-Reset']).toBe('1'); // At least 1 second
        });
    });

    describe('RateLimitType', () => {
        it('should have all expected types', () => {
            const types: RateLimitType[] = ['api', 'ai', 'ai_public', 'export', 'auth', 'payments'];
            types.forEach((type) => {
                expect(RATE_LIMITS[type]).toBeDefined();
            });
        });
    });
});
