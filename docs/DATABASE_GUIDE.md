# SmartCampus Database & ERD Guide

SmartCampus utilizes PostgreSQL with Prisma ORM to provide ACID compliance, multi-tenant isolation, and high performance.

---

## Core Relational ERD Structure

```
                  ┌──────────────┐
                  │   Colleges   │
                  └──────┬───────┘
                         │ 1:N
       ┌─────────────────┼─────────────────┬─────────────────┐
       ▼                 ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Users /     │  │ Departments  │  │ Subscriptions│  │  AI Usages   │
│  CollegeAdmin│  └──────┬───────┘  └──────────────┘  └──────────────┘
└──────────────┘         │ 1:N
                         ▼
                  ┌──────────────┐
                  │   Courses    │
                  └──────┬───────┘
                         │ 1:N
                         ▼
                  ┌──────────────┐
                  │  Semesters   │
                  └──────┬───────┘
                         │ 1:N
       ┌─────────────────┴─────────────────┐
       ▼                                   ▼
┌──────────────┐                    ┌──────────────┐
│   Students   │                    │   Subjects   │
└──────┬───────┘                    └──────┬───────┘
       │ 1:N                               │ 1:N
       ├─────────────────┬─────────────────┤
       ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Attendance   │  │ Student Fees │  │ StudentResults│
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Migration Steps
To apply schema changes to PostgreSQL:
```bash
cd smartcampus-backend
npx prisma migrate dev --name <migration_name>
```
