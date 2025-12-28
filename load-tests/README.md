# Load Testing - Career Black Box

This directory contains k6 load testing scripts for performance validation.

## Prerequisites

Install k6 on your machine:

```bash
# Windows (Chocolatey)
choco install k6

# macOS (Homebrew)
brew install k6

# Linux (apt)
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

## Test Scripts

| Script | Purpose | Duration | VUs |
|--------|---------|----------|-----|
| `smoke.js` | Quick sanity check | 30s | 5 |
| `stress.js` | Peak load simulation | ~8min | 20→150 |
| `api-perf.js` | API endpoint testing | ~4min | 20-50 |

## Running Tests

### Local Development

```bash
# Smoke test (quick validation)
npm run test:load:smoke

# Or directly with k6
k6 run load-tests/smoke.js
```

### Against Production

```bash
# Smoke test against Vercel
k6 run load-tests/smoke.js -e BASE_URL=https://your-app.vercel.app

# Stress test (careful - might hit rate limits)
k6 run load-tests/stress.js -e BASE_URL=https://your-app.vercel.app
```

### With Authentication

To test protected endpoints, you need a valid session token:

1. Log in to the app in your browser
2. Open DevTools → Application → Cookies
3. Copy the `sb-access-token` value
4. Run:

```bash
k6 run load-tests/api-perf.js \
  -e BASE_URL=https://your-app.vercel.app \
  -e AUTH_TOKEN=your_token_here
```

## Performance Thresholds

| Metric | Target | Acceptable | Critical |
|--------|--------|------------|----------|
| p50 latency | <100ms | <200ms | >500ms |
| p95 latency | <300ms | <500ms | >1s |
| p99 latency | <500ms | <1s | >2s |
| Error rate | <0.1% | <1% | >5% |
| Health check | <100ms | <200ms | >500ms |

## Understanding Results

k6 outputs a summary after each run:

```
     http_req_duration..............: avg=125ms  min=45ms  med=98ms  max=890ms  p(90)=210ms  p(95)=340ms
     http_req_failed................: 0.00%   ✓ 0    ✗ 1234
     iterations.....................: 1234    12.34/s
```

- **p(95)**: 95th percentile - 95% of requests are faster than this
- **avg**: Average response time
- **http_req_failed**: Percentage of failed requests

## Test Results

Results are saved to `load-tests/results/` directory as JSON files.

## Tips

1. **Always run smoke test first** before stress testing
2. **Notify team** before running stress tests against production
3. **Watch Vercel dashboard** during tests for function timeouts
4. **Monitor Supabase** for connection limits
5. **Check Sentry** for errors during load tests
