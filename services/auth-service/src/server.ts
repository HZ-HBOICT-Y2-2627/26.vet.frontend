import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { errorHandler } from './middleware/errorHandling.js';

dotenv.config();

const PORT = process.env.PORT || 4001;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth-service', environment: NODE_ENV });
});

app.use('/auth', authRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
