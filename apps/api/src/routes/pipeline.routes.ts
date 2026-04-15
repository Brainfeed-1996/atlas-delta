import { Router } from 'express';
import { pipelineService } from '../services/pipeline.service.js';
import { asyncHandler } from '../middleware/error.js';
import { validate, idParamSchema, pipelineCreateSchema } from '../middleware/validation.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const pipelines = await pipelineService.findAll();
    res.json({ data: pipelines });
  })
);

router.post(
  '/',
  validate({ body: pipelineCreateSchema }),
  asyncHandler(async (req, res) => {
    const pipeline = await pipelineService.create(req.body);
    res.status(201).json({ data: pipeline });
  })
);

router.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const pipeline = await pipelineService.findById(req.params.id);
    res.json({ data: pipeline });
  })
);

router.put(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const pipeline = await pipelineService.update(req.params.id, req.body);
    res.json({ data: pipeline });
  })
);

router.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    await pipelineService.delete(req.params.id);
    res.status(204).send();
  })
);

router.post(
  '/:id/run',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const run = await pipelineService.triggerRun(req.params.id);
    res.status(201).json({ data: run });
  })
);

router.get(
  '/:id/runs',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const runs = await pipelineService.getRuns(req.params.id);
    res.json({ data: runs });
  })
);

export default router;