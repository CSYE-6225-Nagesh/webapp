import { Router } from "express";
import {
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  patchProduct,
} from "../controller/productController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.route("/").post(auth, createProduct);

router
  .route("/:productId")
  .get(getProduct)
  .put(auth, updateProduct)
  .delete(auth, deleteProduct)
  .patch(auth, patchProduct);

export default router;
