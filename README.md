# DeployBoard

DeployBoard is a DevOps-oriented monitoring platform designed to practice Cloud Computing, Infrastructure, Observability, Docker, Reverse Proxy configuration, and deployment automation using modern DevOps tools and workflows.

The project focuses more on infrastructure, monitoring, containerization, and cloud architecture than on complex business logic.

---

# Tech Stack

## Backend

* Node.js
* Express

## Database

* PostgreSQL

## DevOps & Infrastructure

* Docker
* Docker Compose
* NGINX
* Prometheus
* Grafana
* Makefile

## Environment

* WSL2 Ubuntu
* VS Code Remote WSL

---

# Architecture

```txt
                    ┌─────────────────┐
                    │     Client      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │      NGINX      │
                    │  Reverse Proxy  │
                    └───────┬─────────┘
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
     ┌──────────────┐              ┌──────────────┐
     │ Backend API  │              │   Grafana    │
     │   Node.js    │              └──────┬───────┘
     └──────┬───────┘                     │
            │                             │
            ▼                             ▼
     ┌──────────────┐             ┌──────────────┐
     │ PostgreSQL   │             │ Prometheus   │
     └──────────────┘             └──────────────┘
```

---

# Features

## Monitoring

* HTTP service health checks
* Online/offline detection
* Automatic monitoring scheduler
* Latency measurement
* Historical monitoring records
* Periodic service checks

## Observability

* Prometheus metrics endpoint
* Runtime metrics
* Node.js process metrics
* Custom application metrics
* Grafana dashboards

## Infrastructure

* Dockerized environment
* Reverse proxy with NGINX
* Multi-container orchestration
* Environment separation
* Development workflow automation

## Backend

* REST API
* CRUD for projects
* CRUD for monitored services
* PostgreSQL persistence
* Structured architecture

---

# Project Structure

```txt
deployboard/
├── backend/
│   ├── sql/
│   │   └── schema.sql
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── metrics/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .env.docker
│   ├── Dockerfile
│   ├── package.json
│   └── .dockerignore
│
├── monitoring/
│   └── prometheus/
│       └── prometheus.yml
│
├── nginx/
│   └── default.conf
│
├── docker-compose.yml
├── docker-compose.dev.yml
├── Makefile
└── README.md
```

---

# API Endpoints

## General

```txt
GET /health
GET /api
GET /db-check
GET /metrics
```

## Projects

```txt
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

## Services

```txt
GET    /api/services
POST   /api/services
GET    /api/services/:id
PUT    /api/services/:id
DELETE /api/services/:id
```

## Monitoring

```txt
POST /api/services/:id/check
POST /api/services/check-all
GET  /api/services/:id/checks
```

---

# Monitoring Scheduler

DeployBoard includes an automatic monitoring scheduler that:

* Runs every 30 seconds
* Checks all registered services
* Measures latency
* Detects online/offline status
* Updates current service state
* Stores monitoring history

---

# Database Schema

## projects

```sql
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## services

```sql
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unknown',
    latency_ms INTEGER,
    last_checked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## service_checks

```sql
CREATE TABLE IF NOT EXISTS service_checks (
    id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    latency_ms INTEGER,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# Docker Services

## Backend API

```txt
Container: deployboard-backend
Port: 5000
```

## PostgreSQL

```txt
Container: deployboard-postgres
Port: 5433 -> 5432
```

## Prometheus

```txt
Container: deployboard-prometheus
Port: 9090
```

## Grafana

```txt
Container: deployboard-grafana
Port: 3000
```

## NGINX

```txt
Container: deployboard-nginx
Port: 80
```

---

# Reverse Proxy Routes

## API

```txt
http://localhost/api
```

## Health

```txt
http://localhost/health
```

## Metrics

```txt
http://localhost/metrics
```

## Grafana

```txt
http://localhost/grafana/
```

---

# Prometheus Metrics

DeployBoard exposes runtime and custom application metrics through:

```txt
/metrics
```

## Custom Metrics

### Service Status

```txt
deployboard_service_status
```

Indicates whether a monitored service is online or offline.

```txt
1 = online
0 = offline
```

### Service Latency

```txt
deployboard_service_latency_ms
```

Stores the latest measured latency for monitored services.

### HTTP Request Duration

```txt
deployboard_http_request_duration_seconds
```

Measures API request duration.

---

# Default Node.js Metrics

Prometheus also collects runtime metrics such as:

* CPU usage
* Memory usage
* Heap statistics
* Garbage collection
* Event loop lag
* Active handles
* Open file descriptors

---

# Grafana Dashboard

Suggested panels:

* Service status
* Service latency
* Backend memory usage
* Event loop lag
* HTTP request duration
* CPU usage
* Heap usage

---

# Local Development

## Start environment

```bash
make dev
```

## Run in detached mode

```bash
make up
```

## Stop containers

```bash
make down
```

## Restart containers

```bash
make restart
```

## View logs

```bash
make logs
```

## View running services

```bash
make ps
```

## Remove volumes

```bash
make clean
```

---

# Docker Compose Environments

## Base configuration

```txt
docker-compose.yml
```

## Development configuration

```txt
docker-compose.dev.yml
```

## Jenkins configuration

```txt
docker-compose.jenkins.yml
Jenkinsfile
jenkins/Dockerfile
```

---

# Jenkins CI Pipeline

This repository includes a Jenkins pipeline ready to validate and start the stack.

## What the pipeline does

* Checks out the repository
* Installs backend dependencies
* Runs `npm test` and `npm run lint` if present
* Builds the backend Docker image
* Validates Docker Compose configuration
* Starts the full stack with Docker Compose
* Executes a health check against `/health`

## Start Jenkins locally

```bash
make jenkins
```

Jenkins will be exposed on:

```txt
http://localhost:8080
```

## Useful Jenkins commands

```bash
make jenkins
make jenkins-logs
make jenkins-down
```

## Pipeline requirements

* Docker must be available on the host machine
* Jenkins uses the host Docker socket to build images and start containers
* The pipeline expects the repository job to use the root `Jenkinsfile`

---

# Environment Variables

## Docker Environment

```env
PORT=5000
NODE_ENV=development

DB_HOST=postgres
DB_PORT=5432
DB_NAME=deployboard
DB_USER=postgres
DB_PASSWORD=postgres
```

---

# Health Check Flow

```txt
Scheduler
   ↓
HTTP Request
   ↓
Measure Latency
   ↓
Determine Status
   ↓
Update services table
   ↓
Insert into service_checks
   ↓
Update Prometheus metrics
```

---

# Goals of the Project

This project was built to practice and demonstrate:

* Cloud Computing
* DevOps practices
* Infrastructure design
* Observability
* Monitoring systems
* Containerization
* Reverse proxies
* Metrics collection
* Infrastructure automation
* Service-oriented architecture
* Deployment workflows

---

# Next Steps

Planned improvements:

* Terraform infrastructure
* AWS deployment
* HTTPS with Certbot
* Authentication
* Alertmanager integration
* Kubernetes migration
* Multi-environment deployment
* Centralized logging
* Distributed tracing

---

# Author

Daniel Rojas Groihs
Systems Engineering Student
DevOps & Cloud Computing Learning Project
