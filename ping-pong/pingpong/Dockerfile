FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p /usr/src/app/shared
EXPOSE 3001
CMD ["node", "index.js"]

