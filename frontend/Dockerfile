FROM node:18-alpine

WORKDIR /frontend

COPY package*.json ./

RUN npm install -g serve
RUN npm install

COPY public ./public
COPY src ./src
# COPY .env ./

RUN npm run build