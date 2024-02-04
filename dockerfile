FROM node:18

WORKDIR /app

COPY . .

RUN npm install -g pnpm && pnpm install

RUN pnpm build

ENV DATABASE_URL="postgresql://chirpify:qwerty123@localhost:5432/db?schema=public"

RUN pnpm migrate

EXPOSE 3333

CMD ["pnpm", "start"]
