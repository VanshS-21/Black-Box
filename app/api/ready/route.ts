import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Readiness probe endpoint for container orchestration (Kubernetes, etc.)
 * 
 * GET /api/ready
 * 
 * Checks all critical dependencies:
 * - Database connectivity (Supabase)
 * - Redis connectivity (Upstash) - if configured
 * 
 * Returns:
 * - 200: All dependencies ready, pod can accept traffic
 * - 503: One or more dependencies unavailable, pod should be taken out of rotation
 */
export async function GET() {
    const startTime = Date.now();

    const checks: {
        database: { ready: boolean; latency_ms?: number; error?: string };
        redis: { ready: boolean; latency_ms?: number; error?: string; configured: boolean };
    } = {
        database: { ready: false },
        redis: { ready: false, configured: false },
    };

    // Check database connectivity
    try {
        const dbStart = Date.now();
        const supabase = await createClient();

        const { error } = await supabase
            .from('decisions')
            .select('id')
            .limit(1);

        const latency = Date.now() - dbStart;

        if (error) {
            checks.database = { ready: false, latency_ms: latency, error: 'Query failed' };
            logger.error('Readiness check: Database query failed', { latency_ms: latency }, error);
        } else {
            checks.database = { ready: true, latency_ms: latency };
        }
    } catch (error) {
        checks.database = { ready: false, error: 'Connection failed' };
        logger.error('Readiness check: Database connection failed', {}, error);
    }

    // Check Redis connectivity (if configured)
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
        checks.redis.configured = true;
        try {
            const redisStart = Date.now();

            // Simple ping to Redis
            const response = await fetch(`${redisUrl}/ping`, {
                headers: {
                    Authorization: `Bearer ${redisToken}`,
                },
            });

            const latency = Date.now() - redisStart;

            if (response.ok) {
                checks.redis = { ready: true, latency_ms: latency, configured: true };
            } else {
                checks.redis = { ready: false, latency_ms: latency, error: 'Ping failed', configured: true };
                logger.warn('Readiness check: Redis ping failed', { latency_ms: latency, status: response.status });
            }
        } catch (error) {
            checks.redis = { ready: false, error: 'Connection failed', configured: true };
            logger.error('Readiness check: Redis connection failed', {}, error);
        }
    } else {
        // Redis not configured - this is acceptable for development
        checks.redis = { ready: true, configured: false };
    }

    const totalLatency = Date.now() - startTime;

    // Pod is ready only if all configured services are ready
    const isReady = checks.database.ready && checks.redis.ready;

    const response = {
        ready: isReady,
        timestamp: new Date().toISOString(),
        latency_ms: totalLatency,
        checks,
    };

    if (!isReady) {
        logger.warn('Readiness check failed', { checks, latency_ms: totalLatency });
    }

    return NextResponse.json(response, {
        status: isReady ? 200 : 503,
        headers: {
            'Cache-Control': 'no-store, max-age=0',
        },
    });
}
