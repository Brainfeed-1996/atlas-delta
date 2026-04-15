import { Router } from 'express';
import { transformationService } from '../services/transformation.service.js';
import { asyncHandler } from '../middleware/error.js';
import { validate, idParamSchema, transformationCreateSchema } from '../middleware/validation.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const transformations = await transformationService.findAll();
    res.json({ data: transformations });
  })
);

router.post(
  '/',
  validate({ body: transformationCreateSchema }),
  asyncHandler(async (req, res) => {
    const transformation = await transformationService.create(req.body);
    res.status(201).json({ data: transformation });
  })
);

router.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const transformation = await transformationService.findById(req.params.id);
    res.json({ data: transformation });
  })
);

router.put(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const transformation = await transformationService.update(req.params.id, req.body);
    res.json({ data: transformation });
  })
);

router.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    await transformationService.delete(req.params.id);
    res.status(204).send();
  })
);

export default router;