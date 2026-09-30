import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import type { ServerResponse } from 'http';

const target = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';

export const AUTH_PATHS = ['/auth'];

export const authProxy = createProxyMiddleware({
  target,
  changeOrigin: true,
  pathFilter: (path) => AUTH_PATHS.some((prefix) => path.startsWith(prefix)),
  on: {
    // Same fix as registry.ts: express.json() already drained the request
    // stream by the time this proxy runs, so POST bodies (register/login)
    // must be re-serialized onto the proxied request.
    proxyReq: fixRequestBody,
    error: (_err, _req, res) => {
      const response = res as ServerResponse;
      response.writeHead(502, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'auth-service is unavailable' }));
    },
  },
});
