import { Router } from 'express';
import { qualityCheckService } from '../services/quality-check.service.js';
import { asyncHandler } from '../middleware/error.js';
import { validate, idParamSchema, qualityCheckCreateSchema } from '../middleware/validation.js';

const router = Router();

router.get(
  '/dataset/:datasetId',
  asyncHandler(async (req, res) => {
    const checks = await qualityCheckService.findByDataset(req.params.datasetId);
    res.json({ data: checks });
  })
);

router.post(
  '/',
  validate({ body: qualityCheckCreateSchema }),
  asyncHandler(async (req, res) => {
    const check = await qualityCheckService.create(req.body);
    res.status(201).json({ data: check });
  })
);

router.post(
  '/:id/execute',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const check = await qualityCheckService.execute(req.params.id);
    res.json({ data: check });
  })
);

router.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    await qualityCheckService.delete(req.params.id);
    res.status(204).send();
  })
);

export default router;