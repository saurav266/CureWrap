// routes/productRoutes.js
import express from "express";

import {
  addReview,
  updateReview,
  deleteReview
} from "../controller/reviewController.js";

const router = express.Router();

router.post(
  "/products/:productId/review",

  addReview
);

router.put(
  "/products/:productId/review/:reviewId",
 
  updateReview
);

router.delete(
  "/products/:productId/review/:reviewId",
 
  deleteReview
);

export default router;
