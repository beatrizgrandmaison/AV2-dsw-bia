import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { prisma } from './prisma.js';

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      const isLocalViteOrigin = /^http:\/\/(localhost|127\.0\.0\.1):(5173|5174)$/.test(origin || '');
      if (!origin || allowedOrigins.includes(origin) || isLocalViteOrigin) {
        return callback(null, true);
      }
      return callback(new Error('Origem não permitida pelo CORS'));
    },
  })
);
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch {
    return res.status(503).json({ status: 'error', database: 'disconnected', timestamp: new Date().toISOString() });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

app.use(errorMiddleware);

export default app;
