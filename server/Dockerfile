FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src

# DATABASE_URL é necessário pra prisma generate validar o schema.
# Coolify passa como build-arg; declaramos ARG + ENV pra disponibilizar.
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

EXPOSE 3001

ENV NODE_ENV=production

# Roda migrations e inicia o server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
