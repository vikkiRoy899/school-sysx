# School & Coaching Management System - Setup Guide

## Prerequisites

- [Docker](https://docs.docker.com/) installed and running
- [Node.js](https://nodejs.org/) v20+

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Database setup**:
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

3. **Running in Development**:
   ```bash
   # In separate terminals:
   npm run dev:backend
   npm run dev:admin
   ```

## Production Setup with Docker

1. **Build and Start**:
   ```bash
   docker compose up -d --build
   ```

2. **Logs**:
   ```bash
   docker compose logs -f backend
   ```

3. **Stop**:
   ```bash
   docker compose down
   ```

## GitHub Repository
- **Repo**: https://github.com/vikkiRoy899/school-sysx.git
