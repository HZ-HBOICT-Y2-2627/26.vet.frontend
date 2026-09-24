import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { treatmentsRouter } from './routes/treatments';
import { vetsRouter } from './routes/vets';
import { appointmentTypesRouter } from './routes/appointmentTypes';
import { errorHandler } from './middleware/errorHandling';

dotenv.config();

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', environment: NODE_ENV });
});

app.use('/treatments', treatmentsRouter);
app.use('/vets', vetsRouter);
app.use('/appointment-types', appointmentTypesRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
