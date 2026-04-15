export interface Dataset {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'deprecated' | 'archived';
  sourceType: 'api' | 'database' | 'file' | 'stream' | 'webhook';
  sourceConfig?: Record<string, unknown>;
  schema?: Record<string, unknown>;
  freshness: 'fresh' | 'stale' | 'critical';
  recordCount: number;
  sizeBytes: number;
  createdAt: string;
  updatedAt: string;
  lastIngestedAt?: string;
  lastTransformedAt?: string;
}

export interface DatasetSnapshot {
  id: string;
  version: number;
  checksum: string;
  recordCount: number;
  sizeBytes: number;
  createdAt: string;
}

export interface Transformation {
  id: string;
  name: string;
  description?: string;
  type: 'filter' | 'aggregate' | 'enrich' | 'validate' | 'normalize' | 'join';
  config: Record<string, unknown>;
  datasetId?: string;
  inputDatasetIds?: string[];
  isEnabled: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  schedule?: string;
  isActive: boolean;
  datasets?: Dataset[];
  transformations?: Transformation[];
  runs?: PipelineRun[];
  createdAt: string;
  updatedAt: string;
}

export interface PipelineRun {
  id: string;
  pipelineId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface QualityCheck {
  id: string;
  datasetId: string;
  name: string;
  description?: string;
  ruleType: 'not_null' | 'unique' | 'range' | 'regex' | 'custom';
  ruleConfig: Record<string, unknown>;
  status: 'passed' | 'failed' | 'warning';
  failedRecords?: number;
  totalRecords?: number;
  executedAt: string;
  errorMessage?: string;
}

export interface LineageGraph {
  id: string;
  name: string;
  nodes: LineageNode[];
  edges: LineageEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface LineageNode {
  id: string;
  datasetId?: string;
  transformationId?: string;
  nodeType: 'source' | 'transformation' | 'dataset';
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface LineageEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  edgeType: 'data_flow' | 'dependency';
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Alert {
  id: string;
  datasetId?: string;
  pipelineId?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  dataset?: { name: string };
  pipeline?: { name: string };
}

export interface Metrics {
  total: number;
  fresh: number;
  stale: number;
  critical: number;
  totalRecords: number;
  totalSize: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}