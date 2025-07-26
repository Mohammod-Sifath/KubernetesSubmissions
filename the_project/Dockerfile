# Use a small Node.js base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create the 'storage' directory for cached image
# This will be mounted over by Kubernetes volume, but we need it to exist in image
RUN mkdir -p storage

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]

