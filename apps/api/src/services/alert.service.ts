import type { Alert } from '@atlas-delta/models';
import prisma from '../lib/prisma.js';
import { NotFoundError } from '../middleware/error.js';

export class AlertService {
  async findAll(options?: {
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<Alert[]> {
    const alerts = await prisma.alert.findMany({
      where: options?.unreadOnly ? { isRead: false } : undefined,
      orderBy: { createdAt: 'desc' },
      take: options?.limit ?? 50,
      include: {
        dataset: { select: { name: true } },
        pipeline: { select: { name: true } }
      }
    });
    return alerts as Alert[];
  }

  async findById(id: string): Promise<Alert> {
    const alert = await prisma.alert.findUnique({
      where: { id },
      include: {
        dataset: { select: { name: true } },
        pipeline: { select: { name: true } }
      }
    });

    if (!alert) {
      throw new NotFoundError('Alert');
    }

    return alert as Alert;
  }

  async markAsRead(id: string): Promise<Alert> {
    const alert = await prisma.alert.findUnique({ where: { id } });
    if (!alert) {
      throw new NotFoundError('Alert');
    }

    const updated = await prisma.alert.update({
      where: { id },
      data: { isRead: true },
      include: {
        dataset: { select: { name: true } },
        pipeline: { select: { name: true } }
      }
    });

    return updated as Alert;
  }

  async markAllAsRead(): Promise<number> {
    const result = await prisma.alert.updateMany({
      where: { isRead: false },
      data: { isRead: true }
    });

    return result.count;
  }

  async delete(id: string): Promise<void> {
    const alert = await prisma.alert.findUnique({ where: { id } });
    if (!alert) {
      throw new NotFoundError('Alert');
    }
    await prisma.alert.delete({ where: { id } });
  }

  async getUnreadCount(): Promise<number> {
    return prisma.alert.count({ where: { isRead: false } });
  }
}

export const alertService = new AlertService();