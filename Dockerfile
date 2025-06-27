# syntax=docker.io/docker/dockerfile:1

FROM node:24.2.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js application
RUN NEXT_PUBLIC_BASE_PATH=/monty-hall-problem npm run build

# Production image, copy all the files and run the custom server
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the custom server
COPY --chown=nextjs:nodejs server.js ./

# Copy the built Next.js application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy node_modules for production dependencies
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''; require('http').get(\`http://localhost:3000\${basePath}/api/stats\`, (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Set environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the custom server
CMD ["node", "server.js"]
