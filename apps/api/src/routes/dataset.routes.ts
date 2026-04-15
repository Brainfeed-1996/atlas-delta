import { Router } from 'express';
import { datasetService } from '../services/dataset.service.js';
import { asyncHandler } from '../middleware/error.js';
import { validate, idParamSchema, paginationSchema, datasetCreateSchema, datasetUpdateSchema } from '../middleware/validation.js';

const router = Router();

router.get(
  '/',
  validate({ query: paginationSchema }),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await datasetService.findAll(page, limit);
    res.json({
      data: result.data,
      pagination: { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit) }
    });
  })
);

router.post(
  '/',
  validate({ body: datasetCreateSchema }),
  asyncHandler(async (req, res) => {
    const dataset = await datasetService.create(req.body);
    res.status(201).json({ data: dataset });
  })
);

router.get(
  '/metrics',
  asyncHandler(async (_req, res) => {
    const metrics = await datasetService.getMetrics();
    res.json({ data: metrics });
  })
);

router.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const dataset = await datasetService.findById(req.params.id);
    res.json({ data: dataset });
  })
);

router.put(
  '/:id',
  validate({ params: idParamSchema, body: datasetUpdateSchema }),
  asyncHandler(async (req, res) => {
    const dataset = await datasetService.update(req.params.id, req.body);
    res.json({ data: dataset });
  })
);

router.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    await datasetService.delete(req.params.id);
    res.status(204).send();
  })
);

router.get(
  '/:id/snapshots',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const snapshots = await datasetService.getSnapshots(req.params.id);
    res.json({ data: snapshots });
  })
);

router.post(
  '/:id/snapshots',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const snapshot = await datasetService.createSnapshot(req.params.id);
    res.status(201).json({ data: snapshot });
  })
);

export default router;