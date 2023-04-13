import { Router } from "express";
import checkHealth from "../controller/healthCheckController.js";

const router = new Router();
router.route("/healthz").get(checkHealth);

router.route("/health").get(checkHealth);

export default router;
