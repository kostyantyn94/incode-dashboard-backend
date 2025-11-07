import express from 'express';
import {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  reorderTask,
} from '../controllers/tasks';
import { validate } from '../middleware/validate';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  reorderTaskSchema,
} from '../validators/schemas';

const router = express.Router();

// Create Task
router.post('/', validate(createTaskSchema), createTask);

// Reorder Task
router.patch('/reorder', validate(reorderTaskSchema), reorderTask);

// Get, Update and Delete Task
router
  .get('/:id', validate(taskIdSchema), getTask)
  .patch('/:id', validate(updateTaskSchema), updateTask)
  .delete('/:id', validate(taskIdSchema), deleteTask);

export default router;
