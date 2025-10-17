# syntax=docker.io/docker/dockerfile:1

FROM oven/bun:1.3.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js application
RUN bun run build

# Production image, copy all the files and run the custom server
FROM node:24.10.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the custom server and package files
COPY --chown=nextjs:nodejs server.js ./
COPY --chown=nextjs:nodejs package.json ./

# Copy the entire built Next.js application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy node_modules for production dependencies
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/stats', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Set environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the custom server
CMD ["node", "server.js"]
