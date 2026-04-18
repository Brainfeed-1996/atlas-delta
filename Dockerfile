FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

COPY package.json pnpm-lock.yaml ./
COPY turbo.json ./
COPY package.json packages/models/package.json packages/models/tsconfig.json packages/models/src/ packages/models/
COPY package.json packages/core/package.json packages/core/tsconfig.json packages/core/src/ packages/core/
COPY package.json apps/api/package.json apps/api/tsconfig.json apps/api/prisma/ apps/api/src/ apps/api/
COPY package.json apps/web/package.json apps/web/tsconfig.json apps/web/vite.config.ts apps/web/index.html apps/web/src/ apps/web/

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @atlas-delta/models build
RUN pnpm --filter @atlas-delta/core build

EXPOSE 8100 3000

CMD ["pnpm", "dev"]