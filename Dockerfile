# 1. build stage
FROM node:16.13 as build
WORKDIR /home/node/app

# -- frontend
COPY . .
RUN npm install
RUN npm run build

# -- backend
WORKDIR /home/node/app/backend
RUN npm install
RUN npm run build

# 2. deploy stage
FROM alpine:latest

RUN apk add --no-cache nodejs
COPY --from=build /home/node/app/backend/dist /var/www
COPY --from=build /home/node/app/build /var/www/htdocs

RUN mkdir /var/log/www
RUN chmod 777 /var/log/www

EXPOSE 80

WORKDIR /var/www
CMD ["node", "/var/www/main.js"]
