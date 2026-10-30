# Subagent Task Execution Manifest

This document outlines the subagent team responsibilities and task sequence for building the School & Coaching Management System.

---

## 1. Specialized Subagent Roles

### 1. Architect & Database Subagent (`architect`)
- **Responsibility**: Database schema design, Prisma ORM configuration, multi-tenant migration scripts, and seed data generator.
- **Key Deliverables**: `prisma/schema.prisma`, seed script (`prisma/seed.ts`), migration pipeline.

### 2. Backend API & Auth Subagent (`backend-dev`)
- **Responsibility**: Express server setup, JWT authentication, OTP + password generation service, RBAC middleware, and CRUD REST APIs.
- **Key Deliverables**: Auth middleware, Student/Teacher/Parent API endpoints, Swagger/Postman API documentation.

### 3. Web Admin Frontend Subagent (`frontend-admin-dev`)
- **Responsibility**: Next.js dashboard UI for Super Admin, Branch Admin, and Teacher roles.
- **Key Deliverables**: Responsive dashboards, attendance marking UI, fee invoice management, report card viewer.

### 4. Student & Parent Mobile/PWA Subagent (`frontend-mobile-dev`)
- **Responsibility**: Unified student and parent portal (PWA / Mobile APK frontend).
- **Key Deliverables**: Mobile timetable viewer, attendance history, fee status & payment portal, push notification receiver.

### 5. Quality Assurance & Security Subagent (`qa-security-reviewer`)
- **Responsibility**: API unit/integration tests, RBAC security verification, OWASP security audit, and seed verification.
- **Key Deliverables**: Test suite (`jest` / `supertest`), security audit report, postman/swagger spec verification.

---

## 2. Sequenced Task Commands for Execution

### Task 1: Environment & Project Scaffolding
- **Agent**: `architect`
- **Command**: `/orch-add-feature "[Plan: plans/school-coaching-system-plan.md#phase-1] Initialize Express + TypeScript backend, Next.js frontend, Prisma ORM, and root workspace setup; Acceptance: repository builds cleanly, npm dependencies installed, package.json configured with scripts"`

### Task 2: Multi-Tenant Database Schema & Seed Data
- **Agent**: `architect`
- **Command**: `/orch-add-feature "[Plan: plans/school-coaching-system-plan.md#phase-1] Implement complete multi-tenant database schema in Prisma ORM with PostgreSQL support and seed demo data; Acceptance: Prisma schema contains Institutions, Branches, Users, StudentProfiles, Attendance, Fees, Exams, Timetables, and seed script populates demo data successfully"`

### Task 3: Auth System & Institution-side Student OTP Generation
- **Agent**: `backend-dev`
- **Command**: `/orch-add-feature "[Plan: plans/school-coaching-system-plan.md#phase-2] Implement JWT Auth API with multi-tenant RBAC middleware and OTP + temporary password generation service for college/coaching student account creation; Acceptance: auth endpoints pass login/registration tests, student account generation creates OTP + temporary password, RBAC middleware rejects unauthorized role access"`

### Task 4: Student, Teacher & Parent CRUD Module
- **Agent**: `backend-dev`
- **Command**: `/orch-add-feature "[Plan: plans/school-coaching-system-plan.md#phase-3] Build REST APIs for Student, Teacher, Parent profiles, class allocation, bulk CSV import, and student ID card generation; Acceptance: CRUD endpoints active, bulk CSV import validates student records, ID card API outputs student data with QR code payload"`

### Task 5: Attendance & Fee Management APIs
- **Agent**: `backend-dev`
- **Command**: `/orch-add-feature "[Plan: plans/school-coaching-system-plan.md#phase-4] Build Attendance tracking API with automated parent absence alert triggers and Fee management API with invoice generation and revenue analytics; Acceptance: attendance endpoints support daily/subject marking, fee APIs handle fee structure creation and invoice status tracking"`

### Task 6: Exams, Grading & Timetable APIs
- **Agent**: `backend-dev`
- **Command**: `/orch-add-feature "[Plan: plans/school-coaching-system-plan.md#phase-5] Build Exam scheduling, PDF report card generator, and Timetable class allocation API; Acceptance: exam grade entry outputs verified PDF report cards, timetable API detects room/teacher schedule conflicts"`

### Task 7: Communication & Announcement Portal API
- **Agent**: `backend-dev`
- **Command**: `/orch-add-feature "[Plan: plans/school-coaching-system-plan.md#phase-5] Build role-targeted announcement broadcast system and Parent-Teacher / Student-Admin messaging API; Acceptance: notification endpoints dispatch role-filtered messages, messaging API logs conversations accurately"`

### Task 8: Web Admin & Staff Dashboard (Next.js)
- **Agent**: `frontend-admin-dev`
- **Command**: `/orch-add-feature "[Plan: plans/school-coaching-system-plan.md#phase-3] Build Next.js Web Admin dashboard for Super Admin, Branch Admin, and Teacher roles; Acceptance: UI includes financial overview, attendance marking, fee invoice management, and report card viewer"`

### Task 9: Unified Student & Parent PWA/APK Mobile Portal
- **Agent**: `frontend-mobile-dev`
- **Command**: `/orch-add-feature "[Plan: plans/school-coaching-system-plan.md#phase-6] Build unified mobile-first Student & Parent portal PWA/APK frontend with OTP login, timetable viewer, fee payment status, and attendance history; Acceptance: portal functions on mobile viewports, login using institution-generated OTP works, timetable and fee status display clearly"`

### Task 10: API Documentation & Security Audit
- **Agent**: `qa-security-reviewer`
- **Command**: `/orch-add-feature "[Plan: plans/school-coaching-system-plan.md#phase-6] Generate Swagger/Postman API documentation and execute automated RBAC security scan; Acceptance: Swagger UI / OpenAPI JSON spec generated, security review confirms tenant isolation and auth checks"`
