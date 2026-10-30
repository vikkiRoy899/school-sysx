# School & Coaching Management System — Master Project Plan

**Date**: 2026-10-29  
**Status**: Approved / Ready for Execution  
**Scope**: Full-stack multi-tenant School & Coaching Management System supporting multiple schools/coaching centers, unified student/parent APK/PWA frontend, role-based access control (RBAC), OTP + password generation on institution side, comprehensive attendance, fees, exams, timetable, and communication portals.

---

## 1. System Architecture & Tech Stack

### Tech Stack Selection
- **Frontend (Web Admin / Dashboard)**: Next.js 14+ (React, Tailwind CSS, TypeScript) for Super Admin, Admin, Teacher portals.
- **Frontend (Student & Parent Mobile/PWA)**: React Native / Expo (or Flutter / Responsive PWA with offline support) for Students & Parents.
- **Backend**: Node.js with Express & TypeScript (Modular Monolith / Clean Architecture).
- **Database**: PostgreSQL (Multi-tenant schema with `institution_id` discriminator across all tenant-scoped tables).
- **ORM / Migrations**: Prisma ORM with structured migration workflows (`database-migrations` ECC skill pattern).
- **Authentication**: JWT-based auth with Role-Based Access Control (RBAC) and OTP + temporary password generation for student onboarding.

---

## 2. User Roles & Access Control (RBAC)

| Role | Scope | Key Capabilities |
| :--- | :--- | :--- |
| **Super Admin** | Global / Multi-branch | Manage multiple institutions/branches, create/manage branch admins, global settings, financial & academic audit reports. |
| **Branch Admin** | Single Branch / Coaching | Manage staff, classes, student admissions, fee structures, timetable generation, branch announcements. |
| **Teacher / Staff** | Assigned Classes | Mark daily/subject attendance, upload exam grades/report cards, create assignments/quizzes, communicate with parents. |
| **Parent** | Linked Student(s) | View child's real-time attendance, grades, fee status, timetable, receive push notifications & communicate with teachers. |
| **Student** | Personal Account | View personal timetable, attendance, grades, download study materials, submit homework via unified student APK/PWA. |

---

## 3. Core Modules & Database Schema Design

### 3.1 Multi-Tenancy & Institution Management
- `Institutions` (id, name, type [school/coaching], code, settings, created_at)
- `Branches` (id, institution_id, name, address, contact_info)

### 3.2 User & Authentication
- `Users` (id, institution_id, branch_id, email, phone, password_hash, role [super_admin, branch_admin, teacher, parent, student], is_active, otp_secret, must_change_password)
- `StudentProfiles` (id, user_id, admission_number, roll_number, class_id, guardian_id, ot_password_temp)
- `TeacherProfiles` (id, user_id, employee_id, qualification, specialization)
- `ParentProfiles` (id, user_id, occupation)

### 3.3 Student Management & Admissions
- Admission forms, student profiles, emergency guardian contacts, ID card generation (PDF / QR code), bulk CSV import/export.

### 3.4 Attendance Tracking
- Daily & subject-wise attendance logs.
- Automated instant push notification / SMS alert to parents for unexcused absences.

### 3.5 Fee & Finance Management
- Customizable fee structures per class/course.
- Invoice generation, payment gateway integration (Razorpay/Stripe), tracking paid/unpaid/overdue status, automated reminders, and revenue analytics.

### 3.6 Exams & Grading
- Exam scheduling, mark entry, automated report card generation (PDF with QR verification), and performance trend visualization.

### 3.7 Timetable & Scheduling
- Class schedule matrix, room allocation, teacher assignment, and conflict detection.

### 3.8 Communication Portal
- Role-targeted announcements, direct messaging (Parent-Teacher, Student-Admin), event calendars, and push notification dispatchers.

---

## 4. Phased Execution Plan (Vertical Slices)

### Phase 1: Core Foundation & Database Schema
- Initialize TypeScript Express backend and Next.js frontend repository structure.
- Configure PostgreSQL database connection with Prisma ORM.
- Implement multi-tenant schema migration for institutions, branches, users, and RBAC roles.
- Seed demo data (Super Admin, Branch, Teachers, Classes, Students with OTP auth).

### Phase 2: Authentication & Onboarding (OTP + Password)
- JWT auth middleware with strict RBAC enforcement.
- Institution-side student account generation (generates secure OTP + temporary password).
- First-login forced password reset flow.

### Phase 3: Student & Staff Management Module
- CRUD operations for students, teachers, parents, and classes.
- Bulk CSV import/export for student admissions.
- ID card generation utility.

### Phase 4: Attendance & Fee Management Modules
- Daily/subject attendance marking interface and automated absence alerts.
- Fee structure builder, invoice generator, payment tracking, and financial analytics dashboard.

### Phase 5: Exams, Timetable & Communication Portal
- Exam schedules, grade entry, and PDF report card generator.
- Timetable scheduling engine with room and teacher allocation.
- Announcement broadcast and direct messaging portal.

### Phase 6: Student & Parent Unified Mobile PWA / APK Frontend
- Responsive mobile-first PWA / React Native APK frontend for students and parents.
- Offline support and push notification integration.

---

## 5. Verification & Testing Strategy
- **Unit & Integration Tests**: Jest & Supertest for backend API endpoints.
- **E2E Tests**: Playwright for admin workflows and student/parent dashboard interactions.
- **Security Audit**: Automated checks for OWASP Top 10 vulnerabilities, input validation, and JWT security.
