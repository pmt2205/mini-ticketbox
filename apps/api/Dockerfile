FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm install

FROM deps AS api
COPY apps/api apps/api
COPY packages packages
WORKDIR /app/apps/api
RUN npm run db:generate
EXPOSE 3001
CMD ["npm", "run", "dev"]
