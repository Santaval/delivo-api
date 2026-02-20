# Production Dockerfile for Node.js + TypeScript + Prisma
# Runs TypeScript directly with ts-node for reliability

FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache openssl libc6-compat

# Create app user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (need dev deps for ts-node and tsconfig-paths)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi && npm cache clean --force

# Copy application files
COPY --chown=nodejs:nodejs . .

# Generate Prisma Client
RUN npx prisma generate

# Switch to non-root user
USER nodejs

# Expose port (will use PORT env var from environment)
EXPOSE 3000

# Start command - runs migrations and starts the server with ts-node
CMD ["sh", "-c", "npx prisma migrate deploy && node -r ts-node/register -r tsconfig-paths/register src/presentation/server.ts"]
