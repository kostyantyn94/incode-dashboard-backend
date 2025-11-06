import { z } from 'zod';
import { TaskStatus, TaskPriority } from '../../generated/prisma';

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
    id: z.string().regex(/^\d+$/, 'Invalid ID format'),
  }),
});

// Schema for dashboard ID param
export const dashboardIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid ID format'),
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
    dashboardId: z
      .number()
      .int()
      .positive('Dashboard ID must be a positive integer'),
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

// Schema for task ID param
export const taskIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid ID format'),
  }),
});
