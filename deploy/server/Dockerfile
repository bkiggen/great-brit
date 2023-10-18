# Use Amazon Linux 2 as the base image
FROM amazonlinux:2 as production

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY ./package*.json ./

# Install production dependencies
RUN yum install -y nodejs npm
RUN npm install --production

# Copy the server application code to the container
COPY . .

# Expose the port your server will run on
EXPOSE 4000

# Start the server
CMD ["node", "index.js"]
