# Multi-stage Dockerfile — builds Next.js inside Docker, then runs
FROM node:20-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SUPABASE_URL=https://lyyevuyejxrjpsaisaal.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eWV2dXllanhyanBzYWlzYWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4NjU5MDAsImV4cCI6MjA1NDQ0MTkwMH0.3dVhSi0RbShm4cxtXLoOfEDNsiGQk2Cr_CaXlkXHsqg
ENV NEXT_PUBLIC_SITE_URL=https://app.clubfasting.com

RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
