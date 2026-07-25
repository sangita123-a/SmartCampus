# SmartCampus REST API & OpenAPI Documentation

The SmartCampus API is built with Express, TypeScript, and Prisma ORM.

---

## Authentication & Headers

All protected endpoints require a Bearer token in the request header:
```http
Authorization: Bearer <your_jwt_token>
```

---

## Endpoint Summary

### 1. Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register`: Public registration.
- `POST /api/v1/auth/login`: User authentication returning JWT token & role permissions.

### 2. Commercial SaaS Platform (`/api/v1/saas`)
- `GET /api/v1/saas/plans`: Public SaaS pricing plans (Starter, Pro, Business, Enterprise).
- `POST /api/v1/saas/register`: College onboarding & atomic tenant provisioning.
- `GET /api/v1/saas/coupons/validate?code=WELCOME20`: Coupon validation.
- `POST /api/v1/saas/payment/create-order`: Create checkout order for Razorpay/Stripe/Cash.
- `GET /api/v1/saas/invoices/:invoiceId/download`: Download generated PDF invoice.

### 3. AI SmartCampus (`/api/v1/ai`)
- `POST /api/v1/ai/chat`: AI Campus Assistant Chatbot Q&A.
- `GET /api/v1/ai/performance-prediction`: Predictive student risk analytics.
- `GET /api/v1/ai/fee-insights`: Outstanding revenue collection forecasts.
- `POST /api/v1/ai/search`: Natural language database query engine.
- `POST /api/v1/ai/generate-notification`: AI notice and circular drafter.
