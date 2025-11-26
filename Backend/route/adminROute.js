import express from "express";
import { getAdminStats } from "../controller/adminController.js";
// import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET STATS
router.get("/stats", getAdminStats);

export default router;
