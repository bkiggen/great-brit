# Stage 1: Build the React application
FROM node:19.5.0-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Build the React application
RUN npm run build --loglevel verbose

# Stage 2: Serve the React application using Nginx
FROM nginx:stable-alpine

# Install Nginx
RUN apk --no-cache add nginx

# Copy the build output from the previous stage (/app/build) to /usr/share/nginx/html
COPY --from=build /app/build /usr/share/nginx/html

# Start Nginx with the command ["nginx", "-g", "daemon off;"]
CMD ["nginx", "-g", "daemon off;"]
