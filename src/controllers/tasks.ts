import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import { withAccelerate } from '@prisma/extension-accelerate';
import { hashids } from '../utils/hashids';

const prisma = new PrismaClient().$extends(withAccelerate());

export const createTask = async (req: Request, res: Response) => {
  const data = res.locals.validated.body;
  const hashedDashboardId = hashids.encode(
    res.locals.validated.body.dashboardId,
  );

  const lastTask = await prisma.task.findFirst({
    where: { dashboardId: data.dashboardId, status: data.status },
    orderBy: { position: 'desc' },
    select: { position: true },
  });

  const newPosition = (lastTask?.position ?? 0) + 1024;

  try {
    const newTask = await prisma.task.create({
      data: { ...data, position: newPosition },
    });
    res.status(200).json({ ...newTask, id: hashedDashboardId });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const id = +res.locals.validated.params?.id;
    const task = await prisma.task.findFirst({ where: { id } });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const data = res.locals.validated.body;
    const id = +res.locals.validated.params?.id;
    const task = await prisma.task.update({
      where: { id },
      data,
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = +res.locals.validated.params?.id;
    const task = await prisma.task.delete({
      where: { id },
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const reorderTask = async (req: Request, res: Response) => {
  const { taskId, prevId, nextId, targetStatus } = res.locals.validated.body;

  try {
    const prev = prevId
      ? await prisma.task.findUnique({
          where: { id: prevId },
          select: { position: true },
        })
      : null;

    const next = nextId
      ? await prisma.task.findUnique({
          where: { id: nextId },
          select: { position: true },
        })
      : null;

    let newPosition: number;
    const STEP = 1024;

    if (prev && next)
      newPosition = Math.floor((prev.position + next.position) / 2);
    else if (prev) newPosition = prev.position + STEP;
    else if (next) newPosition = Math.floor(next.position / 2);
    else newPosition = STEP;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        position: newPosition,
        ...(targetStatus && { status: targetStatus }),
      },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
