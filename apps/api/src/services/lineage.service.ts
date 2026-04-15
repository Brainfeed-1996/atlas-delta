import type { LineageGraph, LineageNode, LineageEdge } from '@atlas-delta/models';
import prisma from '../lib/prisma.js';
import { NotFoundError } from '../middleware/error.js';

export class LineageService {
  async findAll(): Promise<LineageGraph[]> {
    const graphs = await prisma.lineageGraph.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        nodes: true,
        edges: true
      }
    });
    return graphs as LineageGraph[];
  }

  async findById(id: string): Promise<LineageGraph> {
    const graph = await prisma.lineageGraph.findUnique({
      where: { id },
      include: {
        nodes: true,
        edges: true
      }
    });

    if (!graph) {
      throw new NotFoundError('LineageGraph');
    }

    return graph as LineageGraph;
  }

  async create(data: { name: string }): Promise<LineageGraph> {
    const graph = await prisma.lineageGraph.create({
      data: { name: data.name },
      include: { nodes: true, edges: true }
    });

    return graph as LineageGraph;
  }

  async addNode(
    graphId: string,
    data: {
      datasetId?: string;
      transformationId?: string;
      nodeType: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<LineageNode> {
    await this.findById(graphId);

    const node = await prisma.lineageNode.create({
      data: {
        graphId,
        datasetId: data.datasetId,
        transformationId: data.transformationId,
        nodeType: data.nodeType,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null
      }
    });

    return node as LineageNode;
  }

  async addEdge(
    graphId: string,
    data: {
      sourceNodeId: string;
      targetNodeId: string;
      edgeType: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<LineageEdge> {
    await this.findById(graphId);

    const [sourceNode, targetNode] = await Promise.all([
      prisma.lineageNode.findUnique({ where: { id: data.sourceNodeId } }),
      prisma.lineageNode.findUnique({ where: { id: data.targetNodeId } })
    ]);

    if (!sourceNode || !targetNode) {
      throw new NotFoundError('LineageNode');
    }

    if (sourceNode.graphId !== graphId || targetNode.graphId !== graphId) {
      throw new NotFoundError('LineageNode');
    }

    const edge = await prisma.lineageEdge.create({
      data: {
        graphId,
        sourceNodeId: data.sourceNodeId,
        targetNodeId: data.targetNodeId,
        edgeType: data.edgeType,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null
      }
    });

    return edge as LineageEdge;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await prisma.lineageGraph.delete({ where: { id } });
  }
}

export const lineageService = new LineageService();