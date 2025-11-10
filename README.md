# Incode Dashboard - Backend API

RESTful API server for the Incode Dashboard task management application built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- **RESTful API** with versioned endpoints (`/api/v1/`)
- **Task Management** with drag-and-drop support
- **Dashboard Management** with shareable hashed URLs
- **ID Obfuscation** using Hashids for security
- **Request Validation** with Zod schemas
- **Database ORM** with Prisma for type-safe queries
- **Connection Pooling** with Prisma Accelerate
- **Fractional Indexing** for efficient task reordering
- **CORS Enabled** for cross-origin requests
- **Comprehensive Testing** with Jest (101 tests, all passing)

## Tech Stack

### Core
- **Node.js** 20+ - JavaScript runtime
- **Express** 5.1.0 - Web framework
- **TypeScript** 5.9.3 - Type safety

### Database
- **PostgreSQL** 16+ - Relational database
- **Prisma** 6.19.0 - ORM with type generation
- **Prisma Accelerate** 2.0.2 - Connection pooling

### Validation & Security
- **Zod** 4.1.12 - Schema validation
- **Hashids** 2.3.0 - ID obfuscation
- **CORS** 2.8.5 - Cross-origin resource sharing

### Development Tools
- **nodemon** 3.1.10 - Auto-restart on changes
- **ts-node** 10.9.2 - TypeScript execution
- **ESLint** 9.39.1 - Code linting
- **Prettier** 3.6.2 - Code formatting

### Testing
- **Jest** 30.2.0 - Testing framework
- **Supertest** 7.1.4 - HTTP assertions
- **ts-jest** 29.4.5 - TypeScript Jest integration

## Prerequisites

- **Node.js** >= 20.0.0
- **PostgreSQL** >= 16.0.0
- **npm** >= 10.0.0

## Installation

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/incode_dashboard
   HASHIDS_SALT=your-random-secret-salt-min-16-chars
   PORT=3000
   NODE_ENV=development
   ```

   > **Note:** Never commit the `.env` file. It's already in `.gitignore`.

3. **Set up the database:**
   ```bash
   # Create database (if not exists)
   createdb incode_dashboard

   # Run migrations
   npx prisma migrate dev

   # (Optional) Seed data
   npx prisma db seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Server will start at `http://localhost:3000`

### Using Docker

1. **Build image:**
   ```bash
   docker build -t incode-dashboard-backend .
   ```

2. **Run container:**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="postgresql://user:password@host:5432/db" \
     -e HASHIDS_SALT="your-secret-salt" \
     incode-dashboard-backend
   ```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   │   ├── dashboards.ts
│   │   ├── dashboards.test.ts
│   │   ├── tasks.ts
│   │   └── tasks.test.ts
│   ├── routes/          # Express routes
│   │   ├── dashboards.ts
│   │   └── tasks.ts
│   ├── validators/      # Zod validation schemas
│   │   ├── schemas.ts
│   │   ├── schemas.test.ts
│   │   ├── common.ts
│   │   └── common.test.ts
│   ├── middleware/      # Express middleware
│   │   └── validate.ts
│   ├── utils/           # Utility functions
│   │   ├── hashids.ts
│   │   └── hashids.test.ts
│   ├── test/            # Test setup
│   │   └── setup.ts
│   └── index.ts         # Server entry point
│
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Migration files
│
├── generated/           # Prisma Client (auto-generated)
├── dist/                # Compiled JavaScript (generated)
├── node_modules/        # Dependencies
├── .github/             # GitHub Actions workflows
│   └── workflows/
│       └── code-quality.yml
├── Dockerfile           # Production Docker image
├── .env                 # Environment variables (not committed)
├── .env.example         # Environment template
├── .gitignore           # Git ignore rules
├── eslint.config.js     # ESLint configuration
├── jest.config.js       # Jest configuration
├── nodemon.json         # Nodemon configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Dashboards

#### List All Dashboards
```http
GET /api/v1/dashboard
```

**Response:**
```json
[
  {
    "id": "aB3Cd5Ef",
    "title": "My Dashboard",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Dashboard with Tasks
```http
GET /api/v1/dashboard/:id
```

**Parameters:**
- `id` (string) - Hashed dashboard ID

**Response:**
```json
{
  "dashboard": {
    "id": "aB3Cd5Ef",
    "title": "My Dashboard",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "tasks": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Task description",
      "status": "TODO",
      "priority": "MEDIUM",
      "dueDate": "2024-12-31T00:00:00.000Z",
      "position": 1024,
      "dashboardId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Dashboard
```http
POST /api/v1/dashboard
Content-Type: application/json

{
  "title": "New Dashboard"
}
```

**Response:** `201 Created`

#### Update Dashboard
```http
PATCH /api/v1/dashboard/:id
Content-Type: application/json

{
  "title": "Updated Title"
}
```

**Response:** `200 OK`

#### Delete Dashboard
```http
DELETE /api/v1/dashboard/:id
```

**Response:** `200 OK`

**Note:** Deletes all associated tasks (cascade delete).

---

### Tasks

#### Create Task
```http
POST /api/v1/task
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task description (optional)",
  "dashboardId": "aB3Cd5Ef",
  "status": "TODO",
  "priority": "MEDIUM",
  "dueDate": "2024-12-31T00:00:00.000Z"
}
```

**Response:** `201 Created`

#### Get Task
```http
GET /api/v1/task/:id
```

**Response:** `200 OK`

#### Update Task
```http
PATCH /api/v1/task/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}
```

**Response:** `200 OK`

#### Delete Task
```http
DELETE /api/v1/task/:id
```

**Response:** `200 OK`

#### Reorder Task (Drag & Drop)
```http
PATCH /api/v1/task/reorder
Content-Type: application/json

