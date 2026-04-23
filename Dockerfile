
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS deps
RUN npm ci --omit=dev

FROM node:20-alpine AS production

LABEL maintainer="sergiosanabria.152@gmail.com"
LABEL description="TaskAPI - Demo DevOps/DevSecOps"
LABEL version="1.0.0"

RUN addgroup -g 1001 -S nodejs && \
    adduser -S taskapi -u 1001 -G nodejs

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY src/ ./src/
COPY package.json ./

RUN chown -R taskapi:nodejs /app

USER taskapi

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "src/server.js"]
