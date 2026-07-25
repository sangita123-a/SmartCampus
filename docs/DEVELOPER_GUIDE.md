# SmartCampus Developer Guide

Welcome to the **SmartCampus** developer guide. This document contains setup instructions, code conventions, environment configuration, and build commands.

---

## Workspace Structure

```
SmartCampus/
├── smartcampus-backend/      # Express API Server + Prisma ORM
│   ├── src/
│   │   ├── controllers/      # Route Request Handlers
│   │   ├── services/         # Business Logic & Database Services
│   │   ├── routes/           # Express Endpoint Routing
│   │   ├── middlewares/      # Auth, Logging, Error Handlers
│   │   └── types/            # TypeScript Definitions
│   └── prisma/
│       └── schema.prisma     # PostgreSQL Master Schema
├── smartcampus-frontend/     # Next.js App Router Frontend
│   └── src/
│       ├── app/              # Next.js App Pages & Layouts
│       ├── components/       # Reusable React UI Components
│       ├── services/         # Axios API Services
│       └── store/            # Zustand State Management
├── docs/                     # Architecture & API Guides
├── docker-compose.yml        # Docker Multi-Container Compose
└── README.md
```

---

## Local Development Workflow

### 1. Database Setup
Ensure PostgreSQL 16 is running, then run Prisma migrations:
```bash
cd smartcampus-backend
npm run prisma:generate
npm run prisma:migrate
```

### 2. Launch API Server
```bash
cd smartcampus-backend
npm run dev
```

### 3. Launch Frontend App
```bash
cd smartcampus-frontend
npm run dev
```
Access the application at `http://localhost:3000`.
