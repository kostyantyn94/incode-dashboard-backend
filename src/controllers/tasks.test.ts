import { Request, Response } from 'express';
import {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  reorderTask,
} from './tasks';

// Mock the hashids module
jest.mock('../utils/hashids', () => ({
  hashids: {
    encode: jest.fn((id: number) => `hash_${id}`),
  },
}));

// Mock Prisma Client
jest.mock('../../generated/prisma', () => {
  const mockDashboard = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockTask = {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $extends: jest.fn().mockReturnValue({
        dashboard: mockDashboard,
        task: mockTask,
      }),
    })),
    TaskStatus: {
      TODO: 'TODO',
      IN_PROGRESS: 'IN_PROGRESS',
      DONE: 'DONE',
    },
    TaskPriority: {
      LOW: 'LOW',
      MEDIUM: 'MEDIUM',
      HIGH: 'HIGH',
    },
  };
});

// Get reference to mocks for testing
const { PrismaClient } = require('../../generated/prisma');
const prismaInstance = new PrismaClient();
const { task: mockTask } = prismaInstance.$extends();

describe('Task Controllers', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    res = {
      status: statusMock as unknown as Response['status'],
      locals: {},
    };
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('creates a task with calculated position when no previous tasks exist', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        dashboardId: 1,
        status: 'TODO',
      };

      res.locals = {
        validated: {
          body: taskData,
        },
      };

      const createdTask = {
        id: 1,
        ...taskData,
        position: 1024,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTask.findFirst.mockResolvedValue(null);
      mockTask.create.mockResolvedValue(createdTask as unknown);

      await createTask(req as Request, res as Response);

      expect(mockTask.findFirst).toHaveBeenCalledWith({
        where: { dashboardId: 1, status: 'TODO' },
        orderBy: { position: 'desc' },
        select: { position: true },
      });
      expect(mockTask.create).toHaveBeenCalledWith({
        data: { ...taskData, position: 1024 },
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        ...createdTask,
        dashboardId: 'hash_1',
      });
    });

    it('creates a task with calculated position when previous tasks exist', async () => {
      const taskData = {
        title: 'New Task',
        dashboardId: 1,
        status: 'TODO',
      };

      res.locals = {
        validated: {
          body: taskData,
        },
      };

      const lastTask = { position: 2048 };
      const createdTask = {
        id: 2,
        ...taskData,
        position: 3072,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTask.findFirst.mockResolvedValue(lastTask as unknown);
      mockTask.create.mockResolvedValue(createdTask as unknown);

      await createTask(req as Request, res as Response);

      expect(mockTask.create).toHaveBeenCalledWith({
        data: { ...taskData, position: 3072 },
      });
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('handles errors and returns 500 status', async () => {
      const error = new Error('Database error');
      res.locals = {
        validated: {
          body: { title: 'New Task', dashboardId: 1, status: 'TODO' },
        },
      };

      mockTask.findFirst.mockResolvedValue(null);
      mockTask.create.mockRejectedValue(error);

      await createTask(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error });
    });
  });

  describe('getTask', () => {
    it('returns a task by ID', async () => {
      const taskData = {
        id: 1,
        title: 'Task 1',
        description: 'Description',
        dashboardId: 1,
        status: 'TODO',
        position: 1024,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      res.locals = {
        validated: {
          params: { id: '1' },
        },
      };

      mockTask.findFirst.mockResolvedValue(taskData as unknown);

      await getTask(req as Request, res as Response);

      expect(mockTask.findFirst).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(taskData);
    });

    it('handles errors and returns 500 status', async () => {
      const error = new Error('Database error');
      res.locals = {
        validated: {
          params: { id: '1' },
        },
      };

      mockTask.findFirst.mockRejectedValue(error);

      await getTask(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error });
    });
  });

  describe('updateTask', () => {
    it('updates a task and returns it', async () => {
      const updateData = { title: 'Updated Task' };
      const updatedTask = {
        id: 1,
        title: 'Updated Task',
        description: 'Description',
        dashboardId: 1,
        status: 'TODO',
        position: 1024,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      res.locals = {
        validated: {
          body: updateData,
          params: { id: '1' },
        },
      };

      mockTask.update.mockResolvedValue(updatedTask as unknown);

      await updateTask(req as Request, res as Response);

      expect(mockTask.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedTask);
    });

    it('handles errors and returns 500 status', async () => {
      const error = new Error('Database error');
      res.locals = {
        validated: {
          body: { title: 'Updated' },
          params: { id: '1' },
        },
      };

      mockTask.update.mockRejectedValue(error);

      await updateTask(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error });
    });
  });

  describe('deleteTask', () => {
    it('deletes a task and returns it', async () => {
      const deletedTask = {
        id: 1,
        title: 'Deleted Task',
        description: 'Description',
        dashboardId: 1,
        status: 'TODO',
        position: 1024,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      res.locals = {
        validated: {
          params: { id: '1' },
        },
      };

      mockTask.delete.mockResolvedValue(deletedTask as unknown);

      await deleteTask(req as Request, res as Response);

      expect(mockTask.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(deletedTask);
    });

    it('handles errors and returns 500 status', async () => {
      const error = new Error('Database error');
      res.locals = {
        validated: {
          params: { id: '1' },
        },
      };

      mockTask.delete.mockRejectedValue(error);

      await deleteTask(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error });
    });
  });

  describe('reorderTask', () => {
    it('reorders task between two tasks', async () => {
      const reorderData = {
        taskId: 1,
        prevId: 2,
        nextId: 3,
        targetStatus: 'IN_PROGRESS',
      };

      res.locals = {
        validated: {
          body: reorderData,
        },
      };

      const prevTask = { position: 1000 };
      const nextTask = { position: 2000 };
      const updatedTask = {
        id: 1,
        title: 'Task',
        position: 1500,
        status: 'IN_PROGRESS',
      };

      mockTask.findUnique
        .mockResolvedValueOnce(prevTask as unknown)
        .mockResolvedValueOnce(nextTask as unknown);
      mockTask.update.mockResolvedValue(updatedTask as unknown);

      await reorderTask(req as Request, res as Response);

      expect(mockTask.findUnique).toHaveBeenCalledWith({
        where: { id: 2 },
        select: { position: true },
      });
      expect(mockTask.findUnique).toHaveBeenCalledWith({
        where: { id: 3 },
        select: { position: true },
      });
      expect(mockTask.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { position: 1500, status: 'IN_PROGRESS' },
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedTask);
    });

    it('reorders task after previous task (no next)', async () => {
      const reorderData = {
        taskId: 1,
        prevId: 2,
        nextId: null,
      };

      res.locals = {
        validated: {
          body: reorderData,
        },
      };

      const prevTask = { position: 1000 };
      const updatedTask = {
        id: 1,
        title: 'Task',
        position: 2024,
        status: 'TODO',
      };

      mockTask.findUnique.mockResolvedValueOnce(prevTask as unknown);
      mockTask.update.mockResolvedValue(updatedTask as unknown);

      await reorderTask(req as Request, res as Response);

      expect(mockTask.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { position: 2024 },
      });
    });

    it('reorders task before next task (no previous)', async () => {
      const reorderData = {
        taskId: 1,
        prevId: null,
        nextId: 3,
      };

      res.locals = {
        validated: {
          body: reorderData,
        },
      };

      const nextTask = { position: 2000 };
      const updatedTask = {
        id: 1,
        title: 'Task',
        position: 1000,
        status: 'TODO',
      };

      mockTask.findUnique.mockResolvedValueOnce(nextTask as unknown);
      mockTask.update.mockResolvedValue(updatedTask as unknown);

      await reorderTask(req as Request, res as Response);

      expect(mockTask.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { position: 1000 },
      });
    });

    it('reorders task to empty list (no previous or next)', async () => {
      const reorderData = {
        taskId: 1,
        prevId: null,
        nextId: null,
      };

      res.locals = {
        validated: {
          body: reorderData,
        },
      };

      const updatedTask = {
        id: 1,
        title: 'Task',
        position: 1024,
        status: 'TODO',
      };

      mockTask.update.mockResolvedValue(updatedTask as unknown);

      await reorderTask(req as Request, res as Response);

      expect(mockTask.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { position: 1024 },
      });
    });

    it('handles errors and returns 500 status', async () => {
      const error = new Error('Database error');
      res.locals = {
        validated: {
          body: { taskId: 1, prevId: null, nextId: null },
        },
      };

      mockTask.update.mockRejectedValue(error);

      await reorderTask(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error });
    });
  });
});
