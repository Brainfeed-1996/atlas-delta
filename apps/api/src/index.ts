import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { initConfig } from '@atlas-delta/core';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import datasetRoutes from './routes/dataset.routes.js';
import transformationRoutes from './routes/transformation.routes.js';
import pipelineRoutes from './routes/pipeline.routes.js';
import qualityCheckRoutes from './routes/quality-check.routes.js';
import lineageRoutes from './routes/lineage.routes.js';
import alertRoutes from './routes/alert.routes.js';

const config = initConfig();

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: { error: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'atlas-delta-api', timestamp: new Date().toISOString() });
});

app.use(`${config.apiPrefix}/datasets`, datasetRoutes);
app.use(`${config.apiPrefix}/transformations`, transformationRoutes);
app.use(`${config.apiPrefix}/pipelines`, pipelineRoutes);
app.use(`${config.apiPrefix}/quality-checks`, qualityCheckRoutes);
app.use(`${config.apiPrefix}/lineage`, lineageRoutes);
app.use(`${config.apiPrefix}/alerts`, alertRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const port = config.port;
app.listen(port, () => {
  console.log(`Atlas Delta API running on port ${port}`);
});

export default app;