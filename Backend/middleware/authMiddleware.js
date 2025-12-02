import { loginAdmin } from "../controller/adminController.js";
import { login } from "../controller/userController.js";
import User from "../model/user.js";

export const unifiedLogin = async (req, res) => {
  const { phoneno } = req.body;

  try {
    // 🔎 Find user by phone number
    const user = await User.findOne({ phoneno });
    if (!user) {
      return res.status(404).json({ message: "No account found with this phone number." });
    }

    // ✅ Verify password (optional, if you’re not using OTP yet)
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // 📧 Select specific email from user record
    const email = user.email;

    // 🔑 Decide login type based on email
    if (email.endsWith("@example.com") || email === "saurav@example.com") {
  return loginAdmin(req, res);
} else {
  return login(req, res);
}

  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};
export const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized" });
  }
};

// export const isAdmin = (req, res, next) => {
//   try {
//     if (req.user && req.user.email === "admin@example.com") {
//       next();
//     } else {
//       res.status(403).json({ message: "Admin access required" });
//     }
//   } catch (err) {
//     res.status(401).json({ message: "Not authorized" });
//   }
// }
