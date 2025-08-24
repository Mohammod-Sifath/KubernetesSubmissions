# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all app files
COPY . .

# Ensure config folder is present (for ConfigMap mount)
RUN mkdir -p /app/config

# Expose the port your app listens on
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]

