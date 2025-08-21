#!/bin/bash

# EVTS Deployment Script for Digital Ocean
# This script pulls the latest code from GitHub and deploys it using Docker

set -e

echo "🚀 Starting EVTS deployment..."

# Configuration
REPO_URL="https://github.com/brundige/EMT.git"  # Fixed to use HTTPS
APP_DIR="/opt/evts"
DOCKER_IMAGE="evts-app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
   print_warning "Running as root. This is not recommended for production."
fi

# Create app directory if it doesn't exist
if [ ! -d "$APP_DIR" ]; then
    print_status "Creating application directory at $APP_DIR"
    sudo mkdir -p $APP_DIR
    sudo chown $USER:$USER $APP_DIR
fi

# Navigate to app directory
cd $APP_DIR

# Pull latest code from GitHub
print_status "Pulling latest code from GitHub..."
if [ -d ".git" ]; then
    git pull origin main
else
    print_status "Cloning repository..."
    git clone $REPO_URL .
fi

# Copy environment file if it exists
if [ -f "/opt/evts-config/.env" ]; then
    print_status "Copying environment configuration..."
    cp /opt/evts-config/.env .
else
    print_warning "No environment file found at /opt/evts-config/.env"
    print_warning "Make sure to create .env file with EMAIL_USER and EMAIL_PASS"
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans || true

# Build new image
print_status "Building Docker image..."
docker-compose build --no-cache

# Start the application
print_status "Starting EVTS application..."
docker-compose up -d

# Wait for health check
print_status "Waiting for application to be healthy..."
sleep 10

# Check if container is running
if docker-compose ps | grep -q "Up"; then
    print_status "✅ Deployment successful! EVTS is running."
    print_status "Application is available at: http://your-droplet-ip:3000"
else
    print_error "❌ Deployment failed. Check logs with: docker-compose logs"
    exit 1
fi

# Show container status
print_status "Container status:"
docker-compose ps

print_status "🎉 Deployment completed successfully!"
print_status "To view logs: docker-compose logs -f"
print_status "To stop: docker-compose down"
