import {
  createDashboardSchema,
  updateDashboardSchema,
  dashboardIdSchema,
  createTaskSchema,
  updateTaskSchema,
  reorderTaskSchema,
  taskIdSchema,
} from './schemas';
import { hashids } from '../utils/hashids';

describe('Dashboard Schemas', () => {
  describe('createDashboardSchema', () => {
    it('validates a valid dashboard creation request', () => {
      const validData = {
        body: {
          title: 'My Dashboard',
        },
      };
      expect(() => createDashboardSchema.parse(validData)).not.toThrow();
    });

    it('rejects missing title', () => {
      const invalidData = {
        body: {},
      };
      expect(() => createDashboardSchema.parse(invalidData)).toThrow();
    });

    it('rejects empty title', () => {
      const invalidData = {
        body: {
          title: '',
        },
      };
      expect(() => createDashboardSchema.parse(invalidData)).toThrow(
        'Title is required',
      );
    });

    it('rejects title that is too long', () => {
      const invalidData = {
        body: {
          title: 'a'.repeat(256),
        },
      };
      expect(() => createDashboardSchema.parse(invalidData)).toThrow(
        'Title is too long',
      );
    });

    it('accepts title at maximum length', () => {
      const validData = {
        body: {
          title: 'a'.repeat(255),
        },
      };
      expect(() => createDashboardSchema.parse(validData)).not.toThrow();
    });
  });

  describe('updateDashboardSchema', () => {
    it('validates a valid dashboard update request', () => {
      const hashedId = hashids.encode(123);
      const validData = {
        body: {
          title: 'Updated Dashboard',
        },
        params: {
          id: hashedId,
        },
      };
      const result = updateDashboardSchema.parse(validData);
      expect(result.params.id).toBe(123);
      expect(result.body.title).toBe('Updated Dashboard');
    });

    it('allows update without title (optional)', () => {
      const hashedId = hashids.encode(123);
      const validData = {
        body: {},
        params: {
          id: hashedId,
        },
      };
      expect(() => updateDashboardSchema.parse(validData)).not.toThrow();
    });

    it('rejects empty title when provided', () => {
      const hashedId = hashids.encode(123);
      const invalidData = {
        body: {
          title: '',
        },
        params: {
          id: hashedId,
        },
      };
      expect(() => updateDashboardSchema.parse(invalidData)).toThrow(
        'Title is required',
      );
    });

    it('rejects title that is too long', () => {
      const hashedId = hashids.encode(123);
      const invalidData = {
        body: {
          title: 'a'.repeat(256),
        },
        params: {
          id: hashedId,
        },
      };
      expect(() => updateDashboardSchema.parse(invalidData)).toThrow(
        'Title is too long',
      );
    });

    it('rejects invalid hash ID format', () => {
      const invalidData = {
        body: {
          title: 'Updated',
        },
        params: {
          id: 'invalid-id',
        },
      };
      expect(() => updateDashboardSchema.parse(invalidData)).toThrow(
        'Invalid ID format',
      );
    });
  });

  describe('dashboardIdSchema', () => {
    it('validates a valid dashboard ID param', () => {
      const hashedId = hashids.encode(456);
      const validData = {
        params: {
          id: hashedId,
        },
      };
      const result = dashboardIdSchema.parse(validData);
      expect(result.params.id).toBe(456);
    });

    it('rejects invalid hash ID', () => {
      const invalidData = {
        params: {
          id: 'invalid@id',
        },
      };
      expect(() => dashboardIdSchema.parse(invalidData)).toThrow();
    });
  });
});

