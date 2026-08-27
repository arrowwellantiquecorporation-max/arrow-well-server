require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Arrow Well Antique email server is running",
  });
});

// Send email
app.post("/send-email", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    console.log("Received data:", {
      name,
      email,
      phone,
      message,
    });

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    // Check Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing");

      return res.status(500).json({
        success: false,
        message: "Email service is not configured",
      });
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Arrow Well Antique <onboarding@resend.dev>",
      to: ["arrowwellantiquecorporation@gmail.com"],
      replyTo: email,
      subject: `New Contact from ${name}`,
      text: `Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}`,
    });

    // Handle Resend error
    if (error) {
      console.error("Resend error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: error.message,
      });
    }

    console.log("Email sent successfully:", data);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      id: data.id,
    });

  } catch (error) {
    console.error("Email error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
});

// Render provides the PORT environment variable
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});