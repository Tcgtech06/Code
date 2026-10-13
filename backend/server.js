require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Setup Nodemailer Transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS,
  },
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vilvah.com';

// 1. Notify Admin about a new Booking Request
app.post('/api/send-admin-request', async (req, res) => {
  const { user_name, team_name, members_count, start_time, end_time, remarks } = req.body;

  try {
    const frontendUrl = process.env.FRONTEND_URL || 'https://vilvahconferencehallbooking.netlify.app';
    const mailOptions = {
      from: `"Vilvah Booking System" <${process.env.SMTP_USER}>`,
      to: ADMIN_EMAIL,
      subject: `New Hall Booking Request from ${user_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #f3f4f6; padding: 20px; border-bottom: 1px solid #e5e7eb;">
            <h2 style="margin: 0; color: #111827;">New Hall Booking Request</h2>
          </div>
          <div style="padding: 20px;">
            <p style="margin-top: 0;"><strong>User:</strong> ${user_name}</p>
            <p><strong>Team:</strong> ${team_name}</p>
            <p><strong>Members:</strong> ${members_count}</p>
            <p><strong>Time:</strong> ${new Date(start_time).toLocaleString()} - ${new Date(end_time).toLocaleString()}</p>
            <p><strong>Remarks:</strong> ${remarks || 'No remarks provided.'}</p>
            
            <p style="margin-top: 30px; margin-bottom: 10px; color: #4b5563;">Click below to manage this request in the admin dashboard:</p>
            <div style="display: flex; gap: 10px;">
              <a href="${frontendUrl}/admin" style="display: inline-block; padding: 10px 20px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">Accept Booking</a>
              <a href="${frontendUrl}/admin" style="display: inline-block; padding: 10px 20px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Reject Booking</a>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Admin email sent successfully' });
  } catch (error) {
    console.error('Error sending admin email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

// 2. Notify User about Booking Status (Accept/Reject)
app.post('/api/send-user-status', async (req, res) => {
  const { to_email, status, admin_notes, hall_name, start_time } = req.body;

  try {
    const isAccepted = status === 'accepted';
    const statusText = isAccepted ? 'Approved' : 'Rejected';
    
    const mailOptions = {
      from: `"Vilvah Admin" <${process.env.SMTP_USER}>`,
      to: to_email,
      subject: `Your Booking is ${statusText} - Vilvah Meeting Halls`,
      text: `
Hello,

Your booking request for ${hall_name} on ${new Date(start_time).toLocaleString()} has been ${statusText.toLowerCase()}.

Admin Notes:
${admin_notes || 'No additional notes provided.'}

Thank you,
Vilvah Administration
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'User status email sent successfully' });
  } catch (error) {
    console.error('Error sending user email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Email backend server running on port ${PORT}`);
});
