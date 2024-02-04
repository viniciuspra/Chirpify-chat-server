FROM node:18

WORKDIR /app

COPY . .

RUN npm install -g pnpm && pnpm install

RUN pnpm build
RUN pnpm migrate

EXPOSE 3333

CMD ["pnpm", "start"]
