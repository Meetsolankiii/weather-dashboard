// 1. INITIALIZE ENVIRONMENT MATRIX USING DIRECT PATH RESOLUTION
const path = require('path');
const envPath = path.join(__dirname, '.env');
require('dotenv').config({ path: envPath });

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 2. DEBUGGING INTEGRATION LAYER (CONFIRMS CREDENTIAL STATES ON BOOT)
console.log("=================================================");
console.log("🔒 GATEKEEPER ENVIRONMENT INITIALIZATION CHECK");
console.log("Forced File Path Target:", envPath);
console.log("Is password loaded correctly?:", process.env.GMAIL_APP_PASSWORD ? "YES ✅" : "NO ❌ (Check .env filename or fields)");
console.log("=================================================\n");

// 3. CONFIGURE SECURE SMTP TRANSPORTER GRID
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'solankimeet5678@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD 
  }
});

// 4. TWO-FACTOR VERIFICATION ROUTE INTERFACE
app.post('/api/dispatch-otp', (req, res) => {
  const { email, otp, adminName } = req.body;
  
  // Generates a completely unique timestamp string (e.g., "7:45:12 PM")
  const timestampId = new Date().toLocaleTimeString(); 

  // Terminal Backup Logger: Allows you to copy the code directly if your inbox is slow!
  console.log(`\n==============================================`);
  console.log(`🔥 SECURITY BYPASS SYSTEM LOG FOR ADMIN: ${adminName}`);
  console.log(`📧 TARGET ROUTE: ${email}`);
  console.log(`🔑 SECURE KEYPIN ACCESS OTP IS: ${otp}`);
  console.log(`⏱️ DISPATCH TIME: ${timestampId}`);
  console.log(`==============================================\n`);

  const mailOptions = {
    from: '"Skyline Security Core" <solankimeet5678@gmail.com>',
    to: email,
    // FIXED: Injecting dynamic token tracking values forces Gmail to see it as a fresh message instead of automated spam patterns
    subject: `[SECURE LOCK] Verification Token Matrix PIN: ${otp} (${timestampId})`, 
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      "Importance": "high"
    },
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border-radius: 16px; background-color: #ffffff; border: 1px solid #e2e8f0; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="color: #1e293b; margin-top: 0; font-weight: 800; font-size: 1.4rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">Skyline Gatekeeper Authorization</h2>
        <p style="font-size: 1rem; color: #475569; line-height: 1.5;">Hello Admin <strong>${adminName}</strong>,</p>
        <p style="color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">A secure configuration panel entry request was initialized. Use the verification PIN matrix block down below to validate authorization:</p>
        
        <div style="background-color: #f8fafc; text-align: center; font-size: 2.5rem; font-weight: 800; letter-spacing: 8px; padding: 22px; border-radius: 12px; color: #2563eb; border: 1px solid #cbd5e1; margin: 20px 0;">
          ${otp}
        </div>
        
        <p style="color: #94a3b8; font-size: 0.75rem; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 12px; text-align: right;">
          System Thread Token ID: ST-${Math.floor(Math.random() * 90000)} / Time: ${timestampId}
        </p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Transmission fault encountered inside SMTP layers:", error);
      return res.status(500).json({ success: false, msg: "Failed dispatch" });
    }
    console.log(`✅ Success! 2FA OTP dispatched cleanly to administrative target node.`);
    res.status(200).json({ success: true, msg: "Dispatched cleanly" });
  });
});

app.listen(5000, () => console.log('Skyline Cryptographic Gatekeeper Server running on port 5000'));