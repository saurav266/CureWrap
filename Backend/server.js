import "dotenv/config";
import express from "express";
import { connectDB } from "./db/db.js";
import userRoute from "./route/userRoute.js";
import cors from "cors";
import { testTwilio } from "./controller/userController.js";


connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.json());
app.use("/api/users", userRoute);


app.post("/test-twilio", testTwilio);

app.get("/", (req, res) => {
  res.send("Hello, CureWrap Backend!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
