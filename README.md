# cnc-chat-backend

# 🚀 Backend Development Environment (Docker)

## 📦 Tech Stack

- Node.js (Express server)
- PostgreSQL (Database)
- pgAdmin 4 (Database GUI)
- MinIO (S3-compatible storage)
- Docker + Docker Compose

---

## 🏗️ Project Structure

.
├── docker-compose.yml
├── Dockerfile.dev
├── .env.development.local
├── src/
└── ...

---

## ⚙️ Services Overview

| Service  | Port | Description   |
| -------- | ---- | ------------- |
| server   | 3000 | Backend API   |
| pg       | 5432 | PostgreSQL DB |
| pgadmin  | 5050 | Database GUI  |
| minio    | 9000 | S3 API        |
| minio UI | 9001 | MinIO Console |

---

## Postgres register

| Field                | Value    |
| -------------------- | -------- |
| Database Name        | postgres |
| Host name/address    | pg       |
| Port                 | 5432     |
| Maintenance database | dev      |
| Username             | postgres |
| Password             | password |

## 🐳 Quick Start

The easiest way to initialize the required services (PostgreSQL, pgAdmin, and MinIO) is using Docker Compose.

```bash
# Start with Docker (recommended)
docker compose up -d

# Build
docker-compose up -d --build

# Start with Docker Compose Watch (Frontend auto-sync)
# This will sync local changes to the container and rebuild on dependency changes
docker compose watch

# Stop all services
docker compose down

# Stop and remove volumes (⚠️ WARNING: Destroys all database & storage data!)
docker compose down -v

# Cmd docker
docker compose exec server sh/bash
```

### docker postgresql

```bash
# Go to container
docker exec -it <postgres_container> psql -U postgres

# Create database
CREATE DATABASE dev;

# Change password database
ALTER USER <postgres_user> WITH PASSWORD 'postgres_password';
```

## 🌐 Access

Once the applications and containers are up and running, you can access the services here:

- **Backend API**: <http://localhost:3000>
- **Swagger Docs**: <http://localhost:3000/docs/>
- **pgAdmin**: <http://localhost:5050> (Database management tool)

## 💿 Seed Data & Database Migrations

Sequelize migrations are used to maintain the database schema.
To run migrations and apply the schema to your PostgreSQL instance:

```bash
# Create migrate
npm run migrate

# Delete migrate
npm run migrate:undo
```

### From the Backend Directory

```bash
# Checks and fixes generic ESLint errors.
npm run lint

# Automatically applies Prettier formatting to all .ts files.
npm run format
```
