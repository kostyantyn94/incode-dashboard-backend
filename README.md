# Incode Dashboard - Backend API

RESTful API server for the Incode Dashboard task management application.

## Tech Stack

- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** with **Prisma ORM**
- **Zod** for validation
- **Hashids** for ID obfuscation
- **CORS** enabled

## Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm or yarn

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your settings:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/incode_dashboard
   HASHIDS_SALT=your-random-secret-salt
   PORT=3000
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Server will start at http://localhost:3000

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

```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run production build
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   │   ├── dashboards.ts
│   │   └── tasks.ts
│   ├── routes/          # Express routes
│   │   ├── dashboards.ts
│   │   └── tasks.ts
│   ├── validators/      # Zod validation schemas
│   │   ├── schemas.ts
│   │   └── common.ts
│   ├── middleware/      # Express middleware
│   │   └── validate.ts
│   ├── utils/           # Utility functions
│   │   └── hashids.ts
│   ├── database/        # Database connection
│   │   └── client.ts
│   ├── models/          # TypeScript types
│   │   └── types.ts
│   └── index.ts         # Server entry point
│
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Migration files
│
├── generated/           # Prisma Client (generated)
├── dist/                # Compiled JavaScript (generated)
├── Dockerfile           # Production Docker image
├── Dockerfile.dev       # Development Docker image
└── package.json
```

## API Endpoints

### Dashboards

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard` | List all dashboards |
| POST | `/api/v1/dashboard` | Create new dashboard |
| GET | `/api/v1/dashboard/:id` | Get dashboard with tasks (hashed ID) |
| PATCH | `/api/v1/dashboard/:id` | Update dashboard |
| DELETE | `/api/v1/dashboard/:id` | Delete dashboard |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/task` | Create new task |
| GET | `/api/v1/task/:id` | Get task by ID |
| PATCH | `/api/v1/task/:id` | Update task |
| DELETE | `/api/v1/task/:id` | Delete task |
| PATCH | `/api/v1/task/reorder` | Reorder task (drag & drop) |

## Database Schema

### Dashboard
```prisma
model Dashboard {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  tasks     Task[]
}
```

### Task
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

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `HASHIDS_SALT` | Secret salt for ID hashing | Yes | - |
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |

## Validation

All endpoints use Zod schemas for request validation:

- **Body validation** - Request body structure
- **Params validation** - URL parameters
- **Query validation** - Query strings

Validation errors return:
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

## ID Hashing

Dashboard IDs are hashed using Hashids:
- **Internal**: Numeric auto-increment (1, 2, 3, ...)
- **External**: Short hash (e.g., "aB3Cd5Ef")
- **Benefits**: Security, shareable URLs, prevents enumeration

## Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio
```

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

### Development Build

```bash
# Build
docker build -f Dockerfile.dev -t incode-backend-dev .

# Run with volume mount
docker run -p 3000:3000 \
  -v $(pwd):/app \
  -e DATABASE_URL="your-db-url" \
  incode-backend-dev
```

## CI/CD

GitHub Actions runs automatically on push/PR:
- ✅ ESLint checks
- ✅ TypeScript compilation
- ✅ Prettier formatting
- ✅ Docker build test

See [.github/workflows/code-quality.yml](.github/workflows/code-quality.yml)

## Error Handling

All errors return consistent format:

**Validation Error (400):**
```json
{
  "error": "Validation failed",
  "details": [...]
}
```

**Server Error (500):**
```json
{
  "error": "Internal server error"
}
```

## CORS

CORS is enabled for all origins in development. Configure for production:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}))
```

## Performance

- **Fractional indexing** for task ordering (no full table updates)
- **Prisma Accelerate** for connection pooling
- **Database indexes** on frequently queried fields
- **Cascade deletes** for referential integrity

## Security

- ✅ Request validation with Zod
- ✅ ID obfuscation with Hashids
- ✅ Environment variables for secrets
- ✅ CORS configuration
- ✅ TypeScript for type safety

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Run quality checks:
   ```bash
   npm run lint
   npm run build
   npm run format
   ```
4. Commit changes
5. Push and create Pull Request

## License

ISC

## Support

For issues, open a GitHub issue with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
