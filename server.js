require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route
app.post("/send-email", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    console.log("Received data:", { name, email, phone, message });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password (no spaces)
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: 'raju543984@gmail.com',
      subject: `New Contact from ${name}`,
      text: `Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}`,
    });

    console.log("Email sent:", info.response);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });

  } catch (error) {
    console.error("Email error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});