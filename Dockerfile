FROM node:20-alpine as base

FROM base as setup

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV PNPM_HOME=/usr/local/bin
ENV DISABLE_OPENCOLLECTIVE=true


# ---------------
# Install Dependencies
# ---------------
FROM setup AS deps


WORKDIR /app

COPY prisma ./prisma
COPY package*.json ./

RUN pnpm i

# ---------------
# Build App
# ---------------
FROM setup AS builder

WORKDIR /app


COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json .
COPY --from=deps /app/prisma ./prisma
COPY . .

RUN pnpm run build

RUN pnpm run db:generate

# ---------------
# Final App
# ---------------
FROM base 
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./
COPY --from=builder /app/.output ./.output

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]