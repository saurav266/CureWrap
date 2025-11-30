import "dotenv/config";
import express from "express";
import { connectDB } from "./db/db.js";
import userRoute from "./route/userRoute.js";
import cors from "cors";
import { testTwilio } from "./controller/userController.js";
import cartRoute from "./route/cartRoute.js";
import orderRoutes from "./route/orderRoute.js";
import adminRoutes from "./route/adminROute.js";
import contactRoute from "./route/contact.js";
// import ProductRoute from "./route/productRoute.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// All routes start with /api/users
app.use("/api/users", userRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoute);

// app.use("/api/products", ProductRoute);


// Test route
app.post("/test-twilio", testTwilio);

app.get("/", (req, res) => {
  res.send("Hello, CureWrap Backend!");
});






app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
