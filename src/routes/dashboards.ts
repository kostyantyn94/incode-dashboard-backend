import express from 'express';
import {
  getDashboards,
  createDashboard,
  getDashboard,
  updateDashboard,
  deleteDashboard,
} from '../controllers/dashboards';
import { validate } from '../middleware/validate';
import {
  createDashboardSchema,
  updateDashboardSchema,
  dashboardIdSchema,
} from '../validators/schemas';

const router = express.Router();

// Get and Create Dashboards
router
  .get('/', getDashboards)
  .post('/', validate(createDashboardSchema), createDashboard);
// Get, Update and Delete Dashboard
router
  .get('/:id', validate(dashboardIdSchema), getDashboard)
  .patch('/:id', validate(updateDashboardSchema), updateDashboard)
  .delete('/:id', validate(dashboardIdSchema), deleteDashboard);

export default router;
