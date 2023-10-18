# Use an image that includes Certbot and Nginx
FROM certbot/certbot

# Update and install Nginx using yum
RUN yum update -y && yum install -y nginx

# Entrypoint command to start Certbot
ENTRYPOINT ["certbot"]
