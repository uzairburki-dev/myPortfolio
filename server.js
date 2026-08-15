const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact form
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <h2>New Portfolio Contact</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        res.json({
            success: true,
            message: "Message sent successfully!"
        });

    } catch (error) {
        console.error("Email error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message."
        });
    }
});

module.exports = app;