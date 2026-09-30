import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { vetsProxy, VETS_PATHS, MY_PATHS } from './routes/vets';
import { authProxy, AUTH_PATHS } from './routes/auth';
import { authenticate } from './middleware/authenticate';
import { errorHandler } from './middleware/errorHandling';

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

app.use(express.json());
// cors() runs first so browser preflight (OPTIONS) requests are answered
// before authenticate asks for a token.
app.use(cors());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'api-gateway-service',
    environment: NODE_ENV,
    upstreams: {
      vetsService: process.env.VETS_SERVICE_URL || 'http://localhost:4000',
      authService: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
    },
  });
});

// Public: anyone must be able to register and log in.
app.use(authProxy);

// Reading is public; writing (POST, PUT, DELETE) needs a valid token.
app.use(VETS_PATHS, (req, res, next) => {
  if (req.method === 'GET') return next();
  return authenticate(req, res, next);
});
// Personal data: every request needs a valid token, also GET.
app.use(MY_PATHS, authenticate);
app.use(vetsProxy);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  const vetsServiceUrl = process.env.VETS_SERVICE_URL || 'http://localhost:4000';
  const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
  console.log(`API gateway running at http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  AUTH_PATHS.forEach((path) => console.log(`→ ${path.padEnd(18)} → ${authUrl} (public)`));
  VETS_PATHS.forEach((path) => console.log(`→ ${path.padEnd(18)} → ${vetsServiceUrl} (GET public, writes require token)`));
  MY_PATHS.forEach((path) => console.log(`→ ${path.padEnd(18)} → ${vetsServiceUrl} (requires token)`));
});
