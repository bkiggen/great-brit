# Stage 1: Build the React application
FROM node:18 as build

WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the client app files
COPY client ./

# Build the React application
RUN npm run build

# Stage 2: Serve the React application using Nginx
FROM nginx:stable-alpine

# Install Nginx
RUN apk update && apk add nginx

# Copy the build output from the previous stage (/app/build) to /usr/share/nginx/html
COPY --from=build /app/build /usr/share/nginx/html

# Start Nginx with the command ["nginx", "-g", "daemon off;"]
CMD ["nginx", "-g", "daemon off;"]
