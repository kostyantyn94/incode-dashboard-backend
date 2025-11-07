import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import { withAccelerate } from '@prisma/extension-accelerate';
import { hashids } from '../utils/hashids';

const prisma = new PrismaClient().$extends(withAccelerate());

export const getDashboards = async (req: Request, res: Response) => {
  try {
    const dashboards = await prisma.dashboard.findMany();
    const hashedDashboards = dashboards.map((dashboard) => {
      return {
        ...dashboard,
        id: hashids.encode(dashboard.id),
      };
    });
    res.status(200).json(hashedDashboards);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const id = res.locals.validated.params?.id;

    const dashboard = await prisma.dashboard.findUnique({
      where: { id },
    });

    const tasks = await prisma.task.findMany({ where: { dashboardId: id } });

    res.status(200).json({
      dashboard: {
        ...dashboard,
        id: hashids.encode(id),
      },
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const createDashboard = async (req: Request, res: Response) => {
  const data = res.locals.validated.body;

  try {
    const newDashboard = await prisma.dashboard.create({
      data,
    });
    const hashedDashboard = {
      ...newDashboard,
      id: hashids.encode(newDashboard.id),
    };
    res.status(200).json(hashedDashboard);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const updateDashboard = async (req: Request, res: Response) => {
  try {
    const data = res.locals.validated.body;
    const id = res.locals.validated.params?.id;
    const dashboard = await prisma.dashboard.update({
      where: { id },
      data,
    });
    res.status(200).json({ ...dashboard, id: hashids.encode(id) });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const deleteDashboard = async (req: Request, res: Response) => {
  try {
    const id = res.locals.validated.params?.id;
    const dashboard = await prisma.dashboard.delete({
      where: { id },
    });
    res.status(200).json({ ...dashboard, id: hashids.encode(id) });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
