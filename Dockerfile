# Multi-stage Dockerfile for Nautilus Trader Admin
# Optimized for production deployment

# Stage 1: Base image with dependencies
FROM node:22-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    postgresql-client \
    redis \
    libc6-compat

WORKDIR /app

# Stage 2: Dependencies installation
FROM base AS deps

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 3: Builder
FROM base AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Install pnpm
RUN npm install -g pnpm

# Build the application
RUN pnpm run build

# Stage 4: Production runner
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install pnpm and Python dependencies
RUN npm install -g pnpm && \
    apk add --no-cache gcc musl-dev python3-dev libpq-dev && \
    pip3 install --no-cache-dir \
        psycopg2-binary \
        redis \
        nautilus_trader \
        psutil && \
    apk del gcc musl-dev python3-dev

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nautilus

# Copy built application
COPY --from=builder --chown=nautilus:nodejs /app/.next ./.next
COPY --from=builder --chown=nautilus:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nautilus:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nautilus:nodejs /app/public ./public

# Copy server files
COPY --chown=nautilus:nodejs server ./server
COPY --chown=nautilus:nodejs drizzle ./drizzle
COPY --chown=nautilus:nodejs drizzle.config.ts ./drizzle.config.ts

# Create data directories
RUN mkdir -p /app/nautilus-data/{bars,quotes,trades,backtests} && \
    chown -R nautilus:nodejs /app/nautilus-data

# Switch to non-root user
USER nautilus

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["pnpm", "start"]

