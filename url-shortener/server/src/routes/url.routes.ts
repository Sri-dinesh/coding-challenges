import { Router } from "express";
import {
  createUrl,
  getMyUrls,
  deactivateUrl,
} from "@/controllers/url.controller";
import { createUrlLimiter } from "@/middleware/rateLimiter";
import { authenticate, optionalAuth } from "../middleware/auth";

const router = Router();

router.post("/", createUrlLimiter, optionalAuth, createUrl);
router.get("/my", authenticate, getMyUrls);
router.delete("/:id", authenticate, deactivateUrl);

export default router;