{
  "taskId": 1,
  "targetStatus": "IN_PROGRESS",
  "prevId": 5,
  "nextId": 7
}
```

**Parameters:**
- `taskId` (number) - ID of task to move
- `targetStatus` (string) - New status (TODO, IN_PROGRESS, DONE)
- `prevId` (number, optional) - ID of task before
- `nextId` (number, optional) - ID of task after

**Response:** `200 OK`

---

### Error Responses

#### Validation Error (400)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "body.title",
      "message": "Title is required"
    }
  ]
}
```

#### Not Found (404)
```json
{
  "error": "Dashboard not found"
}
```

#### Server Error (500)
```json
{
  "error": "Internal server error"
}
```

## Database Schema

### Dashboard Model
```prisma
model Dashboard {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  tasks     Task[]
}
```

### Task Model
```prisma
model Task {
  id          Int           @id @default(autoincrement())
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  title       String
  description String?
  priority    TaskPriority? @default(MEDIUM)
  dueDate     DateTime?
  dashboardId Int
  dashboard   Dashboard     @relation(fields: [dashboardId], references: [id], onDelete: Cascade)
  status      TaskStatus    @default(TODO)
  position    Int           @default(0)

  @@unique([dashboardId, status, position])
  @@index([dashboardId, status, position])
}
```

### Enums
- **TaskStatus**: `TODO`, `IN_PROGRESS`, `DONE`
- **TaskPriority**: `LOW`, `MEDIUM`, `HIGH`

## Environment Variables

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - | `postgresql://user:pass@localhost:5432/db` |
| `HASHIDS_SALT` | Secret salt for ID hashing (min 16 chars) | Yes | - | `super-secret-salt-value-123` |
| `PORT` | Server port | No | 3000 | `3000` |
| `NODE_ENV` | Environment mode | No | development | `production` |

> **Security:** Never commit `.env` file or expose secrets in version control.

## Validation

All endpoints use Zod schemas for request validation:

- **Body validation** - Request body structure
- **Params validation** - URL parameters
- **Query validation** - Query strings (if applicable)

### Validation Rules

**Dashboard:**
- `title`: Required, 1-255 characters

**Task:**
- `title`: Required, 1-255 characters
- `description`: Optional, max 1000 characters
- `priority`: Optional, enum (LOW, MEDIUM, HIGH)
- `status`: Optional on create, enum (TODO, IN_PROGRESS, DONE)
- `dueDate`: Optional, ISO 8601 datetime string
- `dashboardId`: Required (hashed ID), validates against hashids format

## ID Hashing

Dashboard IDs are hashed using Hashids for security and URL friendliness:

- **Internal**: Numeric auto-increment (1, 2, 3, ...)
- **External**: Short hash (e.g., "aB3Cd5Ef", min 8 chars)

**Benefits:**
- Security: Prevents enumeration attacks
- Shareable URLs: `/board/aB3Cd5Ef`
- Obfuscation: Hides database structure

**Implementation:**
```typescript
import Hashids from 'hashids';

const hashids = new Hashids(process.env.HASHIDS_SALT, 8);

// Encode
const hash = hashids.encode(123); // "aB3Cd5Ef"

// Decode
const id = hashids.decode("aB3Cd5Ef")[0]; // 123
```

