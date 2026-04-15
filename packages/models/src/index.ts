import { z } from 'zod';

export const DatasetStatusEnum = z.enum(['active', 'deprecated', 'archived']);
export type DatasetStatus = z.infer<typeof DatasetStatusEnum>;

export const FreshnessLevelEnum = z.enum(['fresh', 'stale', 'critical']);
export type FreshnessLevel = z.infer<typeof FreshnessLevelEnum>;

export const DataSourceTypeEnum = z.enum([
  'api',
  'database',
  'file',
  'stream',
  'webhook'
]);
export type DataSourceType = z.infer<typeof DataSourceTypeEnum>;

export const TransformationTypeEnum = z.enum([
  'filter',
  'aggregate',
  'enrich',
  'validate',
  'normalize',
  'join'
]);
export type TransformationType = z.infer<typeof TransformationTypeEnum>;

export const QualityCheckStatusEnum = z.enum(['passed', 'failed', 'warning']);
export type QualityCheckStatus = z.infer<typeof QualityCheckStatusEnum>;

export const DatasetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  status: DatasetStatusEnum,
  sourceType: DataSourceTypeEnum,
  sourceConfig: z.record(z.string(), z.unknown()).optional(),
  schema: z.record(z.string(), z.unknown()).optional(),
  freshness: FreshnessLevelEnum,
  recordCount: z.number().int().min(0),
  sizeBytes: z.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastIngestedAt: z.date().optional(),
  lastTransformedAt: z.date().optional()
});
export type Dataset = z.infer<typeof DatasetSchema>;

export const DataSourceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: DataSourceEnum,
  connectionString: z.string().optional(),
  credentialsRef: z.string().optional(),
  config: z.record(z.string(), z.unknown()).optional(),
  isActive: z.boolean(),
  lastSyncAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type DataSource = z.infer<typeof DataSourceSchema>;

export const DataSourceEnum = z.enum(['api', 'database', 'file', 'stream', 'webhook']);

export const TransformationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  type: TransformationTypeEnum,
  config: z.record(z.string(), z.unknown()),
  inputDatasetIds: z.array(z.string().uuid()),
  outputDatasetId: z.string().uuid().optional(),
  isEnabled: z.boolean(),
  order: z.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type Transformation = z.infer<typeof TransformationSchema>;

export const LineageNodeSchema = z.object({
  id: z.string().uuid(),
  datasetId: z.string().uuid(),
  transformationId: z.string().uuid().optional(),
  nodeType: z.enum(['source', 'transformation', 'dataset']),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.date()
});
export type LineageNode = z.infer<typeof LineageNodeSchema>;

export const LineageEdgeSchema = z.object({
  id: z.string().uuid(),
  sourceNodeId: z.string().uuid(),
  targetNodeId: z.string().uuid(),
  edgeType: z.enum(['data_flow', 'dependency']),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.date()
});
export type LineageEdge = z.infer<typeof LineageEdgeSchema>;

export const LineageGraphSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  nodes: z.array(LineageNodeSchema),
  edges: z.array(LineageEdgeSchema),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type LineageGraph = z.infer<typeof LineageGraphSchema>;

export const DatasetSnapshotSchema = z.object({
  id: z.string().uuid(),
  datasetId: z.string().uuid(),
  version: z.number().int().min(1),
  checksum: z.string(),
  recordCount: z.number().int().min(0),
  sizeBytes: z.number().int().min(0),
  storagePath: z.string(),
  createdAt: z.date(),
  createdBy: z.string().optional()
});
export type DatasetSnapshot = z.infer<typeof DatasetSnapshotSchema>;

export const QualityCheckSchema = z.object({
  id: z.string().uuid(),
  datasetId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  ruleType: z.enum(['not_null', 'unique', 'range', 'regex', 'custom']),
  ruleConfig: z.record(z.string(), z.unknown()),
  status: QualityCheckStatusEnum,
  failedRecords: z.number().int().min(0).optional(),
  totalRecords: z.number().int().min(0).optional(),
  executedAt: z.date(),
  errorMessage: z.string().optional()
});
export type QualityCheck = z.infer<typeof QualityCheckSchema>;

export const PipelineSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  schedule: z.string().optional(),
  isActive: z.boolean(),
  datasetIds: z.array(z.string().uuid()),
  transformationIds: z.array(z.string().uuid()),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type Pipeline = z.infer<typeof PipelineSchema>;

export const PipelineRunSchema = z.object({
  id: z.string().uuid(),
  pipelineId: z.string().uuid(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']),
  startedAt: z.date(),
  completedAt: z.date().optional(),
  errorMessage: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});
export type PipelineRun = z.infer<typeof PipelineRunSchema>;

export const AlertSchema = z.object({
  id: z.string().uuid(),
  datasetId: z.string().uuid().optional(),
  pipelineId: z.string().uuid().optional(),
  severity: z.enum(['info', 'warning', 'error', 'critical']),
  title: z.string().min(1).max(255),
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.date()
});
export type Alert = z.infer<typeof AlertSchema>;

export const MetricsSchema = z.object({
  totalDatasets: z.number().int().min(0),
  freshDatasets: z.number().int().min(0),
  staleDatasets: z.number().int().min(0),
  criticalDatasets: z.number().int().min(0),
  totalRecords: z.number().int().min(0),
  totalSizeBytes: z.number().int().min(0),
  activePipelines: z.number().int().min(0),
  recentAlerts: z.number().int().min(0),
  lastUpdated: z.date()
});
export type Metrics = z.infer<typeof MetricsSchema>;

export interface IDatasetRepository {
  findAll(): Promise<Dataset[]>;
  findById(id: string): Promise<Dataset | null>;
  create(data: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dataset>;
  update(id: string, data: Partial<Dataset>): Promise<Dataset>;
  delete(id: string): Promise<void>;
}

export interface ILineageRepository {
  findGraphById(id: string): Promise<LineageGraph | null>;
  createGraph(data: Omit<LineageGraph, 'id' | 'createdAt' | 'updatedAt'>): Promise<LineageGraph>;
  addNode(graphId: string, node: Omit<LineageNode, 'id' | 'createdAt'>): Promise<LineageNode>;
  addEdge(graphId: string, edge: Omit<LineageEdge, 'id' | 'createdAt'>): Promise<LineageEdge>;
}

export interface IPipelineRepository {
  findAll(): Promise<Pipeline[]>;
  findById(id: string): Promise<Pipeline | null>;
  create(data: Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pipeline>;
  update(id: string, data: Partial<Pipeline>): Promise<Pipeline>;
  delete(id: string): Promise<void>;
  createRun(run: Omit<PipelineRun, 'id'>): Promise<PipelineRun>;
  getRuns(pipelineId: string): Promise<PipelineRun[]>;
}