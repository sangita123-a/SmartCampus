import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { requestLogger } from './middlewares/requestLogger.middleware';
import { globalErrorHandler, notFoundHandler } from './middlewares/error.middleware';
import v1Routes from './routes';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
  app.use(requestLogger);

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'SmartCampus API',
      version: 'v1',
      docs: '/api/v1/health',
    });
  });

  app.use('/api/v1', v1Routes);

  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
}
