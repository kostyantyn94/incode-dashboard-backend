import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export const createTask = async (req: Request, res: Response) => {
  const data = req.body;
  console.log('bodyData', data);

  try {
    const newTask = await prisma.task.create({
      data,
    });
    res.status(200).json(newTask);
    console.log('New dashboard', newTask);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const task = await prisma.task.findFirst({ where: { id: id } });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const task = await prisma.task.update({
      where: { id: id },
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
    const id = +req.params.id;
    const task = await prisma.task.delete({
      where: { id: id },
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
