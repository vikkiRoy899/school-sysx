import { Request } from 'express';

export interface AuthUser {
  userId: string;
  institutionId: string;
  branchId: string | null;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface JWTPayload {
  sub: string;
  institutionId: string;
  branchId: string | null;
  role: string;
  iat: number;
  exp: number;
}
