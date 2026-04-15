import { Router } from 'express';
import { lineageService } from '../services/lineage.service.js';
import { asyncHandler } from '../middleware/error.js';
import { validate, idParamSchema } from '../middleware/validation.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const graphs = await lineageService.findAll();
    res.json({ data: graphs });
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const graph = await lineageService.create(req.body);
    res.status(201).json({ data: graph });
  })
);

router.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const graph = await lineageService.findById(req.params.id);
    res.json({ data: graph });
  })
);

router.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    await lineageService.delete(req.params.id);
    res.status(204).send();
  })
);

router.post(
  '/:id/nodes',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const node = await lineageService.addNode(req.params.id, req.body);
    res.status(201).json({ data: node });
  })
);

router.post(
  '/:id/edges',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const edge = await lineageService.addEdge(req.params.id, req.body);
    res.status(201).json({ data: edge });
  })
);

export default router;