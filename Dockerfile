# Multi-stage build for ai war monorepo

# Stage 1: Build client and server
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build client (static files)
RUN npm run build --workspace=client

# Build server (TypeScript compilation)
RUN npm run build --workspace=server

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
COPY shared/package*.json ./shared/

# Install production dependencies only
RUN npm ci --production

# Copy built artifacts from builder
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/shared ./shared

# Copy server static serving config (if needed)
COPY server/src ./server/src

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/leaderboard', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server (it will serve static client files)
CMD ["node", "server/dist/server.js"]
