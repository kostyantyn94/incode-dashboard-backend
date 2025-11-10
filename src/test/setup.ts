// Test setup file
import { PrismaClient } from '../../generated/prisma';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Mock Prisma Client and enums
jest.mock('../../generated/prisma', () => ({
  PrismaClient: jest.fn(),
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
}));

export const prismaMock =
  mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

// Set test environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.NODE_ENV = 'test';
