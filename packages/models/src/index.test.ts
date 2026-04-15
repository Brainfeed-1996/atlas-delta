import { describe, it, expect } from 'vitest';
import { 
  DatasetSchema, 
  TransformationSchema, 
  PipelineSchema,
  QualityCheckSchema,
  FreshnessLevelEnum
} from '../src/index';

describe('Domain Models', () => {
  describe('DatasetSchema', () => {
    it('should validate a valid dataset', () => {
      const validDataset = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'test-dataset',
        status: 'active',
        sourceType: 'api',
        freshness: 'fresh',
        recordCount: 1000,
        sizeBytes: 1024000,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      expect(() => DatasetSchema.parse(validDataset)).not.toThrow();
    });

    it('should reject invalid dataset', () => {
      const invalidDataset = {
        id: 'not-a-uuid',
        name: '',
        status: 'invalid',
        sourceType: 'invalid',
        freshness: 'fresh',
        recordCount: -1,
        sizeBytes: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      expect(() => DatasetSchema.parse(invalidDataset)).toThrow();
    });

    it('should allow all freshness levels', () => {
      const levels = FreshnessLevelEnum.enum;
      expect(['fresh', 'stale', 'critical']).toContain(levels.fresh);
      expect(['fresh', 'stale', 'critical']).toContain(levels.stale);
      expect(['fresh', 'stale', 'critical']).toContain(levels.critical);
    });
  });

  describe('TransformationSchema', () => {
    it('should validate a valid transformation', () => {
      const validTransformation = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'test-transformation',
        type: 'filter',
        config: { field: 'status', operator: 'equals', value: 'active' },
        isEnabled: true,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      expect(() => TransformationSchema.parse(validTransformation)).not.toThrow();
    });
  });

  describe('PipelineSchema', () => {
    it('should validate a valid pipeline', () => {
      const validPipeline = {
        id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'test-pipeline',
        isActive: true,
        datasetIds: [],
        transformationIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      expect(() => PipelineSchema.parse(validPipeline)).not.toThrow();
    });
  });

  describe('QualityCheckSchema', () => {
    it('should validate a quality check', () => {
      const validCheck = {
        id: '123e4567-e89b-12d3-a456-426614174003',
        datasetId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'check-not-null',
        ruleType: 'not_null',
        ruleConfig: { field: 'email' },
        status: 'passed',
        executedAt: new Date()
      };
      
      expect(() => QualityCheckSchema.parse(validCheck)).not.toThrow();
    });
  });
});