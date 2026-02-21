FROM node:20-alpine AS builder

WORKDIR /app

COPY server/package*.json ./
RUN npm ci --only=production

COPY server/prisma ./prisma/
COPY server/tsconfig.json ./
COPY server/src ./src

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]