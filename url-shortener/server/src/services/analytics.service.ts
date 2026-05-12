import { prisma } from "../config/database";
import crypto from "crypto";

export async function recordClick(
  urlId: string,
  req: { ip?: string; headers: Record<string, string | string[] | undefined> },
) {
  // Hash IP for privacy compliance (GDPR) — never store raw IPs
  const ip = req.ip || "";
  const ipHash = crypto
    .createHash("sha256")
    .update(ip)
    .digest("hex")
    .slice(0, 16);

  const userAgent = String(req.headers["user-agent"] || "");
  const referrer = String(req.headers["referer"] || "");

  const deviceType = /mobile|android|iphone|ipad/i.test(userAgent)
    ? "mobile"
    : /tablet/i.test(userAgent)
      ? "tablet"
      : "desktop";

  await prisma.analytics.create({
    data: { urlId, ipHash, deviceType, referrer: referrer || null, userAgent },
  });
}

export async function getUrlAnalytics(urlId: string, userId: string) {
  const url = await prisma.url.findUnique({ where: { id: urlId } });
  if (!url || url.userId !== userId) return null;

  const [total, byDevice, recent] = await Promise.all([
    prisma.analytics.count({ where: { urlId } }),
    prisma.analytics.groupBy({
      by: ["deviceType"],
      where: { urlId },
      _count: { deviceType: true },
    }),
    prisma.analytics.findMany({
      where: { urlId },
      orderBy: { clickedAt: "desc" },
      take: 10,
      select: { deviceType: true, referrer: true, clickedAt: true },
    }),
  ]);

  return { total, byDevice, recent };
}
