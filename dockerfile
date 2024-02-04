FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install -g pnpm && pnpm install

COPY . .

RUN npm install -g pnpm

RUN pnpm build

FROM node:18

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

RUN echo $PATH

CMD ["pnpm", "start:migrate", "pnpm", "start:prod"]
