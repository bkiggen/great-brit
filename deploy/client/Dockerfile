# Use a smaller Node.js base image
FROM node:19.5.0-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Build the React application
RUN npm run build --loglevel verbose
