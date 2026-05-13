import { Router } from "express";
import { getUrlAnalytics } from "../services/analytics.service";
import { AuthenticatedRequest } from "../types";
import { Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get(
  "/:urlId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = await getUrlAnalytics(req.params.urlId, req.user!.id);
      if (!data) {
        res.status(404).json({ success: false, error: "Not found" });
        return;
      }
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
