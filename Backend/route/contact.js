import nodemailer from "nodemailer";
import express from "express";
const router = express.Router();

router.post("/send-message", async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"CureWrap Contact" <support@curewrapplus.com>`,
      to: "support@curewrapplus.com",
      subject: `New Message from ${firstName} ${lastName}`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