describe('Task Schemas', () => {
  describe('createTaskSchema', () => {
    const validDashboardId = hashids.encode(1);

    it('validates a valid task creation request with all fields', () => {
      const validData = {
        body: {
          title: 'My Task',
          description: 'Task description',
          priority: 'HIGH',
          dueDate: '2024-12-31T23:59:59.000Z',
          dashboardId: validDashboardId,
          status: 'TODO',
        },
      };
      const result = createTaskSchema.parse(validData);
      expect(result.body.title).toBe('My Task');
      expect(result.body.dashboardId).toBe(1);
    });

    it('validates a minimal valid task creation request', () => {
      const validData = {
        body: {
          title: 'My Task',
          dashboardId: validDashboardId,
        },
      };
      expect(() => createTaskSchema.parse(validData)).not.toThrow();
    });

    it('rejects missing title', () => {
      const invalidData = {
        body: {
          dashboardId: validDashboardId,
        },
      };
      expect(() => createTaskSchema.parse(invalidData)).toThrow();
    });

    it('rejects empty title', () => {
      const invalidData = {
        body: {
          title: '',
          dashboardId: validDashboardId,
        },
      };
      expect(() => createTaskSchema.parse(invalidData)).toThrow(
        'Title is required',
      );
    });

    it('rejects title that is too long', () => {
      const invalidData = {
        body: {
          title: 'a'.repeat(256),
          dashboardId: validDashboardId,
        },
      };
      expect(() => createTaskSchema.parse(invalidData)).toThrow(
        'Title is too long',
      );
    });

    it('rejects description that is too long', () => {
      const invalidData = {
        body: {
          title: 'Task',
          description: 'a'.repeat(1001),
          dashboardId: validDashboardId,
        },
      };
      expect(() => createTaskSchema.parse(invalidData)).toThrow(
        'Description is too long',
      );
    });

    it('accepts description at maximum length', () => {
      const validData = {
        body: {
          title: 'Task',
          description: 'a'.repeat(1000),
          dashboardId: validDashboardId,
        },
      };
      expect(() => createTaskSchema.parse(validData)).not.toThrow();
    });

    it('accepts null description', () => {
      const validData = {
        body: {
          title: 'Task',
          description: null,
          dashboardId: validDashboardId,
        },
      };
      expect(() => createTaskSchema.parse(validData)).not.toThrow();
    });

    it('validates all priority values', () => {
      const priorities = ['LOW', 'MEDIUM', 'HIGH'];
      priorities.forEach((priority) => {
        const validData = {
          body: {
            title: 'Task',
            priority,
            dashboardId: validDashboardId,
          },
        };
        expect(() => createTaskSchema.parse(validData)).not.toThrow();
      });
    });

    it('rejects invalid priority', () => {
      const invalidData = {
        body: {
          title: 'Task',
          priority: 'URGENT',
          dashboardId: validDashboardId,
        },
      };
      expect(() => createTaskSchema.parse(invalidData)).toThrow();
    });

    it('validates all status values', () => {
      const statuses = ['TODO', 'IN_PROGRESS', 'DONE'];
      statuses.forEach((status) => {
        const validData = {
          body: {
            title: 'Task',
            status,
            dashboardId: validDashboardId,
          },
        };
        expect(() => createTaskSchema.parse(validData)).not.toThrow();
      });
    });

    it('rejects invalid status', () => {
      const invalidData = {
        body: {
          title: 'Task',
          status: 'COMPLETED',
          dashboardId: validDashboardId,
        },
      };
      expect(() => createTaskSchema.parse(invalidData)).toThrow();
    });

    it('validates ISO datetime format for dueDate', () => {
      const validData = {
        body: {
          title: 'Task',
          dueDate: '2024-12-31T23:59:59.000Z',
          dashboardId: validDashboardId,
        },
      };
      expect(() => createTaskSchema.parse(validData)).not.toThrow();
    });

    it('rejects invalid date format', () => {
      const invalidData = {
        body: {
          title: 'Task',
          dueDate: '2024-12-31',
          dashboardId: validDashboardId,
        },
      };
      expect(() => createTaskSchema.parse(invalidData)).toThrow(
        'Invalid date format',
      );
    });

    it('accepts null dueDate', () => {
      const validData = {
        body: {
          title: 'Task',
          dueDate: null,
          dashboardId: validDashboardId,
        },
      };
      expect(() => createTaskSchema.parse(validData)).not.toThrow();
    });

    it('rejects missing dashboardId', () => {
      const invalidData = {
        body: {
          title: 'Task',
        },
      };
      expect(() => createTaskSchema.parse(invalidData)).toThrow();
    });

    it('rejects invalid dashboardId format', () => {
      const invalidData = {
        body: {
          title: 'Task',
          dashboardId: 'invalid-id',
        },
      };
      expect(() => createTaskSchema.parse(invalidData)).toThrow();
    });
  });

  describe('updateTaskSchema', () => {
    it('validates a valid task update request with all fields', () => {
      const validData = {
        body: {
          title: 'Updated Task',
          description: 'Updated description',
          priority: 'LOW',
          dueDate: '2024-12-31T23:59:59.000Z',
          dashboardId: 2,
          status: 'IN_PROGRESS',
        },
        params: {
          id: '123',
        },
      };
      expect(() => updateTaskSchema.parse(validData)).not.toThrow();
    });

    it('validates an empty update request', () => {
      const validData = {
        body: {},
        params: {
          id: '123',
        },
      };
      expect(() => updateTaskSchema.parse(validData)).not.toThrow();
    });

    it('rejects empty title when provided', () => {
      const invalidData = {
        body: {
          title: '',
        },
        params: {
          id: '123',
        },
      };
      expect(() => updateTaskSchema.parse(invalidData)).toThrow(
        'Title is required',
      );
    });

    it('rejects title that is too long', () => {
      const invalidData = {
        body: {
          title: 'a'.repeat(256),
        },
        params: {
          id: '123',
        },
      };
      expect(() => updateTaskSchema.parse(invalidData)).toThrow(
        'Title is too long',
      );
    });

    it('rejects description that is too long', () => {
      const invalidData = {
        body: {
          description: 'a'.repeat(1001),
        },
        params: {
          id: '123',
        },
      };
      expect(() => updateTaskSchema.parse(invalidData)).toThrow(
        'Description is too long',
      );
    });

    it('accepts null for optional fields', () => {
      const validData = {
        body: {
          description: null,
          priority: null,
          dueDate: null,
        },
        params: {
          id: '123',
        },
      };
      expect(() => updateTaskSchema.parse(validData)).not.toThrow();
    });

    it('validates dashboardId as positive integer', () => {
      const validData = {
        body: {
          dashboardId: 5,
        },
        params: {
          id: '123',
        },
      };
      expect(() => updateTaskSchema.parse(validData)).not.toThrow();
    });

    it('rejects negative dashboardId', () => {
      const invalidData = {
        body: {
          dashboardId: -1,
        },
        params: {
          id: '123',
        },
      };
      expect(() => updateTaskSchema.parse(invalidData)).toThrow(
        'Dashboard ID must be a positive integer',
      );
    });

    it('rejects zero dashboardId', () => {
      const invalidData = {
        body: {
          dashboardId: 0,
        },
        params: {
          id: '123',
        },
      };
      expect(() => updateTaskSchema.parse(invalidData)).toThrow(
        'Dashboard ID must be a positive integer',
      );
    });

    it('validates numeric ID param format', () => {
      const validData = {
        body: {},
        params: {
          id: '456',
        },
      };
      expect(() => updateTaskSchema.parse(validData)).not.toThrow();
    });

    it('rejects non-numeric ID param', () => {
      const invalidData = {
        body: {},
        params: {
          id: 'abc',
        },
      };
      expect(() => updateTaskSchema.parse(invalidData)).toThrow(
        'Invalid ID format',
      );
    });

    it('rejects ID param with special characters', () => {
      const invalidData = {
        body: {},
        params: {
          id: '123-abc',
        },
      };
      expect(() => updateTaskSchema.parse(invalidData)).toThrow(
        'Invalid ID format',
      );
    });
  });

  describe('reorderTaskSchema', () => {
    it('validates a valid reorder request with all fields', () => {
      const validData = {
        body: {
          taskId: 1,
          prevId: 2,
          nextId: 3,
          targetStatus: 'IN_PROGRESS',
        },
      };
      expect(() => reorderTaskSchema.parse(validData)).not.toThrow();
    });

    it('validates a minimal reorder request', () => {
      const validData = {
        body: {
          taskId: 1,
        },
      };
      expect(() => reorderTaskSchema.parse(validData)).not.toThrow();
    });

    it('accepts null for optional prevId', () => {
      const validData = {
        body: {
          taskId: 1,
          prevId: null,
          nextId: 3,
        },
      };
      expect(() => reorderTaskSchema.parse(validData)).not.toThrow();
    });

    it('accepts null for optional nextId', () => {
      const validData = {
        body: {
          taskId: 1,
          prevId: 2,
          nextId: null,
        },
      };
      expect(() => reorderTaskSchema.parse(validData)).not.toThrow();
    });

    it('rejects missing taskId', () => {
      const invalidData = {
        body: {
          prevId: 2,
        },
      };
      expect(() => reorderTaskSchema.parse(invalidData)).toThrow();
    });

    it('rejects negative taskId', () => {
      const invalidData = {
        body: {
          taskId: -1,
        },
      };
      expect(() => reorderTaskSchema.parse(invalidData)).toThrow();
    });

    it('rejects zero taskId', () => {
      const invalidData = {
        body: {
          taskId: 0,
        },
      };
      expect(() => reorderTaskSchema.parse(invalidData)).toThrow();
    });

    it('rejects negative prevId', () => {
      const invalidData = {
        body: {
          taskId: 1,
          prevId: -1,
        },
      };
      expect(() => reorderTaskSchema.parse(invalidData)).toThrow();
    });

    it('rejects negative nextId', () => {
      const invalidData = {
        body: {
          taskId: 1,
          nextId: -1,
        },
      };
      expect(() => reorderTaskSchema.parse(invalidData)).toThrow();
    });

    it('validates all targetStatus values', () => {
      const statuses = ['TODO', 'IN_PROGRESS', 'DONE'];
      statuses.forEach((status) => {
        const validData = {
          body: {
            taskId: 1,
            targetStatus: status,
          },
        };
        expect(() => reorderTaskSchema.parse(validData)).not.toThrow();
      });
    });

    it('rejects invalid targetStatus', () => {
      const invalidData = {
        body: {
          taskId: 1,
          targetStatus: 'COMPLETED',
        },
      };
      expect(() => reorderTaskSchema.parse(invalidData)).toThrow();
    });
  });

  describe('taskIdSchema', () => {
    it('validates a valid numeric task ID param', () => {
      const validData = {
        params: {
          id: '789',
        },
      };
      expect(() => taskIdSchema.parse(validData)).not.toThrow();
    });

    it('rejects non-numeric ID', () => {
      const invalidData = {
        params: {
          id: 'abc',
        },
      };
      expect(() => taskIdSchema.parse(invalidData)).toThrow(
        'Invalid ID format',
      );
    });

    it('rejects ID with special characters', () => {
      const invalidData = {
        params: {
          id: '123-456',
        },
      };
      expect(() => taskIdSchema.parse(invalidData)).toThrow(
        'Invalid ID format',
      );
    });

    it('rejects empty ID', () => {
      const invalidData = {
        params: {
          id: '',
        },
      };
      expect(() => taskIdSchema.parse(invalidData)).toThrow(
        'Invalid ID format',
      );
    });
  });
});
