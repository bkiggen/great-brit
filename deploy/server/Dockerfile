# Stage 1: Build the Node.js application
FROM node:14 as build

WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application source code
COPY . .

# Stage 2: Create a lightweight production image
FROM node:14

WORKDIR /app

# Copy the production-ready code from the previous stage
COPY --from=build /app .

# Expose the port your Express app will run on
EXPOSE 3000

# Start your Express application using the "start" script
CMD ["npm", "start"]
