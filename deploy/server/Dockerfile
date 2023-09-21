FROM node:18 as build

WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY . .

# The second stage
# Copy React static files and start nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]