import { Router } from "express";
import {
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  patchProduct,
} from "../controller/productController.js";
import {
  addImage,
  getAllImages,
  deleteImage,
  getImage,
} from "../controller/imageController.js";
import multer from "multer";

import auth from "../middleware/auth.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.route("/").post(auth, createProduct);

router
  .route("/:productId")
  .get(getProduct)
  .put(auth, updateProduct)
  .delete(auth, deleteProduct)
  .patch(auth, patchProduct);

router
  .route("/:productId/image")
  .get(auth, getAllImages)
  .post(auth, upload.single("file"), addImage);

router
  .route("/:productId/image/:imageId")
  .get(auth, getImage)
  .delete(auth, deleteImage);

export default router;
