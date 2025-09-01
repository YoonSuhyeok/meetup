FROM node:22.19-alpine3.21

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app

RUN pnpm install

ENV HOST=0.0.0.0
ENV PORT=1420

EXPOSE 1420

CMD ["pnpm", "run", "dev"]