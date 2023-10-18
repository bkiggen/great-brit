# Use an image that includes certbot and nginx
FROM certbot/certbot

# Install any additional packages you may need
RUN apt-get update && apt-get install -y nginx

# Entrypoint command to start Certbot
ENTRYPOINT ["certbot"]