import { Request, Response } from 'express';
import {
  getDashboards,
  getDashboard,
  createDashboard,
  updateDashboard,
  deleteDashboard,
} from './dashboards';

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
const { dashboard: mockDashboard, task: mockTask } = prismaInstance.$extends();

describe('Dashboard Controllers', () => {
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

  describe('getDashboards', () => {
    it('returns all dashboards with hashed IDs', async () => {
      const mockDashboards = [
        {
          id: 1,
          title: 'Dashboard 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Dashboard 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockDashboard.findMany.mockResolvedValue(mockDashboards as unknown);

      await getDashboards(req as Request, res as Response);

      expect(mockDashboard.findMany).toHaveBeenCalledWith();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([
        { ...mockDashboards[0], id: 'hash_1' },
        { ...mockDashboards[1], id: 'hash_2' },
      ]);
    });

    it('handles errors and returns 500 status', async () => {
      const error = new Error('Database error');
      mockDashboard.findMany.mockRejectedValue(error);

      await getDashboards(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error });
    });
  });

  describe('getDashboard', () => {
    it('returns dashboard with tasks and hashed ID', async () => {
      const dashboardData = {
        id: 1,
        title: 'My Dashboard',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const tasksData = [
        { id: 1, title: 'Task 1', dashboardId: 1 },
        { id: 2, title: 'Task 2', dashboardId: 1 },
      ];

      res.locals = {
        validated: {
          params: { id: 1 },
        },
      };

      mockDashboard.findUnique.mockResolvedValue(dashboardData as unknown);
      mockTask.findMany.mockResolvedValue(tasksData as unknown);

      await getDashboard(req as Request, res as Response);

      expect(mockDashboard.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockTask.findMany).toHaveBeenCalledWith({
        where: { dashboardId: 1 },
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        dashboard: { ...dashboardData, id: 'hash_1' },
        tasks: tasksData,
      });
    });

    it('handles errors and returns 500 status', async () => {
      const error = new Error('Database error');
      res.locals = {
        validated: {
          params: { id: 1 },
        },
      };

      mockDashboard.findUnique.mockRejectedValue(error);

      await getDashboard(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error });
    });
  });

  describe('createDashboard', () => {
    it('creates a dashboard and returns it with hashed ID', async () => {
      const dashboardData = { title: 'New Dashboard' };
      const createdDashboard = {
        id: 1,
        title: 'New Dashboard',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      res.locals = {
        validated: {
          body: dashboardData,
        },
      };

      mockDashboard.create.mockResolvedValue(createdDashboard as unknown);

      await createDashboard(req as Request, res as Response);

      expect(mockDashboard.create).toHaveBeenCalledWith({
        data: dashboardData,
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        ...createdDashboard,
        id: 'hash_1',
      });
    });

    it('handles errors and returns 500 status', async () => {
      const error = new Error('Database error');
      res.locals = {
        validated: {
          body: { title: 'New Dashboard' },
        },
      };

      mockDashboard.create.mockRejectedValue(error);

      await createDashboard(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error });
    });
  });

  describe('updateDashboard', () => {
    it('updates a dashboard and returns it with hashed ID', async () => {
      const updateData = { title: 'Updated Dashboard' };
      const updatedDashboard = {
        id: 1,
        title: 'Updated Dashboard',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      res.locals = {
        validated: {
          body: updateData,
          params: { id: 1 },
        },
      };

      mockDashboard.update.mockResolvedValue(updatedDashboard as unknown);

      await updateDashboard(req as Request, res as Response);

      expect(mockDashboard.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        ...updatedDashboard,
        id: 'hash_1',
      });
    });

    it('handles errors and returns 500 status', async () => {
      const error = new Error('Database error');
      res.locals = {
        validated: {
          body: { title: 'Updated' },
          params: { id: 1 },
        },
      };

      mockDashboard.update.mockRejectedValue(error);

      await updateDashboard(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error });
    });
  });

  describe('deleteDashboard', () => {
    it('deletes a dashboard and returns it with hashed ID', async () => {
      const deletedDashboard = {
        id: 1,
        title: 'Deleted Dashboard',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      res.locals = {
        validated: {
          params: { id: 1 },
        },
      };

      mockDashboard.delete.mockResolvedValue(deletedDashboard as unknown);

      await deleteDashboard(req as Request, res as Response);

      expect(mockDashboard.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        ...deletedDashboard,
        id: 'hash_1',
      });
    });

    it('handles errors and returns 500 status', async () => {
      const error = new Error('Database error');
      res.locals = {
        validated: {
          params: { id: 1 },
        },
      };

      mockDashboard.delete.mockRejectedValue(error);

      await deleteDashboard(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error });
    });
  });
});
