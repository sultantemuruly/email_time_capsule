# Use official Node 20 Alpine image
FROM node:20-alpine

# Install system dependencies for native Node modules (like node-gyp builds)
RUN apk add --no-cache \
    build-base \
    python3 \
    make \
    g++

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Install Node.js dependencies inside container
RUN npm install --legacy-peer-deps

# Now copy the rest of the app
COPY . .

# Expose the app port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
