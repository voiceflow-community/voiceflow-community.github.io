# Timezone API Server

A robust Node.js RESTful API server that provides timezone-related functionality including current time retrieval and time conversion between different timezones. Built with TypeScript, Express.js, and comprehensive validation using Zod schemas.

## 🚀 Features

- **Current Time API**: Get current time in any timezone
- **Time Conversion API**: Convert time between different timezones
- **Input Validation**: Comprehensive validation using Zod schemas
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Health Monitoring**: Built-in health check and metrics endpoints
- **Security**: Rate limiting, CORS, and security headers
- **Docker Support**: Multi-stage Docker builds with Docker Compose
- **Production Ready**: Graceful shutdown, logging, and error handling

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Development](#development)
- [Docker Deployment](#docker-deployment)
- [Environment Configuration](#environment-configuration)
- [API Usage Examples](#api-usage-examples)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)
- [Contributing](#contributing)

## 🏃 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/voiceflow-community/date-time-api.git

cd timezone-api-server

# Copy environment configuration
cp .env.example .env

# Start with Docker Compose
docker compose up -d

# Check service status
curl http://localhost:3000/health
```

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or build and run production
npm run build
npm start
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check and service status |
| `GET` | `/api/time/current/{timezone}` | Get current time in specified timezone |
| `POST` | `/api/time/current` | Get current time in specified timezone (JSON payload) |
| `POST` | `/api/time/convert` | Convert time between timezones |
| `GET` | `/api/docs` | Interactive API documentation |
| `GET` | `/metrics` | Prometheus metrics (if enabled) |

### Base URL
- **Local Development**: `http://localhost:3000`
- **Docker**: `http://localhost:3000` (or configured port)

## 📦 Installation

### Prerequisites

- **Node.js**: v20 or higher
- **npm**: v9 or higher
- **Docker**: v20 or higher (for containerized deployment)
- **Docker Compose**: v2.0 or higher

### Local Installation

```bash
# Clone the repository
git clone <repository-url>
cd timezone-api-server

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Build the application
npm run build

# Start the server
npm start
```

## 🛠 Development

### Development Server

```bash
# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Project Structure

```
src/
├── config/           # Configuration management
├── controllers/      # Request handlers
├── middleware/       # Express middleware
├── services/         # Business logic
├── swagger/          # API documentation
├── types/           # TypeScript types and Zod schemas
└── utils/           # Utility functions

tests/
├── integration/     # Integration tests
└── unit/           # Unit tests
```

## 🐳 Docker Deployment

### Quick Deployment

```bash
# Basic deployment
docker compose up -d

# Development mode
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Production mode
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Custom Port

```bash
# Run on custom port
PORT=8080 docker compose up -d
```

### Build and Deploy

```bash
# Build image
docker compose build

# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Platform-Specific Deployments

#### Coolify
1. Import repository in Coolify dashboard
2. Set environment variables
3. Deploy using the main `docker-compose.yml`

#### Railway/Render
Use the provided `Dockerfile` for platform deployment.

## ⚙️ Environment Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

#### Core Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Application environment |
| `PORT` | `3000` | Server port |
| `LOG_LEVEL` | `info` | Logging level (debug, info, warn, error) |

#### API Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `API_RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 minutes) |
| `API_RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |
| `CORS_ORIGIN` | `*` | CORS allowed origins |

#### Security Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `HELMET_ENABLED` | `true` | Enable security headers |
| `HEALTH_CHECK_TIMEOUT` | `5000` | Health check timeout (ms) |

#### Monitoring Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `METRICS_ENABLED` | `true` | Enable metrics collection |
| `METRICS_PORT` | `9090` | Metrics server port |
| `LOG_FORMAT` | `json` | Log format (json, simple) |

### Configuration Examples

#### Development
```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
METRICS_ENABLED=true
```

#### Production
```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
HELMET_ENABLED=true
```

## 📚 API Usage Examples

### Health Check

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "memory": {
    "used": 45.2,
    "total": 512
  }
}
```

### Get Current Time

#### Using GET Endpoint

```bash
# Get current time in New York
curl "http://localhost:3000/api/time/current/America%2FNew_York"

# Get current time in London
curl "http://localhost:3000/api/time/current/Europe%2FLondon"
```

#### Using POST Endpoint (Recommended for Complex Timezone Names)

```bash
# Get current time in Paris
curl -X POST http://localhost:3000/api/time/current \
  -H "Content-Type: application/json" \
  -d '{"timezone": "Europe/Paris"}'
```

**Response:**
```json
{
  "timestamp": "2024-01-15T15:30:00.000Z",
  "timezone": "America/New_York",
  "utcOffset": "-05:00",
  "formatted": {
    "date": "2024-01-15",
    "time": "10:30:00",
    "full": "January 15, 2024 at 10:30:00 AM EST"
  }
}
```

### Convert Time

```bash
curl -X POST http://localhost:3000/api/time/convert \
  -H "Content-Type: application/json" \
  -d '{
    "sourceTime": "2024-01-15T14:30:00",
    "sourceTimezone": "America/New_York",
    "targetTimezone": "Europe/London"
  }'
```

**Response:**
```json
{
  "original": {
    "timestamp": "2024-01-15T14:30:00.000Z",
    "timezone": "America/New_York",
    "formatted": "January 15, 2024 at 2:30:00 PM EST"
  },
  "converted": {
    "timestamp": "2024-01-15T19:30:00.000Z",
    "timezone": "Europe/London",
    "formatted": "January 15, 2024 at 7:30:00 PM GMT"
  },
  "utcOffsetDifference": "+05:00"
}
```

### Error Responses

```bash
# Invalid timezone
curl "http://localhost:3000/api/time/current/Invalid%2FTimezone"
```

**Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid timezone identifier",
    "details": [
      {
        "field": "timezone",
        "message": "Invalid timezone identifier"
      }
    ],
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- timezone.test.ts

# Run integration tests
npm test -- tests/integration/
```

### Docker Testing

```bash
# Test Docker Compose configuration
chmod +x test-docker-compose.sh
./test-docker-compose.sh
```

### Manual API Testing

```bash
# Test all endpoints
curl http://localhost:3000/health
curl "http://localhost:3000/api/time/current/UTC"
curl -X POST http://localhost:3000/api/time/current \
  -H "Content-Type: application/json" \
  -d '{"timezone":"Europe/Paris"}'
curl -X POST http://localhost:3000/api/time/convert \
  -H "Content-Type: application/json" \
  -d '{"sourceTime":"2024-01-15T12:00:00","sourceTimezone":"UTC","targetTimezone":"America/New_York"}'
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

#### Docker Issues

```bash
# Container won't start
docker compose logs timezone-api

# Rebuild image
docker compose build --no-cache

# Check container status
docker compose ps
```

#### API Not Responding

```bash
# Check service health
curl http://localhost:3000/health

# Check logs
docker compose logs -f timezone-api

# Restart service
docker compose restart timezone-api
```

### Performance Issues

#### High Memory Usage
- Check memory limits in `docker-compose.yml`
- Monitor with `docker stats`
- Adjust `NODE_OPTIONS` for heap size

#### Slow Response Times
- Check rate limiting configuration
- Monitor with `/metrics` endpoint
- Verify timezone data loading

### Debugging

#### Enable Debug Logging
```bash
LOG_LEVEL=debug npm run dev
```

#### Debug in Docker
```bash
# Development mode with debug
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Getting Help

1. **Check Logs**: `docker compose logs timezone-api`
2. **Verify Configuration**: `docker compose config`
3. **Test Endpoints**: Use the provided curl examples
4. **Check Health**: `curl http://localhost:3000/health`
5. **Review Documentation**: Visit `/api/docs` for interactive API docs

## 📊 Monitoring

### Health Monitoring

```bash
# Basic health check
curl http://localhost:3000/health

# Continuous monitoring
watch -n 5 'curl -s http://localhost:3000/health | jq .'
```

### Metrics (if enabled)

```bash
# Prometheus metrics
curl http://localhost:3000/metrics

# JSON metrics
curl http://localhost:3000/metrics/json
```

### Log Monitoring

```bash
# View real-time logs
docker compose logs -f timezone-api

# View last 100 lines
docker compose logs --tail=100 timezone-api
```

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Security settings reviewed
- [ ] Rate limiting configured
- [ ] CORS origins set appropriately
- [ ] Health checks working
- [ ] Monitoring configured
- [ ] Backup strategy in place

### Deployment Steps

1. **Prepare Environment**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

3. **Verify Deployment**
   ```bash
   curl http://your-domain.com/health
   ```

4. **Monitor Logs**
   ```bash
   docker compose logs -f timezone-api
   ```

## 📚 Documentation

### Interactive API Documentation

The API includes interactive Swagger/OpenAPI documentation that automatically adapts to your current server configuration:

- **Development**: `http://localhost:3000/api/docs`
- **Production**: `https://your-domain.com/api/docs`
- **OpenAPI Spec**: Available at `/api/docs/openapi.json`

#### Dynamic Server URLs

The Swagger documentation automatically detects and displays the correct server URLs based on your environment:

```bash
# Development environment
HOST=localhost PORT=3000 HTTPS=false
# Shows: http://localhost:3000, http://0.0.0.0:3000

# Production environment  
HOST=0.0.0.0 PORT=3000 HTTPS=true PRODUCTION_URL=https://api.example.com
# Shows: https://0.0.0.0:3000, https://api.example.com
```

Configure server URLs using environment variables:
- `HOST`: Server host/interface (default: `localhost`)
- `PORT`: Server port (default: `3000`)
- `HTTPS`: Enable HTTPS protocol (default: `false`)
- `PRODUCTION_URL`: Custom production URL for documentation

### Additional Documentation

- **[API Examples](API_EXAMPLES.md)** - Comprehensive API usage examples with multiple programming languages
- **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Detailed troubleshooting and debugging guide
- **[Docker Compose Guide](DOCKER_COMPOSE_README.md)** - Complete Docker deployment documentation

### Deployment Scripts

The project includes deployment scripts for different environments:

- **Development**: `./scripts/deploy-dev.sh` - Deploy with debug logging and development features
- **Staging**: `./scripts/deploy-staging.sh` - Deploy for testing with staging configuration
- **Production**: `./scripts/deploy-prod.sh` - Deploy with production optimizations and security

```bash
# Make scripts executable
chmod +x scripts/deploy-*.sh

# Deploy to development
./scripts/deploy-dev.sh

# Deploy to production
./scripts/deploy-prod.sh
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and add tests
4. Run tests: `npm test`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [API Documentation](http://localhost:3000/api/docs)
3. Check existing issues in the repository
4. Create a new issue with detailed information

---

**Built with ❤️ using Node.js, TypeScript, and Express.js**

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_date-time-api&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_date-time-api)