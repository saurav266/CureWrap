import { Router } from "express";
import { createUser, verifyOtp, login, logout } from "../controller/userController.js";
import { createProduct, getProductById, getProducts, updateProduct,deleteProduct} from "../controller/prodcutController.js";
import { addWishlist, getWishlist } from "../controller/wishListController.js";
import { unifiedLogin } from "../middleware/authMiddleware.js";


const router = Router();

// Auth routes
router.post("/register", createUser);
router.post("/login", unifiedLogin);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);

// Product routes
router.post("/add-product", createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Wishlist routes
router.post("/wishlist", addWishlist);
router.get("/wishlist/:userId", getWishlist);

// Cart routes


export default router;
