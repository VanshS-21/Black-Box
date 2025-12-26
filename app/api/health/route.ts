import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Health check endpoint for monitoring and load balancers
 * GET /api/health
 * 
 * Returns:
 * - 200: All systems operational
 * - 503: Database or other critical service unavailable
 */
export async function GET() {
    const health: {
        status: 'ok' | 'degraded' | 'error';
        timestamp: string;
        version: string;
        environment: string;
        services: {
            database: { status: 'ok' | 'error'; latency_ms?: number; error?: string };
        };
    } = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '0.1.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
            database: { status: 'ok' },
        },
    };

    // Check database connectivity
    try {
        const startTime = Date.now();
        const supabase = await createClient();

        // Simple query to verify database connectivity
        const { error } = await supabase
            .from('decisions')
            .select('id')
            .limit(1);

        const latency = Date.now() - startTime;

        if (error) {
            health.services.database = {
                status: 'error',
                latency_ms: latency,
                error: 'Query failed',
            };
            health.status = 'degraded';
        } else {
            health.services.database = {
                status: 'ok',
                latency_ms: latency,
            };
        }
    } catch (error) {
        health.services.database = {
            status: 'error',
            error: 'Connection failed',
        };
        health.status = 'error';
    }

    const statusCode = health.status === 'error' ? 503 : 200;

    return NextResponse.json(health, { status: statusCode });
}
