import express, {Router} from "express";
const router = express.Router();
import { createProduct, getProductById, getProducts, updateProduct,deleteProduct} from "../controller/prodcutController.js";
import { addReview , updateReview,deleteReview } from "../controller/reviewController.js";
// import { protect } from "../middleware/authMiddleware.js";

router.post("/add-product", createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.post("/:id/review", addReview);
router.put("/:id/review/:reviewId", updateReview);
router.delete("/:id/review/:reviewId", deleteReview);


export default router;