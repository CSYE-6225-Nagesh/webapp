import { Router } from "express";
import {
  createUser,
  updateUser,
  getUser,
} from "../controller/userController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.route("/").post(createUser);
router.route("/:userId").get(auth, getUser).put(auth, updateUser);

export default router;
