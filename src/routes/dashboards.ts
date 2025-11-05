import express from 'express';
import {
  getDashboards,
  createDashboard,
  getDashboard,
  updateDashboard,
  deleteDashboard,
} from '../controllers/dashboards';

const router = express.Router();

// Get and Create Dashboards
router.get('/', getDashboards).post('/', createDashboard);

// Get, Update and Delete Dashboard
router
  .get('/:id', getDashboard)
  .patch('/:id', updateDashboard)
  .delete('/:id', deleteDashboard);

export default router;
