import { z } from 'zod';
import { TaskStatus, TaskPriority } from '../../generated/prisma';
import { hashId } from './common';

// Schema for creating the dashboard
export const createDashboardSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  }),
});

// Schema for updating the dashboard
export const updateDashboardSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(255, 'Title is too long')
      .optional(),
  }),
  params: z.object({
    id: hashId,
  }),
});

// Schema for dashboard ID param
export const dashboardIdSchema = z.object({
  params: z.object({
    id: hashId,
  }),
});

// Schema for creating a task
export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
    description: z
      .string()
      .max(1000, 'Description is too long')
      .optional()
      .nullable(),
    priority: z.enum(TaskPriority).optional().nullable(),
    dueDate: z.iso.datetime('Invalid date format').optional().nullable(),
    dashboardId: hashId,
    status: z.enum(TaskStatus).optional(),
  }),
});

// Schema for updating a task
export const updateTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(255, 'Title is too long')
      .optional(),
    description: z
      .string()
      .max(1000, 'Description is too long')
      .optional()
      .nullable(),
    priority: z.enum(TaskPriority).optional().nullable(),
    dueDate: z.iso.datetime('Invalid date format').optional().nullable(),
    dashboardId: z
      .number()
      .int()
      .positive('Dashboard ID must be a positive integer')
      .optional(),
    status: z.enum(TaskStatus).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid ID format'),
  }),
});

// Schema for reordering a task
export const reorderTaskSchema = z.object({
  body: z.object({
    taskId: z.number().int().positive(),
    prevId: z.number().int().positive().optional().nullable(),
    nextId: z.number().int().positive().optional().nullable(),
    targetStatus: z.enum(TaskStatus).optional(),
  }),
});

// Schema for task ID param
export const taskIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid ID format'),
  }),
});
