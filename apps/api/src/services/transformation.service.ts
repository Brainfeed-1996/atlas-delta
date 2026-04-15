import type { Transformation } from '@atlas-delta/models';
import prisma from '../lib/prisma.js';
import { NotFoundError } from '../middleware/error.js';

export class TransformationService {
  async findAll(): Promise<Transformation[]> {
    const transformations = await prisma.transformation.findMany({
      orderBy: { order: 'asc' }
    });
    return transformations as Transformation[];
  }

  async findById(id: string): Promise<Transformation> {
    const transformation = await prisma.transformation.findUnique({
      where: { id }
    });

    if (!transformation) {
      throw new NotFoundError('Transformation');
    }

    return transformation as Transformation;
  }

  async create(data: {
    name: string;
    description?: string;
    type: string;
    config: Record<string, unknown>;
    datasetId?: string;
    inputDatasetIds?: string[];
    isEnabled?: boolean;
    order?: number;
  }): Promise<Transformation> {
    const transformation = await prisma.transformation.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        config: JSON.stringify(data.config),
        datasetId: data.datasetId,
        inputDatasetIds: data.inputDatasetIds ? JSON.stringify(data.inputDatasetIds) : null,
        isEnabled: data.isEnabled ?? true,
        order: data.order ?? 0
      }
    });

    return transformation as Transformation;
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      type: string;
      config: Record<string, unknown>;
      datasetId: string;
      inputDatasetIds: string[];
      isEnabled: boolean;
      order: number;
    }>
  ): Promise<Transformation> {
    await this.findById(id);

    const updateData: Record<string, unknown> = { ...data };
    if (data.config) {
      updateData.config = JSON.stringify(data.config);
    }
    if (data.inputDatasetIds) {
      updateData.inputDatasetIds = JSON.stringify(data.inputDatasetIds);
    }

    const transformation = await prisma.transformation.update({
      where: { id },
      data: updateData
    });

    return transformation as Transformation;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await prisma.transformation.delete({ where: { id } });
  }
}

export const transformationService = new TransformationService();