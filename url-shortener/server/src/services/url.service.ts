import { prisma } from "../config/database";
import { generateShortCode } from "@/utils/base62";
import { NotFoundError, ConflictError, ValidationError } from "@/utils/errors";
import { CreateUrlBody } from "@/types";

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export async function createShortUrl(body: CreateUrlBody, userId?: string) {
  const { originalUrl, customAlias, expiresAt } = body;

  if (!isValidUrl(originalUrl)) {
    throw new ValidationError(
      "Invalid URL. Must start with http:// or https://",
    );
  }
  const parsed = new URL(originalUrl);
  const blocked = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];
  if (blocked.some((b) => parsed.hostname.includes(b))) {
    throw new ValidationError("URl not allowed");
  }

  if (customAlias) {
    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(customAlias)) {
      throw new ValidationError(
        "Alias must be 3-30 chars, letter/numbers/dash/underscore only",
      );
    }
    const existing = await prisma.url.findUnique({
      where: { shortCode: customAlias },
    });
    if (existing) throw new ConflictError("Custom alias already taken");
  }
  const url = await prisma.url.create({
    data: {
      shortCode: customAlias ?? "",
      originalUrl,
      userId: userId ?? null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });
  if (!customAlias) {
    const count = await prisma.url.count();
    const shortCode = generateShortCode(count, 6);

    const collision = await prisma.url.findUnique({ where: { shortCode } });
    const finalCode = collision ? generateShortCode(count + 1, 6) : shortCode;

    await prisma.url.update({
      where: { id: url.id },
      data: { shortCode: finalCode },
    });

    return prisma.url.findUniqueOrThrow({ where: { id: url.id } });
  }

  return url;
}

export async function resolveShortCode(shortCode: string) {
  const url = await prisma.url.findUnique({
    where: { shortCode, isActive: true },
  });

  if (!url) throw new NotFoundError("Short URL not found");

  if (url.expiresAt && url.expiresAt < new Date()) {
    throw new NotFoundError("This short URL has expired");
  }

  prisma.url
    .update({ where: { id: url.id }, data: { clickCount: { increment: 1 } } })
    .catch(() => {});

  return url;
}

export async function getUserUrls(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [urls, total] = await Promise.all([
    prisma.url.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),

    prisma.url.count({ where: { userId } }),
  ]);

  return { urls, total, page, limit, totalpages: Math.ceil(total / limit) };
}

export async function deleteUrl(urlId: string, userId: string) {
  const url = await prisma.url.findUnique({ where: { id: urlId } });
  if (!url) throw new NotFoundError("URL not found");
  if (url.userId !== userId) throw new NotFoundError("URL not found");
  await prisma.url.update({ where: { id: urlId }, data: { isActive: false } });
}
