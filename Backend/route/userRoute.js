import { Router } from "express";
import { createUser,verifyOtp ,login,logout} from "../controller/userController.js";
import { createProduct } from "../controller/prodcutController.js";
import { addWishlist, getWishlist } from "../controller/wishListController.js";
import { unifiedLogin } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/register", createUser);
router.post("/login", unifiedLogin);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);


// for product routes, you can create a separate router file like productRoute.js

router.post("/products", createProduct);


// for wishlist routes, you can create a separate router file like wishListRoute.js

router.post("/wishlist", addWishlist);
router.get("/wishlist/:userId", getWishlist);

export default router;
