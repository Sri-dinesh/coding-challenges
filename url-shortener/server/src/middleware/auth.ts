import { Response, NextFunction } from "express";
import { auth } from "../config/auth";
import { UnauthorizedError } from "../utils/errors";
import { AuthenticatedRequest } from "../types";

export async function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      return next(new UnauthorizedError("No active session"));
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid session"));
  }
}

export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (session) {
      req.user = session.user;
      req.session = session.session;
    }
  } catch {}
  next();
}
