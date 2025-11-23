import { loginAdmin } from "../controllers/adminController.js";
import User from "../models/User.js"; // your User schema
import { login as loginUser } from "../controllers/userController.js";
export const unifiedLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔑 Check if email is admin
    if (email.endsWith("@admin")) {
      return loginAdmin(req, res); // <-- your admin login handler
    }

   
    

    // Check if email belongs to a user
    const user = await User.findOne({ email });
    if (user) {
      return loginUser(req, res);
    }

    // If no match found
    return res.status(404).json({ message: "No account found with this email." });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};