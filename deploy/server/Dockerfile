# Use the specified Node.js version as build
FROM node:18 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server app files
COPY . .

# The second stage
# Use nginx as the final image
FROM nginx:stable-alpine

# Copy the build output from the previous stage to the nginx web server directory
COPY --from=build /app/build /usr/share/nginx/html

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
