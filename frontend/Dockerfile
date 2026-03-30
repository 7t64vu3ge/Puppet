FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

EXPOSE 5173

CMD ["npx", "serve"]