import express, {Router} from "express";
const router = express.Router();
import { createProduct, getProductById, getProducts, updateProduct} from "../controller/prodcutController.js";

router.post("/add-product", createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);

export default router;