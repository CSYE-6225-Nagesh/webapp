import { Router } from "express";
import checkHealth from "../controller/healthCheckController.js";

const router = new Router();
router.route("/healthz").get(checkHealth);

export default router;
