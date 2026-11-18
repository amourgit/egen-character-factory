# syntax=docker/dockerfile:1
# EGEN Character Factory — image de production : build Vite puis nginx (statique, non-root, port 8080).
# Aucune modification du code applicatif : les assets embarqués sont ceux de l'amont (public/).
# La bibliothèque de personnages (loot-assets) est servie séparément, depuis un volume monté sur /srv/loot-assets.
#
#   docker build -t egen-character-factory:latest .

ARG NODE_VERSION=20

# --- Build (glibc : les binaires natifs de SWC/Rollup y sont garantis)
FROM node:${NODE_VERSION}-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY . .
# Base du manifeste racine des personnages (cf. src/App.jsx). "./" = manifest.json embarqué.
ARG VITE_ASSET_PATH=./
ENV VITE_ASSET_PATH=${VITE_ASSET_PATH}
RUN npm run build

# --- Exécution
FROM nginxinc/nginx-unprivileged:stable-alpine AS runner
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /app/build /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health > /dev/null || exit 1
