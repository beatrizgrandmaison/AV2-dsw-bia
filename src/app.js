import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

app.use(errorMiddleware);

export default app;
