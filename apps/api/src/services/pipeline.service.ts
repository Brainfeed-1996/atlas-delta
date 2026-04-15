import type { Pipeline, PipelineRun } from '@atlas-delta/models';
import prisma from '../lib/prisma.js';
import { NotFoundError } from '../middleware/error.js';

export class PipelineService {
  async findAll(): Promise<Pipeline[]> {
    const pipelines = await prisma.pipeline.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        datasets: true,
        transformations: true,
        _count: { select: { runs: true } }
      }
    });
    return pipelines as Pipeline[];
  }

  async findById(id: string): Promise<Pipeline> {
    const pipeline = await prisma.pipeline.findUnique({
      where: { id },
      include: {
        datasets: true,
        transformations: true,
        runs: { orderBy: { startedAt: 'desc' }, take: 10 }
      }
    });

    if (!pipeline) {
      throw new NotFoundError('Pipeline');
    }

    return pipeline as Pipeline;
  }

  async create(data: {
    name: string;
    description?: string;
    schedule?: string;
    isActive?: boolean;
    datasetIds?: string[];
    transformationIds?: string[];
  }): Promise<Pipeline> {
    const pipeline = await prisma.pipeline.create({
      data: {
        name: data.name,
        description: data.description,
        schedule: data.schedule,
        isActive: data.isActive ?? true,
        datasets: data.datasetIds
          ? { connect: data.datasetIds.map((id) => ({ id })) }
          : undefined,
        transformations: data.transformationIds
          ? { connect: data.transformationIds.map((id) => ({ id })) }
          : undefined
      },
      include: {
        datasets: true,
        transformations: true
      }
    });

    return pipeline as Pipeline;
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      schedule: string;
      isActive: boolean;
      datasetIds: string[];
      transformationIds: string[];
    }>
  ): Promise<Pipeline> {
    await this.findById(id);

    const updateData: Record<string, unknown> = {};

    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.schedule !== undefined) updateData.schedule = data.schedule;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    if (data.datasetIds) {
      updateData.datasets = {
        set: data.datasetIds.map((id) => ({ id }))
      };
    }
    if (data.transformationIds) {
      updateData.transformations = {
        set: data.transformationIds.map((id) => ({ id }))
      };
    }

    const pipeline = await prisma.pipeline.update({
      where: { id },
      data: updateData,
      include: {
        datasets: true,
        transformations: true
      }
    });

    return pipeline as Pipeline;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await prisma.pipeline.delete({ where: { id } });
  }

  async triggerRun(id: string): Promise<PipelineRun> {
    const pipeline = await this.findById(id);

    const run = await prisma.pipelineRun.create({
      data: {
        pipelineId: pipeline.id,
        status: 'running'
      }
    });

    setTimeout(async () => {
      try {
        await prisma.pipelineRun.update({
          where: { id: run.id },
          data: {
            status: 'completed',
            completedAt: new Date()
          }
        });
      } catch (_error) {
        await prisma.pipelineRun.update({
          where: { id: run.id },
          data: {
            status: 'failed',
            completedAt: new Date(),
            errorMessage: 'Execution completed with errors'
          }
        });
      }
    }, 2000);

    return run as PipelineRun;
  }

  async getRuns(pipelineId: string): Promise<PipelineRun[]> {
    await this.findById(pipelineId);

    const runs = await prisma.pipelineRun.findMany({
      where: { pipelineId },
      orderBy: { startedAt: 'desc' },
      take: 50
    });

    return runs as PipelineRun[];
  }
}

export const pipelineService = new PipelineService();