import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import type { ServerResponse } from 'http';

const target = process.env.VETS_SERVICE_URL || 'http://localhost:4000';

export const VETS_PATHS = ['/vets', '/treatments', '/appointment-types'];

// Data of the logged-in user (e.g. /my/pets). Always requires a token.
export const MY_PATHS = ['/my'];

export const vetsProxy = createProxyMiddleware({
  target,
  changeOrigin: true,
  pathFilter: (path) => [...VETS_PATHS, ...MY_PATHS].some((prefix) => path.startsWith(prefix)),
  on: {
    // server.ts runs express.json() before this proxy, which drains the request
    // stream; re-serialize the parsed body onto the proxied request, or else
    // writes reach vets_service with an empty body.
    proxyReq: fixRequestBody,
    error: (_err, _req, res) => {
      const response = res as ServerResponse;
      response.writeHead(502, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'vets_service is unavailable' }));
    },
  },
});
