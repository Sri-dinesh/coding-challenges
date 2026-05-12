import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  createShortUrl,
  resolveShortCode,
  getUserUrls,
  deleteUrl,
} from "../services/url.service";
import { recordClick } from "../services/analytics.service";
import { AuthenticatedRequest, ApiResponse } from "../types";
import { env } from "../config/env";

const createUrlSchema = z.object({
  originalUrl: z.string().url("Must be a valid URL"),
  customAlias: z.string().min(3).max(30).optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function createUrl(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = createUrlSchema.parse(req.body);
    const url = await createShortUrl(body, req.user?.id);
    const response: ApiResponse = {
      success: true,
      data: {
        ...url,
        shortUrl: `${env.BASE_URL}/${url.shortCode}`,
      },
    };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

export async function redirectUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { code } = req.params;
    const url = await resolveShortCode(code);

    recordClick(url.id, {
      ip: req.ip,
      headers: req.headers as Record<string, string | string[] | undefined>,
    }).catch(() => {});

    // 301 = permanent (cached by browsers, good for SEO)
    // 302 = temporary (not cached, better for analytics accuracy)
    res.redirect(302, url.originalUrl);
  } catch (err) {
    next(err);
  }
}

export async function getMyUrls(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const result = await getUserUrls(req.user!.id, page, limit);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function deactivateUrl(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    await deleteUrl(req.params.id, req.user!.id);
    res.json({ success: true, message: "URL deactivated" });
  } catch (err) {
    next(err);
  }
}
