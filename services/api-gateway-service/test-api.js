#!/usr/bin/env node

/**
 * API GATEWAY TEST SUITE
 *
 * Run the gateway first: npm run dev
 * Make sure vets_service (port 4000) and auth-service (port 4001) are also running.
 * Then run: node test-api.js
 */

const http = require('http');

const PORT = 3000;

async function request(method, path, { body, token, headers: extraHeaders } = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const headers = {
      ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    };
    const options = { hostname: 'localhost', port: PORT, method, path, headers };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

const email = `test-suite-${Date.now()}@example.com`;
const password = 'supersecret1';
let token;
let noorToken; // seeded in auth-service: npm run prisma:seed

const tests = [
  { name: 'Health check', fn: () => request('GET', '/health') },

  { name: 'GET /vets (public) without token', expect: 200,
    fn: () => request('GET', '/vets') },

  { name: 'GET /treatments (public) without token', expect: 200,
    fn: () => request('GET', '/treatments') },

  { name: 'GET /appointment-types (public) without token', expect: 200,
    fn: () => request('GET', '/appointment-types') },

  { name: 'POST /vets without token -> rejected', expect: 401,
    fn: () => request('POST', '/vets', { body: {} }) },

  { name: 'POST /vets with an invalid token -> rejected', expect: 401,
    fn: () => request('POST', '/vets', { body: {}, token: 'not-a-real-token' }) },

  { name: 'POST /auth/register (public) -> issues a token', expect: 201,
    fn: async () => {
      const res = await request('POST', '/auth/register', { body: { email, password } });
      token = res.data?.token;
      return res;
    } },

  { name: 'POST /auth/login (public) with the same credentials', expect: 200,
    fn: () => request('POST', '/auth/login', { body: { email, password } }) },

  { name: 'GET /auth/me with token', expect: 200,
    fn: () => request('GET', '/auth/me', { token }) },

  { name: 'POST /vets with token -> reaches vets_service (400: empty body fails validation)', expect: 400,
    fn: () => request('POST', '/vets', { body: {}, token }) },

  { name: 'GET /my/pets without token -> rejected', expect: 401,
    fn: () => request('GET', '/my/pets') },

  { name: 'GET /my/pets as a new user -> no pets', expect: 200,
    fn: async () => {
      const res = await request('GET', '/my/pets', { token });
      return { ...res, status: res.data?.length === 0 ? res.status : 'unexpected pets' };
    } },

  { name: 'POST /auth/login as seeded owner noor@example.com', expect: 200,
    fn: async () => {
      const res = await request('POST', '/auth/login', { body: { email: 'noor@example.com', password: 'supersecret1' } });
      noorToken = res.data?.token;
      return res;
    } },

  { name: 'GET /my/pets as Noor -> Roos', expect: 200,
    fn: async () => {
      const res = await request('GET', '/my/pets', { token: noorToken });
      return { ...res, status: res.data?.[0]?.name === 'Roos' ? res.status : 'Roos not found' };
    } },

  { name: 'GET /my/pets with a fake X-User-Email header -> ignored', expect: 200,
    fn: async () => {
      const res = await request('GET', '/my/pets', { token, headers: { 'X-User-Email': 'noor@example.com' } });
      return { ...res, status: res.data?.length === 0 ? res.status : 'header was trusted' };
    } },
];

async function runTests() {
  console.log('\nAPI GATEWAY TEST SUITE\n');
  console.log('Make sure the gateway, vets_service, and auth-service are all running\n');

  let failures = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const result = await test.fn();
      const ok = test.expect ? result.status === test.expect : result.status >= 200 && result.status < 300;
      if (!ok) failures += 1;
      console.log(`  ${ok ? 'OK' : 'FAIL'} (${result.status})\n`);
    } catch (error) {
      failures += 1;
      console.log(`  Connection Error: ${error.message}`);
      console.log(`  Make sure the gateway is running on port ${PORT}\n`);
      break;
    }
  }

  console.log(failures === 0 ? 'All tests passed!\n' : `${failures} test(s) failed.\n`);
  process.exitCode = failures === 0 ? 0 : 1;
}

runTests();
