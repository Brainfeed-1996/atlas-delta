import type { Request, Response } from 'express';
import { datasetService } from '../services/dataset.service.js';
import { asyncHandler } from '../middleware/error.js';
import { validate, idParamSchema, paginationSchema, datasetCreateSchema, datasetUpdateSchema } from '../middleware/validation.js';

export class DatasetController {
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await datasetService.findAll(page, limit);

    res.json({
      data: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const dataset = await datasetService.findById(req.params.id);
    res.json({ data: dataset });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const dataset = await datasetService.create(req.body);
    res.status(201).json({ data: dataset });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const dataset = await datasetService.update(req.params.id, req.body);
    res.json({ data: dataset });
  });

  delete = asyncHandler(async (_req: Request, res: Response) => {
    await datasetService.delete(res.locals.id);
    res.status(204).send();
  });

  getMetrics = asyncHandler(async (_req: Request, res: Response) => {
    const metrics = await datasetService.getMetrics();
    res.json({ data: metrics });
  });

  getSnapshots = asyncHandler(async (req: Request, res: Response) => {
    const snapshots = await datasetService.getSnapshots(req.params.id);
    res.json({ data: snapshots });
  });

  createSnapshot = asyncHandler(async (req: Request, res: Response) => {
    const snapshot = await datasetService.createSnapshot(req.params.id);
    res.status(201).json({ data: snapshot });
  });
}

export const datasetController = new DatasetController();

export const datasetRouter = [
  validate({ params: idParamSchema }),
  datasetController.getById
];

export const datasetRoutes = {
  'GET /': datasetController.getAll,
  'POST /': validate({ body: datasetCreateSchema }), datasetController.create,
  'GET /:id': datasetController.getById,
  'PUT /:id': validate({ body: datasetUpdateSchema }), datasetController.update,
  'DELETE /:id': datasetController.delete,
  'GET /metrics': datasetController.getMetrics,
  'GET /:id/snapshots': datasetController.getSnapshots,
  'POST /:id/snapshots': datasetController.createSnapshot
};