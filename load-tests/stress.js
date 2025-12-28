/**
 * Career Black Box - Stress Test
 * Simulates 2x expected peak load to find breaking points
 * 
 * Run: k6 run load-tests/stress.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const healthLatency = new Trend('health_latency');
const pageLatency = new Trend('page_latency');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
    stages: [
        // Ramp-up phase
        { duration: '1m', target: 20 },   // Warm up to 20 users

        // Sustained load (expected peak)
        { duration: '3m', target: 50 },   // Hold at 50 users

        // Stress phase (2x expected)
        { duration: '2m', target: 100 },  // Push to 100 users

        // Spike test
        { duration: '30s', target: 150 }, // Brief spike to 150

        // Recovery
        { duration: '1m', target: 50 },   // Back to normal

        // Ramp-down
        { duration: '30s', target: 0 },   // Cool down
    ],

    thresholds: {
        // Response time thresholds (HARSHER - post-optimization)
        http_req_duration: [
            'p(50)<300',   // 50% under 300ms
            'p(95)<1500',  // 95% under 1.5s
            'p(99)<3000',  // 99% under 3s
        ],

        // Error rate threshold (STRICTER)
        http_req_failed: ['rate<0.05'],    // <5% failures during stress
        errors: ['rate<0.05'],

        // Custom metric thresholds (HARSHER)
        health_latency: ['p(95)<500'],     // Health check under 500ms
        page_latency: ['p(95)<2000'],      // Pages under 2s
    },
};

export default function () {
    group('Health Check', function () {
        const res = http.get(`${BASE_URL}/api/health`);
        healthLatency.add(res.timings.duration);

        const success = check(res, {
            'health: status 200': (r) => r.status === 200,
            'health: DB ok': (r) => {
                try {
                    return JSON.parse(r.body).services?.database?.status === 'ok';
                } catch {
                    return false;
                }
            },
        });

        errorRate.add(!success);
    });

    sleep(0.3);

    group('Public Pages', function () {
        // Landing page
        const homeRes = http.get(`${BASE_URL}/`);
        pageLatency.add(homeRes.timings.duration);
        check(homeRes, { 'home: status 200': (r) => r.status === 200 });

        // Login page
        const loginRes = http.get(`${BASE_URL}/auth/login`);
        check(loginRes, { 'login: status 200': (r) => r.status === 200 });

        // Signup page  
        const signupRes = http.get(`${BASE_URL}/auth/signup`);
        check(signupRes, { 'signup: status 200': (r) => r.status === 200 });
    });

    sleep(0.5);

    group('Static Assets', function () {
        // Test static file serving
        const staticRes = http.get(`${BASE_URL}/favicon.ico`);
        check(staticRes, { 'favicon: status 200': (r) => r.status === 200 });
    });

    sleep(Math.random() * 2 + 1); // Random think time 1-3s
}

export function handleSummary(data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return {
        [`load-tests/results/stress-${timestamp}.json`]: JSON.stringify(data, null, 2),
    };
}
