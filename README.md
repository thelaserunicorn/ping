# Ping! - Real-Time Service Health Checker

A real-time internal service health monitoring dashboard built with React, TypeScript, Express, and Docker.

![Dashboard](https://via.placeholder.com/800x400?text=Ping!+Dashboard)

## Features

- **Real-time Monitoring** - Health checks every 10 seconds with automatic status updates
- **CRUD Operations** - Add, edit, and delete services to monitor
- **Multi-Protocol Support** - Monitor HTTP/HTTPS endpoints, IP:Port, and TCP connections
- **Latency Visualization** - Bar chart showing last 20 health check results
- **Status Indicators** - Color-coded badges: Healthy (green), Slow (orange), Down (red)
- **Dark/Light Mode** - Toggle between themes with localStorage persistence
- **Dockerized** - Single-command deployment with Docker Compose
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, TypeScript, WebSocket
- **DevOps**: Docker, Docker Compose, Nginx

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd ping

# Start the application
docker compose up -d
```

Access at: **http://localhost:3000**

### Manual Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## Usage

1. Click **Add Service** to add a new service to monitor
2. Enter the service name and URL
3. Supported formats:
   - HTTP/HTTPS: `https://github.com`
   - IP:Port: `192.168.1.100:5432`
   - Host:Port: `localhost:3000`
4. View real-time status, latency, and historical data

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List all services |
| POST | `/api/services` | Add new service |
| PUT | `/api/services/:id` | Update service |
| DELETE | `/api/services/:id` | Delete service |

## Environment

The app monitors:
- **Healthy**: Response time < 1 second
- **Slow**: Response time > 1 second
- **Down**: Connection failed or timeout

## License

MIT
