import { NextResponse } from 'next/server';

/**
 * Health check endpoint for monitoring and load balancers
 * GET /api/health
 */
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '0.1.0',
        environment: process.env.NODE_ENV || 'development',
    });
}
