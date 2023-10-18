# Use an official Node.js runtime as the base image
FROM node:18 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend app source code
COPY . .

# Build the React app
RUN npm run build

# Serve the app on port 3000
EXPOSE 3000
CMD ["npm", "start"]
