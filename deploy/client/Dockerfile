# Build stage
FROM node:18.16.0-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm i --silent
COPY . .
RUN npm run build

# Second stage
FROM nginx:stable-alpine

# Copy the React build from the build stage to Nginx's web directory
COPY --from=build /app/build /usr/share/nginx/html

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
