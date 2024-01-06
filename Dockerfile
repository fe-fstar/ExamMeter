FROM node:18.1.0-alpine AS build

WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

FROM node:18.1.0-alpine AS deploy-node

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY package.json .
ENV PORT 80
EXPOSE 80
CMD ["node", "build"]