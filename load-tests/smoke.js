/**
 * Career Black Box - Smoke Test
 * Quick validation that core endpoints are responsive
 * 
 * Run: k6 run load-tests/smoke.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
    // Light load - just verify everything works
    vus: 5,
    duration: '30s',

    thresholds: {
        http_req_duration: ['p(95)<500'],  // 95% under 500ms
        http_req_failed: ['rate<0.01'],     // <1% failures
    },
};

export default function () {
    // 1. Health check endpoint (should be fastest)
    const healthRes = http.get(`${BASE_URL}/api/health`);
    check(healthRes, {
        'health: status 200': (r) => r.status === 200,
        'health: response < 200ms': (r) => r.timings.duration < 200,
        'health: DB connected': (r) => {
            try {
                const body = JSON.parse(r.body);
                return body.services?.database?.status === 'ok';
            } catch {
                return false;
            }
        },
    });

    sleep(0.5);

    // 2. Landing page
    const homeRes = http.get(`${BASE_URL}/`);
    check(homeRes, {
        'home: status 200': (r) => r.status === 200,
        'home: response < 1s': (r) => r.timings.duration < 1000,
    });

    sleep(0.5);

    // 3. Auth pages
    const loginRes = http.get(`${BASE_URL}/auth/login`);
    check(loginRes, {
        'login: status 200': (r) => r.status === 200,
    });

    const signupRes = http.get(`${BASE_URL}/auth/signup`);
    check(signupRes, {
        'signup: status 200': (r) => r.status === 200,
    });

    sleep(1);
}

export function handleSummary(data) {
    return {
        'stdout': textSummary(data, { indent: '  ', enableColors: true }),
        'load-tests/results/smoke-summary.json': JSON.stringify(data, null, 2),
    };
}

function textSummary(data, options) {
    // k6 built-in summary
    return '';
}
