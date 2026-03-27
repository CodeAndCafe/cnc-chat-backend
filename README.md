# cnc-chat-backend

## 🐳 Quick Start

The easiest way to initialize the required services (PostgreSQL, pgAdmin, and MinIO) is using Docker Compose.

```bash
# Start with Docker (recommended)
docker compose up -d

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

## 🌐 Access

Once the applications and containers are up and running, you can access the services here:

- **Backend API**: <http://localhost:3000>
- **Swagger Docs**: <http://localhost:3000/docs/>
- **pgAdmin**: <http://localhost:5050> (Database management tool)

## 💿 Seed Data & Database Migrations

Sequelize migrations are used to maintain the database schema.
To run migrations and apply the schema to your PostgreSQL instance:

```bash
npm run migrate
```

### From the Backend Directory

```bash
# Checks and fixes generic ESLint errors using NestJS config.
npm run lint

# Automatically applies Prettier formatting to all .ts files.
npm run format
```
