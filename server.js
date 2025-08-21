// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      mediaSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many contact form submissions, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Serve static files
app.use(express.static('.'));

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS instead of SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Use App Password for Gmail
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    },
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000, // 30 seconds
    socketTimeout: 60000 // 60 seconds
  });
};

// Contact form route
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    console.log('Contact form submission received:', req.body); // Debug log

    const { name, email, company, message, website } = req.body;

    // Honeypot check
    if (website && website.trim() !== '') {
      console.log('Honeypot triggered'); // Debug log
      return res.status(400).json({ success: false, message: 'Invalid submission' });
    }

    // Validation
    if (!name || !email || !message) {
      console.log('Validation failed:', { name: !!name, email: !!email, message: !!message }); // Debug log
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Email validation failed:', email); // Debug log
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    console.log('Creating email content...'); // Debug log

    // Create email content
    const emailContent = {
      from: process.env.EMAIL_USER,
      to: 'chrisbrundige@gmail.com',
      subject: `Precept Contact Form - New Message from ${name}`,
      html: `
        <h2>New Contact Form Submission - Precept</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; font-family: Arial, sans-serif;">
          <h3 style="color: #3b82f6; margin-bottom: 15px;">Contact Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Precept:</strong> ${company || 'Not provided'}</p>
          
          <h3 style="color: #3b82f6; margin: 20px 0 15px 0;">Message</h3>
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #3b82f6;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #666;">
            <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
            <strong>IP:</strong> ${req.ip}<br>
            <strong>User Agent:</strong> ${req.get('User-Agent')}
          </p>
        </div>
      `,
      // Also include a plain text version
      text: `
Precept Contact Form Submission

Name: ${name}
Email: ${email}
Precept: ${company || 'Not provided'}

Message:
${message}

Submitted: ${new Date().toLocaleString()}
IP: ${req.ip}
      `.trim()
    };

    console.log('Creating transporter...'); // Debug log
    console.log('Email config:', {
      user: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
      pass: process.env.EMAIL_PASS ? 'SET' : 'NOT SET'
    }); // Debug log

    // Send email
    const transporter = createTransporter();

    console.log('Sending email...'); // Debug log
    await transporter.sendMail(emailContent);
    console.log('Email sent successfully!'); // Debug log

    res.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response
    });
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later.'
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`EVTS Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
