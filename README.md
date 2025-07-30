# EVTS - Emergency Vehicle Tracking Solutions

## Deployment Guide

### Prerequisites
- Digital Ocean Droplet with Docker and Docker Compose installed
- Private GitHub repository
- SSH access to your droplet

### Quick Deploy
1. Push code to your private GitHub repo
2. SSH into your Digital Ocean droplet
3. Run the deployment script:
   ```bash
   curl -sSL https://raw.githubusercontent.com/yourusername/evts-website/main/deploy.sh | bash
   ```

### Manual Deployment Steps
1. Clone the repository:
   ```bash
   git clone git@github.com:yourusername/evts-website.git /opt/evts
   cd /opt/evts
   ```

2. Create environment file:
   ```bash
   sudo mkdir -p /opt/evts-config
   sudo nano /opt/evts-config/.env
   ```
   Add your email configuration:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   NODE_ENV=production
   PORT=3000
   ```

3. Deploy with Docker:
   ```bash
   docker-compose up -d
   ```

### Environment Variables
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Gmail App Password (not regular password)
- `NODE_ENV`: Set to 'production' for production deployment
- `PORT`: Application port (default: 3000)

### Monitoring
- Check status: `docker-compose ps`
- View logs: `docker-compose logs -f`
- Health check: `curl http://localhost:3000/api/health`

### Updates
To update the application:
```bash
cd /opt/evts
./deploy.sh
```
