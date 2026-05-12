import { Request } from "express";
import { Session, User } from "better-auth";

export interface AuthenticatedRequest extends Request {
  user?: User;
  session?: Session;
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
