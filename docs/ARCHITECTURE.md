# SmartCampus Architecture Guide

SmartCampus is engineered as an enterprise-grade multi-tenant educational SaaS platform built on Node.js, Express, Next.js, TypeScript, PostgreSQL, and Prisma ORM.

---

## High-Level System Architecture

```
                               ┌───────────────────────────┐
                               │   Client Browser / PWA    │
                               │   (Next.js App Router)    │
                               └─────────────┬─────────────┘
                                             │ HTTP / REST
                                             ▼
                               ┌───────────────────────────┐
                               │   Express API Gateway     │
                               │   (smartcampus-backend)   │
                               └─────────────┬─────────────┘
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
   ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
   │ Core ERP Services     │   │ Commercial SaaS Engine│   │ AI SmartCampus Engine │
   │ - Attendance          │   │ - Onboarding Wizard   │   │ - OpenAI Wrapper      │
   │ - Timetable           │   │ - Provisioning Tx     │   │ - NL Search Engine    │
   │ - Examinations        │   │ - Subscription / Tax  │   │ - Risk Predictor      │
   │ - Digital Library     │   │ - PDF Invoice Streamer│   │ - Fee Forecasts       │
   │ - Financial Ledger    │   │ - Modular Payment     │   │ - Notice Generator    │
   └───────────┬───────────┘   └───────────┬───────────┘   └───────────┬───────────┘
               │                           │                           │
               └───────────────────────────┼───────────────────────────┘
                                           ▼
                               ┌───────────────────────┐
                               │  PostgreSQL Database  │
                               │  (Prisma ORM Scoping) │
                               └───────────────────────┘
```

---

## Architectural Principles

1. **Multi-Tenant Isolation**: Database models contain indexed `collegeId` relations, allowing strict tenant data partitioning across colleges.
2. **Server-Side Security**: All AI API keys, payment provider secrets, and JWT algorithms are executed server-side.
3. **Modular Payment Abstraction**: Interface `IPaymentAdapter` allows hot-swapping Razorpay, Stripe, and Cash payment gateways without touching core code.
4. **OpenAI-Compatible AI Layer**: The AI engine uses standard OpenAI request/response schemas with custom model base URLs and smart fallbacks.
