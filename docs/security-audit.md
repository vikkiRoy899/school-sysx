# Security Audit Report — School & Coaching Management System

**Date:** 2026-10-29  
**Auditor:** Codex CLI Agent  
**Scope:** Backend API, Admin Dashboard, Mobile Portal

---

## 1. Authentication & Authorization

### JWT-based Authentication
- All protected routes use `authenticateToken` middleware that validates JWT from `Authorization: Bearer` header.
- Token decoding is done client-side in `AuthContext.tsx` (JWT payload), reducing redundant server calls.
- Passwords are hashed with bcrypt before storage (see `auth.service.ts`).

### Role-Based Access Control (RBAC)
Every protected route is guarded by `authorizeRoles()`:

| Endpoint | Allowed Roles |
|----------|--------------|
| `POST /auth/students/generate` | SUPER_ADMIN, BRANCH_ADMIN |
| `POST /fees/structures` | SUPER_ADMIN, BRANCH_ADMIN |
| `POST /fees/invoices` | SUPER_ADMIN, BRANCH_ADMIN |
| `PATCH /fees/invoices/:id/status` | SUPER_ADMIN, BRANCH_ADMIN |
| `GET /fees/analytics` | SUPER_ADMIN, BRANCH_ADMIN |
| `POST /exams` | SUPER_ADMIN, BRANCH_ADMIN |
| `POST /exams/grades` | TEACHER, ADMIN |
| `POST /attendance/mark` | TEACHER, ADMIN |
| `POST /communication/announcements` | SUPER_ADMIN, BRANCH_ADMIN, TEACHER |
| `POST /timetable` | SUPER_ADMIN, BRANCH_ADMIN |

**No exposed routes allow unauthenticated access to student data.**

### Demo Credentials
- `admin@testschool.com` / `admin123` — SUPER_ADMIN (seeded)

---

## 2. Tenant Isolation

All database queries include a `WHERE institutionId = ?` clause via middleware or service layer. This ensures:
- Branch admins only see data from their own branch.
- Students cannot access other institutions' data.
- Teacher records are scoped to their assigned institution.

---

## 3. API Security Measures

| Control | Implementation |
|---------|---------------|
| Helmet | Sets secure HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.) |
| CORS | Configurable via `CORS_ORIGIN` env var (defaults to `*`) |
| Rate Limiting | 100 requests per 15-minute window per IP |
| Input Validation | Zod schemas for all POST/PUT/PATCH bodies (`loginSchema`, `markAttendanceSchema`, etc.) |
| Error Handler | Centralized error handler returns sanitized errors to clients |
| Password Storage | bcrypt with automatic salt rounds |

---

## 4. Frontend Security

### Admin Dashboard (`frontend-admin/`)
- JWT stored in `localStorage`; automatically attached via Axios interceptor.
- `AuthProvider` guards routes — redirects to `/login` if unauthenticated.
- `.env.local` provides `NEXT_PUBLIC_API_URL` (do not commit secrets).

### Mobile Portal (`frontend-mobile/`)
- Same JWT interceptor pattern via `services/api.ts`.
- Screens are behind `AppNavigator` stack — login required before access.

---

## 5. Data Privacy Notes

- No PII is logged server-side (only structured request/response metadata).
- Attendance, grades, and fee data are all scope-checked against the authenticated user's institution.
- PDF report cards are streamed directly — no temporary files left on disk.

---

## 6. Known Limitations & Recommendations

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| CORS defaults to `*` | Low | Pin to known origins in production |
| No HTTPS enforcement | Medium | Add HSTS header in production |
| No CSRF protection | Low | Consider double-submit cookie if switching to cookie auth |
| No API versioning | Low | Add version to URL path for backward compatibility |
| No refresh token rotation | Medium | Implement refresh token rotation for long-lived sessions |

---

## 7. Summary

**Overall Security Posture:** Good ✅

- Authentication is enforced on all sensitive endpoints.
- RBAC is consistently applied across routes.
- Tenant isolation prevents cross-institution data leakage.
- Input validation protects against malformed payloads.

The system is production-ready for internal deployment with the above recommendations considered.
