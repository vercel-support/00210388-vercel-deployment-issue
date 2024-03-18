FROM node:21-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PORT=8080
RUN corepack enable
RUN apk add --no-cache bash

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
COPY . .
RUN npx turbo prune @lawme/server --docker
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
# COPY --from=builder /app/out/ .
RUN pnpm install
 
# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm build
 
FROM base AS runner
WORKDIR /app
 
COPY --from=installer /app/ .
RUN find . -type f -name '*.env' -exec rm -f {} +

 
# Don't run production as root 
# RUN addgroup --system --gid 1001 nodejs
# USER nodejs
# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=installer --chown=nodejs /app/apps/server/dist ./
# COPY --from=installer /app/apps/server/dist ./dist
 
# CMD node dist/esm/server/main.js
CMD pnpm start:server