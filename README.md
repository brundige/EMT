# Emergency Vehicle Tracking Solutions (EVTS) Website

A professional website for Emergency Vehicle Tracking Solutions built with Node.js and Express.

## Features

- Responsive design with modern UI
- Contact form with email integration
- Rate limiting and security middleware
- Docker containerization
- Health checks
- Production-ready configuration

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Gmail account with App Password (for contact form)

## Quick Start (Local Development)

1. Clone the repository:
   ```bash
   git clone https://github.com/brundige/EMT.git
   cd EMT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your Gmail credentials
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Docker Deployment

### Local Docker

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build -d
   ```

2. Access the application at `http://localhost`

### Production Deployment (Digital Ocean)

1. **Server Setup:**
   ```bash
   # Install Docker and Docker Compose on your droplet
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Environment Configuration:**
   ```bash
   # Create config directory
   sudo mkdir -p /opt/evts-config
   
   # Create production .env file
   sudo nano /opt/evts-config/.env
   ```
   
   Add your email credentials:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   NODE_ENV=production
   PORT=3000
   ```

3. **Deploy:**
   ```bash
   # Make deploy script executable
   chmod +x deploy.sh
   
   # Run deployment
   ./deploy.sh
   ```

4. **Access:** Your application will be available at `http://your-droplet-ip`

## Environment Variables

- `EMAIL_USER`: Gmail address for sending contact form emails
- `EMAIL_PASS`: Gmail App Password (not your regular password)
- `NODE_ENV`: Set to 'production' for production deployment
- `PORT`: Application port (default: 3000)

## Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings > Security > App passwords
3. Generate a new app password for "Mail"
4. Use this app password in your .env file

## Health Checks

The application includes health checks at `/api/health`. Docker will automatically restart the container if health checks fail.

## Logs

View application logs:
```bash
docker-compose logs -f
```

## Security Features

- Helmet.js for security headers
- Rate limiting on contact form
- CORS configuration
- Input validation and sanitization
- Honeypot spam protection

## Troubleshooting

1. **Container won't start:**
   ```bash
   docker-compose logs evts-app
   ```

2. **Email not sending:**
   - Verify EMAIL_USER and EMAIL_PASS are correct
   - Ensure Gmail App Password is used (not regular password)
   - Check firewall settings for SMTP (port 587)

3. **Port conflicts:**
   - Change the port mapping in docker-compose.yml if port 80 is in use

## License

MIT License - see LICENSE file for details.
