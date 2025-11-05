import express from 'express';
import {
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/tasks';

const router = express.Router();

// Create Task
router.post('/', createTask);

// Get, Update and Delete Task
router
  .get('/:id', getTask)
  .patch('/:id', updateTask)
  .delete('/:id', deleteTask);

export default router;
