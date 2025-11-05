import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export const getDashboards = async (req: Request, res: Response) => {
  try {
    const dashboards = await prisma.dashboard.findMany();
    res.status(200).json(dashboards);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const getDashboardTasks = async (req: Request, res: Response) => {
  try {
    const dashboardId = +req.params.id;
    const tasks = await prisma.task.findMany({ where: { dashboardId } });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const createDashboard = async (req: Request, res: Response) => {
  const data = req.body;
  console.log('bodyData', data);

  try {
    const newDashboard = await prisma.dashboard.create({
      data,
    });
    res.status(200).json(newDashboard);
    console.log('New dashboard', newDashboard);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const dashboard = await prisma.dashboard.findUnique({ where: { id: id } });
    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const updateDashboard = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const dashboard = await prisma.dashboard.update({
      where: { id: id },
      data,
    });
    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const deleteDashboard = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const dashboard = await prisma.dashboard.delete({
      where: { id: id },
    });
    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
