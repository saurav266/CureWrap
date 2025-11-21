import "dotenv/config";
import express from "express";
import { connectDB } from "./db/db.js";
import userRoute from "./route/userRoute.js";


connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use("/api/users", userRoute);


app.get("/", (req, res) => {
  res.send("Hello, CureWrap Backend!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
