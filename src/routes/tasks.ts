import express from 'express';
import {
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/tasks';
import { validate } from '../middleware/validate';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
} from '../validators/schemas';

const router = express.Router();

// Create Task
router.post('/', validate(createTaskSchema), createTask);

// Get, Update and Delete Task
router
  .get('/:id', validate(taskIdSchema), getTask)
  .patch('/:id', validate(updateTaskSchema), updateTask)
  .delete('/:id', validate(taskIdSchema), deleteTask);

export default router;
