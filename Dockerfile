# Multi-stage Dockerfile for Node.js + TypeScript + Prisma

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Install dependencies required for Prisma and build
RUN apk add --no-cache openssl libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
# Use npm ci if package-lock.json exists, otherwise use npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy prisma schema and config
COPY prisma.config.ts ./
COPY src/infrastructure/prisma/schema.prisma ./src/infrastructure/prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript application
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache openssl libc6-compat

# Create app user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
# Use npm ci if package-lock.json exists, otherwise use npm install
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi && npm cache clean --force

# Copy Prisma files for runtime
COPY --chown=nodejs:nodejs prisma.config.ts ./
COPY --chown=nodejs:nodejs src/infrastructure/prisma/schema.prisma ./src/infrastructure/prisma/
COPY --chown=nodejs:nodejs src/infrastructure/prisma/migrations ./src/infrastructure/prisma/migrations

# Copy generated Prisma Client from builder
COPY --from=builder --chown=nodejs:nodejs /app/src/infrastructure/prisma/generated ./src/infrastructure/prisma/generated

# Copy built application from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Switch to non-root user
USER nodejs

# Expose port (will use PORT env var, default 7500)
EXPOSE 3000

# Start command - runs migrations and starts the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/presentation/server.js"]
