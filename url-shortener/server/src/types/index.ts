import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    tier: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationQuery {
  page: number;
  limit?: number;
}

export interface CreateUrlBody {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  tier: string;
  iat?: number;
  exp?: number;
}
