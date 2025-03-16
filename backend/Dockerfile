FROM node:19.0.0-slim
WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY . .
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
RUN npx prisma generate
EXPOSE 10000
CMD [ "npm", "start" ]