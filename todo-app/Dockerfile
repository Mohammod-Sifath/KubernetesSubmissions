FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=4444

EXPOSE 4444

CMD ["node", "index.js"]
