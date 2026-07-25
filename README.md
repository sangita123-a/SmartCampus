# SmartCampus - Enterprise Multi-Tenant College ERP & SaaS Platform (v1.0.0)

[![Release Candidate](https://img.shields.io/badge/Release-v1.0.0-teal.svg)](https://github.com/your-org/smartcampus)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/CI%2FCD-Passing-emerald.svg)](.github/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)

**SmartCampus** is a commercial, multi-tenant cloud SaaS platform and college ERP built for modern educational institutions, universities, and polytechnics. It streamlines campus administration, QR-based student attendance, semester examinations, digital library catalogs, financial fee structures, automated PDF invoicing, and real-time AI predictive insights.

---

## 🌟 Key Features

### 🏢 Commercial SaaS Platform Module
- **Self-Service College Registration**: Onboarding wizard with auto-provisioning of college tenants, default engineering/business departments, and primary `COLLEGE_ADMIN` credentials.
- **Tier-Based SaaS Subscriptions**: Flexible Starter, Professional, Business, and Enterprise plans with monthly and annual billing cycles.
- **Modular Payment Architecture**: Plug-and-play adapter layer (`IPaymentAdapter`) supporting **Razorpay**, **Stripe**, and **Cash/Manual Wire** payment gateways.
- **Automated PDF Invoicing**: High-performance PDF stream generator for subscription receipts using `PDFKit`.
- **Promotional Coupons**: Percentage and flat discount coupons with usage limits and expiry tracking.
- **Public Marketing Website**: Modern glassmorphic marketing site including Home, Features, Modules, Pricing, Blog, Contact, FAQ, Privacy, Terms, and Cookie Consent.

### 🤖 AI SmartCampus Module
- **OpenAI-Compatible Engine**: Server-side wrapper supporting OpenAI, Gemini OpenAI-compatible endpoints, Anthropic proxies, or local vLLM/Ollama.
- **Floating AI Assistant**: Interactive chatbot drawer providing instant campus Q&A for students, faculty, and administrators.
- **Natural Language Search Engine**: Plain English search queries (e.g., *"Show students with attendance below 75%"* or *"Who has pending fees?"*).
- **Predictive Analytics**: AI-driven student academic risk predictor, attendance pattern detector, fee collection forecaster, and timetable conflict optimizer.
- **AI Notice & Report Generator**: Automated drafting of circulars, holiday notices, exam announcements, and executive report summaries.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS v4, Lucide Icons, Axios, Zustand, React Query.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL 16, PDFKit, Winston, Helmet, CORS, Rate Limiting.
- **DevOps**: Docker, Docker Compose, GitHub Actions CI/CD.

---

## 🚀 Quick Start (Docker Compose)

The fastest way to launch the entire platform (PostgreSQL DB, Express API, Next.js Frontend):

```bash
# Clone the repository
git clone https://github.com/your-org/smartcampus.git
cd smartcampus

# Build and launch containers
docker-compose up -d --build
```

Access the services:
- **Frontend Public Site**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000/api/v1`
- **Self-Service Registration**: `http://localhost:3000/register-college`

---

## 📚 Comprehensive Documentation Suite

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Developer Setup Guide](docs/DEVELOPER_GUIDE.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Database & ERD Guide](docs/DATABASE_GUIDE.md)
- [Deployment & DevOps Guide](docs/DEPLOYMENT_GUIDE.md)
- [Release Changelog](CHANGELOG.md)
- [Contributing Guidelines](CONTRIBUTING.md)

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
