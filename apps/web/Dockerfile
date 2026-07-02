FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm install

FROM deps AS web
COPY apps/web apps/web
COPY packages packages
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["npm", "run", "dev"]
