import type { Dataset } from '@atlas-delta/models';
import prisma from '../lib/prisma.js';
import { NotFoundError } from '../middleware/error.js';

export class DatasetService {
  async findAll(page: number = 1, limit: number = 20): Promise<{ data: Dataset[]; total: number }> {
    const [datasets, total] = await Promise.all([
      prisma.dataset.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.dataset.count()
    ]);

    return { data: datasets as Dataset[], total };
  }

  async findById(id: string): Promise<Dataset> {
    const dataset = await prisma.dataset.findUnique({
      where: { id }
    });

    if (!dataset) {
      throw new NotFoundError('Dataset');
    }

    return dataset as Dataset;
  }

  async create(data: {
    name: string;
    description?: string;
    sourceType: string;
    sourceConfig?: Record<string, unknown>;
    schema?: Record<string, unknown>;
  }): Promise<Dataset> {
    const dataset = await prisma.dataset.create({
      data: {
        name: data.name,
        description: data.description,
        sourceType: data.sourceType,
        sourceConfig: data.sourceConfig ? JSON.stringify(data.sourceConfig) : null,
        schema: data.schema ? JSON.stringify(data.schema) : null,
        status: 'active',
        freshness: 'fresh',
        recordCount: 0,
        sizeBytes: 0
      }
    });

    return dataset as Dataset;
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      status: string;
      sourceConfig: Record<string, unknown>;
      schema: Record<string, unknown>;
      freshness: string;
      recordCount: number;
      sizeBytes: number;
    }>
  ): Promise<Dataset> {
    await this.findById(id);

    const updateData: Record<string, unknown> = { ...data };
    if (data.sourceConfig) {
      updateData.sourceConfig = JSON.stringify(data.sourceConfig);
    }
    if (data.schema) {
      updateData.schema = JSON.stringify(data.schema);
    }

    const dataset = await prisma.dataset.update({
      where: { id },
      data: updateData
    });

    return dataset as Dataset;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await prisma.dataset.delete({ where: { id } });
  }

  async getMetrics(): Promise<{
    total: number;
    fresh: number;
    stale: number;
    critical: number;
    totalRecords: number;
    totalSize: number;
  }> {
    const datasets = await prisma.dataset.findMany({
      select: {
        freshness: true,
        recordCount: true,
        sizeBytes: true
      }
    });

    return {
      total: datasets.length,
      fresh: datasets.filter((d) => d.freshness === 'fresh').length,
      stale: datasets.filter((d) => d.freshness === 'stale').length,
      critical: datasets.filter((d) => d.freshness === 'critical').length,
      totalRecords: datasets.reduce((sum, d) => sum + d.recordCount, 0),
      totalSize: datasets.reduce((sum, d) => sum + d.sizeBytes, 0)
    };
  }

  async getSnapshots(datasetId: string): Promise<Array<{
    id: string;
    version: number;
    checksum: string;
    recordCount: number;
    sizeBytes: number;
    createdAt: Date;
  }>> {
    await this.findById(datasetId);

    return prisma.datasetSnapshot.findMany({
      where: { datasetId },
      orderBy: { version: 'desc' },
      take: 50
    });
  }

  async createSnapshot(datasetId: string): Promise<{ id: string; version: number }> {
    const dataset = await this.findById(datasetId);

    const latestSnapshot = await prisma.datasetSnapshot.findFirst({
      where: { datasetId },
      orderBy: { version: 'desc' }
    });

    const newVersion = (latestSnapshot?.version ?? 0) + 1;
    const checksum = `sha256-${Date.now()}`;

    const snapshot = await prisma.datasetSnapshot.create({
      data: {
        datasetId,
        version: newVersion,
        checksum,
        recordCount: dataset.recordCount,
        sizeBytes: dataset.sizeBytes,
        storagePath: `/snapshots/${datasetId}/v${newVersion}`
      }
    });

    return { id: snapshot.id, version: snapshot.version };
  }
}

export const datasetService = new DatasetService();