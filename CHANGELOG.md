# Changelog

All notable changes to the **SmartCampus** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-24 (Release Candidate 1.0.0)

### Added
- **Commercial SaaS Platform Module**:
  - Multi-tenant database partitioning (`Colleges`, `Subscriptions`, `Invoices`, `Coupons`, `BlogPosts`, `ContactSubmissions`, `TenantProvisioningLogs`).
  - Automated tenant onboarding and department auto-seeding.
  - Modular Payment Gateway Architecture (`IPaymentAdapter` interface for Razorpay, Stripe, and Cash/Manual).
  - Dynamic PDF Invoice stream generator using PDFKit.
  - Modern Glassmorphism Public Marketing Website (`/`, `/features`, `/modules`, `/pricing`, `/about`, `/blog`, `/contact`, `/faq`, `/privacy`, `/terms`, `/cookie-policy`).
  - Dynamic XML Sitemap (`/sitemap.xml`) and Robots.txt (`/robots.txt`).
  - Cookie Consent banner for Google Analytics & Microsoft Clarity readiness.

- **AI SmartCampus Module**:
  - OpenAI-Compatible Server-Side AI Engine (`aiEngine.service.ts`).
  - System Prompts Repository (`aiPromptManager.service.ts`).
  - Floating interactive AI Chatbot Assistant (`FloatingAIAssistant.tsx`).
  - Natural Language Database Search Engine (`AISearchBar.tsx`).
  - Predictive Analytics: Student Performance & Risk Predictor, Low Attendance Insights, Fee Collection Forecasts, Timetable Optimization.
  - AI Notice Generator & Executive Report Summarizer.
  - AI Settings, Custom Model endpoints, and Token Usage Tracker.

- **Enterprise & DevOps Infrastructure**:
  - `docker-compose.yml` for multi-container deployment (Postgres 16, Express API, Next.js).
  - Multi-stage Dockerfiles for backend and frontend.
  - GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`).
  - Complete documentation suite under `docs/` (`ARCHITECTURE.md`, `DEVELOPER_GUIDE.md`, `API_DOCUMENTATION.md`, `DATABASE_GUIDE.md`, `DEPLOYMENT_GUIDE.md`).
