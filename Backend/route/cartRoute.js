// routes/cartRoute.js
import { Router } from "express";
import { getCart, addToCart, updateCartItem, removeCartItem } from "../controller/cartController.js";

const router = Router();

router.get("/:userId", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeCartItem);

export default router;
