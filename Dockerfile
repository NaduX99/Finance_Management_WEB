# ── Frontend Dockerfile (multi-stage) ───────────────────
# React + Vite app served by Nginx
# ────────────────────────────────────────────────────────

# ── Stage 1: Build ──────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the production bundle
RUN npm run build

# ── Stage 2: Serve with Nginx ──────────────────────────
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
