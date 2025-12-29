import express from "express";
import nodemailer from "nodemailer";
import 'dotenv/config.js';


const router = express.Router();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000
});

router.post("/send-message", async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;
    const name = `${firstName || ""} ${lastName || ""}`.trim();

    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: "Name, email & message required" });

    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.TO_EMAIL,
      replyTo: email,
      subject: subject || "New Contact Form Submission",
      html: `
        <h2>New Inquiry</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject || "None"}</p>
        <p><b>Message:</b><br/>${message.replace(/\n/g, "<br/>")}</p>
      `
    });

    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ success: false, message: "Mail failed" });
  }
});




export default router;