# Build stage
FROM node:18.16.0-alpine as build

WORKDIR /app
COPY ./package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Second stage
FROM nginx:stable-alpine

# Copy the static files from the build stage to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
