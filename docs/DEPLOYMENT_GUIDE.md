# SmartCampus Deployment & DevOps Guide

This guide covers production deployment options for **SmartCampus** using Docker Compose, AWS/GCP Kubernetes, and cloud Vercel/Render hosting.

---

## 1. Docker Compose Deployment (Recommended for On-Premise & VPS)

### Prerequisites
- Docker Engine v24+
- Docker Compose v2.20+

### Production Launch Steps
```bash
# Clone repository
git clone https://github.com/your-org/smartcampus.git
cd smartcampus

# Create environment configuration
cp smartcampus-backend/.env.example smartcampus-backend/.env

# Build and start all services in detached mode
docker-compose up -d --build
```

Services exposed:
- **Frontend Next.js App**: `http://your-server-ip:3000`
- **Backend Express API**: `http://your-server-ip:5000`
- **PostgreSQL Database**: `your-server-ip:5432`

---

## 2. Cloud Serverless Deployment (Vercel + Render / Heroku)

- **Frontend**: Deploy `smartcampus-frontend` to **Vercel** with environment variable `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1`.
- **Backend**: Deploy `smartcampus-backend` to **Render / Railway / AWS ECS** with environment variables `DATABASE_URL` and `JWT_SECRET`.
- **Database**: Managed PostgreSQL on Supabase or AWS RDS PostgreSQL.
