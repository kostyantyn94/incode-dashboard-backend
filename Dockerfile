# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema before installing (needed for postinstall)
COPY prisma ./prisma

# Build argument for DATABASE_URL (only needed for Prisma schema validation)
ARG DATABASE_URL=postgresql://user:password@localhost:5432/db
ENV DATABASE_URL=$DATABASE_URL

# Install dependencies (postinstall will run prisma generate)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema before installing (needed for postinstall)
COPY --from=builder /app/prisma ./prisma

# Build argument for DATABASE_URL (only needed for Prisma schema validation)
ARG DATABASE_URL=postgresql://user:password@localhost:5432/db
ENV DATABASE_URL=$DATABASE_URL

# Install production dependencies only (postinstall will run prisma generate)
RUN npm ci --only=production

# Copy generated Prisma client from builder
COPY --from=builder /app/generated ./generated

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]
