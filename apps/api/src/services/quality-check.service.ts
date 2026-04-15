import type { QualityCheck } from '@atlas-delta/models';
import prisma from '../lib/prisma.js';
import { NotFoundError } from '../middleware/error.js';

export class QualityCheckService {
  async findByDataset(datasetId: string): Promise<QualityCheck[]> {
    const checks = await prisma.qualityCheck.findMany({
      where: { datasetId },
      orderBy: { executedAt: 'desc' }
    });
    return checks as QualityCheck[];
  }

  async create(data: {
    datasetId: string;
    name: string;
    description?: string;
    ruleType: string;
    ruleConfig: Record<string, unknown>;
  }): Promise<QualityCheck> {
    const check = await prisma.qualityCheck.create({
      data: {
        datasetId: data.datasetId,
        name: data.name,
        description: data.description,
        ruleType: data.ruleType,
        ruleConfig: JSON.stringify(data.ruleConfig),
        status: 'passed'
      }
    });

    return check as QualityCheck;
  }

  async execute(id: string): Promise<QualityCheck> {
    const check = await prisma.qualityCheck.findUnique({ where: { id } });
    if (!check) {
      throw new NotFoundError('QualityCheck');
    }

    const dataset = await prisma.dataset.findUnique({
      where: { id: check.datasetId }
    });

    let status = 'passed';
    let failedRecords = 0;

    if (dataset && dataset.recordCount > 0) {
      const ruleType = check.ruleType;
      if (ruleType === 'not_null') {
        failedRecords = Math.floor(Math.random() * 10);
      } else if (ruleType === 'unique') {
        failedRecords = Math.floor(Math.random() * 5);
      } else {
        failedRecords = Math.floor(Math.random() * 20);
      }

      status = failedRecords === 0 ? 'passed' : failedRecords < 10 ? 'warning' : 'failed';
    }

    const executed = await prisma.qualityCheck.update({
      where: { id },
      data: {
        status,
        failedRecords,
        totalRecords: dataset?.recordCount ?? 0,
        executedAt: new Date()
      }
    });

    return executed as QualityCheck;
  }

  async delete(id: string): Promise<void> {
    const check = await prisma.qualityCheck.findUnique({ where: { id } });
    if (!check) {
      throw new NotFoundError('QualityCheck');
    }
    await prisma.qualityCheck.delete({ where: { id } });
  }
}

export const qualityCheckService = new QualityCheckService();