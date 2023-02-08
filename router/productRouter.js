import { Router } from "express";
import {
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  patchProduct,
} from "../controller/productController.js";
import auth from "../middleware/auth.js";
import user from "../middleware/user.js";
const router = Router();

router.route("/").post(auth, user, createProduct);

router
  .route("/:productId")
  .get(getProduct)
  .put(auth, user, updateProduct)
  .delete(auth, user, deleteProduct)
  .patch(auth, user, patchProduct);

export default router;
