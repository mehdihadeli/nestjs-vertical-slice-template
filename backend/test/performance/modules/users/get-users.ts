import http, { Response } from 'k6/http';
import { check } from 'k6';
import { Options } from 'k6/options';

// BASE_URL from the environment variable or default. Use `K6_BASE_URL` in your env or CLI.
const BASE_URL = __ENV.BASE_URL ?? 'http://localhost:4000';

export const options: Options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '10s', target: 100 },
    { duration: '10s', target: 10 },
    { duration: '10s', target: 0 },

    // ------
    // { duration: "30s", target: 100 },
    // { duration: "1m", target: 100 },
    // { duration: "30s", target: 50 },
    // ------
    // Spike
    // { duration: "1m", target: 2000 }, // fast ramp-up to a high point
    // { duration: "30", target: 0 }, // quick ramp-down to 0 users
  ],
  thresholds: {
    http_req_failed: [{ threshold: 'rate < 0.01', abortOnFail: true }],
  },
};

export default function (): void {
  const res: Response = http.get(`${BASE_URL}/api/v1/users`);

  check(res, {
    'status is 200': r => r.status === 200,
    // add more checks if needed, for example response time, JSON shape, etc.
  });
}