## Database Migrations

### Common Commands

```bash
# Create new migration
npx prisma migrate dev --name add_new_field

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only - deletes all data!)
npx prisma migrate reset

# Generate Prisma Client (after schema changes)
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Migration Workflow

1. Modify `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Test migrations locally
4. Commit migration files to git
5. Deploy with `npx prisma migrate deploy` in production

## Testing

Run all tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

### Test Coverage

- **101 tests** across 5 test suites (all passing)
- **Dashboard Controllers**: 10 tests
- **Task Controllers**: 15 tests
- **Hashids Utility**: 11 tests
- **Common Validators**: 10 tests
- **Schema Validators**: 55 tests

### Test Structure

```typescript
// Example: Controller test
describe('Dashboard Controllers', () => {
  it('returns all dashboards with hashed IDs', async () => {
    // Test implementation
  });
});
```

Tests use:
- Jest for test runner
- Supertest for HTTP assertions
- Mocked Prisma Client
- Mocked Hashids

## Docker

### Production Build

```bash
# Build
docker build -t incode-backend .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e HASHIDS_SALT="your-salt" \
  incode-backend
```

### Docker Compose (with PostgreSQL)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: incode_dashboard
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/incode_dashboard
      HASHIDS_SALT: super-secret-salt
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## CI/CD

GitHub Actions runs automatically on push/PR to main and develop branches:

- ✅ ESLint checks
- ✅ TypeScript compilation
- ✅ Prettier formatting
- ✅ Jest tests
- ✅ Docker build test

See `.github/workflows/code-quality.yml` for configuration.

## Performance

### Optimizations

1. **Fractional Indexing**: Task positions use fractional indexing (midpoint calculation) to avoid updating entire columns when reordering.

2. **Database Indexes**: Composite index on `(dashboardId, status, position)` for fast task queries.

3. **Connection Pooling**: Prisma Accelerate provides connection pooling for serverless environments.

4. **Cascade Deletes**: Database-level cascade deletes for referential integrity (no manual cleanup needed).

### Position Calculation

```typescript
// When moving task between two others
if (prev && next) {
  newPosition = Math.floor((prev.position + next.position) / 2);
}

// When moving to end of list
if (prev && !next) {
  newPosition = prev.position + 1024;
}

// When moving to start of list
if (!prev && next) {
  newPosition = Math.floor(next.position / 2);
}
```

## Security

### Best Practices

- ✅ **Request Validation**: All inputs validated with Zod schemas
- ✅ **ID Obfuscation**: Hashids prevents enumeration attacks
- ✅ **Environment Variables**: Secrets stored in `.env` (not committed)
- ✅ **CORS Configuration**: Configure allowed origins for production
- ✅ **Type Safety**: TypeScript prevents type-related bugs
- ✅ **Error Handling**: Generic error messages (no stack traces exposed)
- ✅ **SQL Injection**: Prisma ORM prevents SQL injection

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS with specific origins
- [ ] Use strong `HASHIDS_SALT` (min 16 chars)
- [ ] Use secure `DATABASE_URL` with SSL
- [ ] Enable database backups
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure rate limiting
- [ ] Enable HTTPS

## CORS Configuration

Development (allows all origins):
```typescript
app.use(cors());
```

Production (specific origins):
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend.com',
  credentials: true
}));
```

## Troubleshooting

### Database Connection Issues

**Error:** "Can't reach database server"

**Solutions:**
1. Check PostgreSQL is running: `pg_isready`
2. Verify `DATABASE_URL` in `.env`
3. Check firewall/network settings
4. Ensure database exists: `createdb incode_dashboard`

### Migration Issues

**Error:** "Migration failed"

**Solutions:**
1. Check database permissions
2. Reset database: `npx prisma migrate reset` (dev only)
3. Manually fix migration files in `prisma/migrations/`
4. Regenerate client: `npx prisma generate`

### Test Failures

**Error:** "Tests failing"

**Solutions:**
1. Clear Jest cache: `npx jest --clearCache`
2. Check Node.js version: `node --version` (should be >= 20)
3. Reinstall dependencies: `rm -rf node_modules && npm install`
4. Check test database connection

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Make changes
4. Run quality checks:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```
5. Commit changes: `git commit -m "Description"`
6. Push branch: `git push origin feature/name`
7. Create Pull Request

## License

ISC

## Support

For issues, open a GitHub issue with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (Node version, OS, etc.)
