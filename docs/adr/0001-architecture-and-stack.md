# ADR-0001: Selection of Tech Stack and Multi-Tenant Architecture

**Date**: 2026-10-29  
**Status**: accepted  
**Deciders**: Core Engineering Team  

## Context

We need to build a robust, scalable School & Coaching Management System supporting multiple independent educational institutions (schools and coaching centers). The system requires a web admin dashboard for administrators and teachers, a unified mobile PWA/APK for students and parents, and strict role-based access control (RBAC) with institution-side student account generation (OTP + temporary password).

## Decision

We adopt the following tech stack and architectural patterns:
1. **Backend**: Node.js with Express & TypeScript, structured as a clean modular monolith with Prisma ORM.
2. **Database**: PostgreSQL with multi-tenant row isolation (`institution_id` discriminator).
3. **Web Admin Frontend**: Next.js (React, TypeScript, Tailwind CSS) for Super Admin, Branch Admin, and Teacher dashboards.
4. **Student & Parent Frontend**: React Native / Responsive PWA optimized for mobile APK deployment.
5. **Authentication**: JWT with strict middleware RBAC and secure institution-generated OTP + temporary password workflow.

## Alternatives Considered

### Alternative 1: Ruby on Rails Monolith
- **Pros**: Rapid scaffolding, convention over configuration.
- **Cons**: Less flexibility for custom mobile PWA/APK API consumption and team familiarity with TypeScript.
- **Why not**: TypeScript across frontend and backend provides stronger type safety and developer velocity for complex multi-role JSON APIs.

### Alternative 2: Separate databases per tenant
- **Pros**: Complete data isolation.
- **Cons**: High operational overhead, complex connection pooling, and expensive multi-branch migration management.
- **Why not**: Logical multi-tenancy with a shared PostgreSQL database (`institution_id` foreign key) balances data isolation with operational simplicity.

## Consequences

### Positive
- Unified TypeScript codebase ensures consistent types between frontend and backend.
- Logical multi-tenancy allows efficient reporting across branches for Super Admins while maintaining strict tenant boundaries.
- OTP + password generation workflow simplifies bulk onboarding for coaching centers and schools.

### Negative
- Requires rigorous multi-tenant query filtering (`where: { institution_id }`) in all database queries to prevent data leaks.

### Risks
- Accidental cross-tenant data access if middleware fails to inject institution context.
- *Mitigation*: Global Prisma middleware enforcing `institution_id` filtering on all tenant queries.
