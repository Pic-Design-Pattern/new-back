# ==============================================================================
# Multi-stage Dockerfile para NestJS (otimizado para Coolify e Produção)
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. Estágio de Dependências (Deps)
# ------------------------------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Ferramentas necessárias para dependências com bindings nativos (como argon2/pg)
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci

# ------------------------------------------------------------------------------
# 2. Estágio de Compilação (Builder)
# ------------------------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

# Compilação padrão da aplicação
RUN npm run build

# Remove dependências de desenvolvimento mantendo apenas produção
RUN npm prune --omit=dev

# ------------------------------------------------------------------------------
# 3. Estágio de Execução em Produção (Runner seguro e leve)
# ------------------------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Executa com usuário não-root (node) por segurança
USER node

COPY --chown=node:node package.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
