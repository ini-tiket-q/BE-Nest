# Stage 1: Builder
# This stage builds ALL applications
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency-defining files
COPY package.json package-lock.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Install all dependencies
RUN npm ci

# Copy the rest of the monorepo source code
COPY . .

# Build all applications for production
RUN npx nx build transactions-service --configuration=production
RUN npx nx build flight-service --configuration=production
RUN npx nx build api-gateway --configuration=production

# ---

# Stage 2: Production Base
# This stage has the minimal production node_modules
FROM node:20-alpine as production-base

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
# Copy the environment file from the root of the build context
COPY .env .

# ---

# Stage 3: Transactions Service Runner
FROM production-base AS transactions-runner
WORKDIR /app/service
COPY --from=builder /app/dist/apps/transactions-service .
EXPOSE 3001
CMD ["node", "main.js"]


# ---

# Stage 4: Flight Service Runner
FROM production-base AS flight-runner
WORKDIR /app/service
COPY --from=builder /app/dist/apps/flight-service .
EXPOSE 3002
CMD ["node", "main.js"]


# ---

# Stage 5: API Gateway Runner
FROM production-base AS api-gateway-runner
WORKDIR /app/service
COPY --from=builder /app/dist/apps/api-gateway .
EXPOSE 3000
CMD ["node", "main.js"]
