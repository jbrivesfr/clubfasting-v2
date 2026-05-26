# Dockerfile for Cloud Run
FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
