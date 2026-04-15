import { z, ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export interface ValidationSchemas {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message
        }));
        res.status(400).json({
          error: 'Validation Error',
          details: errors
        });
        return;
      }
      next(error);
    }
  };
}

export const idParamSchema = z.object({
  id: z.string().uuid()
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export const datasetCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  sourceType: z.enum(['api', 'database', 'file', 'stream', 'webhook']),
  sourceConfig: z.record(z.string(), z.unknown()).optional(),
  schema: z.record(z.string(), z.unknown()).optional()
});

export const datasetUpdateSchema = datasetCreateSchema.partial();

export const transformationCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(['filter', 'aggregate', 'enrich', 'validate', 'normalize', 'join']),
  config: z.record(z.string(), z.unknown()),
  datasetId: z.string().uuid().optional(),
  inputDatasetIds: z.array(z.string().uuid()).optional(),
  isEnabled: z.boolean().default(true),
  order: z.number().int().min(0).default(0)
});

export const pipelineCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  schedule: z.string().optional(),
  isActive: z.boolean().default(true),
  datasetIds: z.array(z.string().uuid()).optional(),
  transformationIds: z.array(z.string().uuid()).optional()
});

export const qualityCheckCreateSchema = z.object({
  datasetId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  ruleType: z.enum(['not_null', 'unique', 'range', 'regex', 'custom']),
  ruleConfig: z.record(z.string(), z.unknown())
});

export const alertUpdateSchema = z.object({
  isRead: z.boolean()
});