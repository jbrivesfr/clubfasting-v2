# Production-only Dockerfile — no build inside Docker
# Build Next.js natively on host first, then just copy artifacts
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone output (pre-built natively)
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
