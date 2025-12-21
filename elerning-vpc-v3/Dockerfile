# ============================================
# Multi-stage Dockerfile for E-Learning Portal
# Nuxt 3 - Production Optimized
# ============================================

# ============================================
# Stage 1: Builder
# ============================================
FROM node:20-alpine AS builder

# Install build dependencies for native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Copy all source files
COPY . .

ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1

ARG BASE_URL_CRM
ENV BASE_URL_CRM=$BASE_URL_CRM

RUN npm run build

# ============================================
# Stage 2: Runner (Production)
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1

ARG BASE_URL_CRM
ENV BASE_URL_CRM=$BASE_URL_CRM

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output
COPY --from=builder --chown=nuxtjs:nodejs /app/package.json ./package.json

USER nuxtjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", ".output/server/index.mjs"]

