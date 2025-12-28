/**
 * Career Black Box - API Performance Test
 * Tests authenticated API endpoints
 * 
 * Run: k6 run load-tests/api-perf.js -e AUTH_TOKEN=your_token
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend } from 'k6/metrics';

// Custom metrics for API endpoints
const decisionsLatency = new Trend('api_decisions_latency');
const analyticsLatency = new Trend('api_analytics_latency');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || '';

export const options = {
    scenarios: {
        // Constant API load
        constant_load: {
            executor: 'constant-vus',
            vus: 20,
            duration: '2m',
        },
        // Ramping users
        ramping_load: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 20 },
                { duration: '1m', target: 50 },
                { duration: '30s', target: 0 },
            ],
            startTime: '2m30s', // Start after constant load
        },
    },

    thresholds: {
        'api_decisions_latency': ['p(95)<300'],  // Decisions API fast
        'api_analytics_latency': ['p(95)<400'],  // Analytics slightly slower
        'http_req_failed': ['rate<0.01'],
    },
};

function getAuthHeaders() {
    if (!AUTH_TOKEN) {
        return {};
    }
    return {
        'Cookie': `sb-access-token=${AUTH_TOKEN}`,
    };
}

export default function () {
    const headers = getAuthHeaders();

    group('API Endpoints', function () {
        // Test health endpoint (no auth required)
        const healthRes = http.get(`${BASE_URL}/api/health`);
        check(healthRes, {
            'health: status 200': (r) => r.status === 200,
        });

        // If we have auth token, test protected endpoints
        if (AUTH_TOKEN) {
            // Decisions API
            const decisionsRes = http.get(`${BASE_URL}/api/decisions`, { headers });
            decisionsLatency.add(decisionsRes.timings.duration);
            check(decisionsRes, {
                'decisions: status 200 or 401': (r) => r.status === 200 || r.status === 401,
                'decisions: response < 500ms': (r) => r.timings.duration < 500,
            });

            sleep(0.5);

            // Analytics API
            const analyticsRes = http.get(`${BASE_URL}/api/analytics/personal`, { headers });
            analyticsLatency.add(analyticsRes.timings.duration);
            check(analyticsRes, {
                'analytics: status 200 or 401': (r) => r.status === 200 || r.status === 401,
                'analytics: response < 500ms': (r) => r.timings.duration < 500,
            });
        }
    });

    sleep(1);
}
