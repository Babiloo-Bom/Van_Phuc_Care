# ============================================
# Multi-stage Dockerfile for Backend API
# Node.js + TypeScript + Express + MongoDB
# ============================================

# ============================================
# Stage 1: Builder
# ============================================
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --legacy-peer-deps && \
    npm cache clean --force

# Copy source code
COPY . .

# Build TypeScript
ENV NODE_ENV=production
RUN npm run build-ts

# ============================================
# Stage 2: Runner (Production)
# ============================================
FROM node:20-alpine AS runner

# Install runtime dependencies
RUN apk add --no-cache \
    tini \
    curl

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copy node_modules from builder (includes all dependencies)
COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules

# Copy built application from builder
COPY --from=builder --chown=expressjs:nodejs /app/dist ./dist
COPY --from=builder --chown=expressjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=expressjs:nodejs /app/views ./views
COPY --from=builder --chown=expressjs:nodejs /app/public ./public
# Copy utility scripts (e.g. create-99-discount.js)
COPY --from=builder --chown=expressjs:nodejs /app/scripts ./scripts

# Create directories that app needs with proper permissions
RUN mkdir -p tmp logs uploads public/uploads && \
    chown -R expressjs:nodejs tmp logs uploads public/uploads

# Switch to non-root user
USER expressjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Use tini to handle signals properly
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application
CMD ["node", "dist/server.js"]

