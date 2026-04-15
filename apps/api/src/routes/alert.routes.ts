import { Router } from 'express';
import { alertService } from '../services/alert.service.js';
import { asyncHandler } from '../middleware/error.js';
import { validate, idParamSchema } from '../middleware/validation.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const alerts = await alertService.findAll({
      limit: parseInt(req.query.limit as string) || 50,
      unreadOnly: req.query.unreadOnly === 'true'
    });
    res.json({ data: alerts });
  })
);

router.get(
  '/count',
  asyncHandler(async (_req, res) => {
    const count = await alertService.getUnreadCount();
    res.json({ data: { unreadCount: count } });
  })
);

router.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const alert = await alertService.findById(req.params.id);
    res.json({ data: alert });
  })
);

router.patch(
  '/:id/read',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const alert = await alertService.markAsRead(req.params.id);
    res.json({ data: alert });
  })
);

router.post(
  '/read-all',
  asyncHandler(async (_req, res) => {
    const count = await alertService.markAllAsRead();
    res.json({ data: { markedAsRead: count } });
  })
);

router.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    await alertService.delete(req.params.id);
    res.status(204).send();
  })
);

export default router;