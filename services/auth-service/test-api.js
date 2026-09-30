#!/usr/bin/env node

/**
 * ALLEGRO REST API TEST SUITE
 *
 * Run the server first: npm run dev
 * Then run: node test-api.js
 */

const http = require('http');

const BASE = 'http://localhost:4000';

async function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 4000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

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

const tests = [
  { name: 'Health check',        fn: () => request('GET', '/health') },
  { name: 'Get all projects',    fn: () => request('GET', '/projects') },
  { name: 'Get all tags',        fn: () => request('GET', '/tags') },
  { name: 'Get all tasks',       fn: () => request('GET', '/tasks') },
  { name: 'Get single task',     fn: () => request('GET', '/tasks/1') },
  { name: 'Create a project',    fn: () => request('POST', '/projects', { title: 'Test Project', description: 'Created by test' }) },
];

async function runTests() {
  console.log('\nALLEGRO REST API TEST SUITE\n');
  console.log('Make sure the server is running: npm run dev\n');

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const result = await test.fn();
      const ok = result.status >= 200 && result.status < 300;
      console.log(`  ${ok ? 'OK' : 'FAIL'} (${result.status})\n`);
    } catch (error) {
      console.log(`  Connection Error: ${error.message}`);
      console.log(`  Make sure the server is running on port 4000\n`);
      break;
    }
  }

  console.log('Tests completed!\n');
}

runTests();
