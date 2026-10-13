import nodemailer from 'nodemailer';

export const handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { action } = data; // 'admin-request' or 'user-status'

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'https://vilvahconferencehallbooking.netlify.app';
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vilvah.com';

    let mailOptions = {};

    if (action === 'admin-request') {
      const { user_name, team_name, members_count, start_time, end_time, remarks } = data;
      mailOptions = {
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
    } else if (action === 'user-status') {
      const { to_email, user_name, status, admin_notes, hall_name, start_time } = data;
      const isAccepted = status === 'accepted';
      const statusText = isAccepted ? 'Approved' : 'Rejected';
      const greeting = isAccepted ? ` ${user_name},` : `Sorry 😔 ${user_name},`;
      const color = isAccepted ? '#16a34a' : '#dc2626';

      mailOptions = {
        from: `"Vilvah Admin" <${process.env.SMTP_USER}>`,
        to: to_email,
        subject: `Your Booking is ${statusText} - Vilvah Meeting Halls`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background-color: ${color}; padding: 20px; color: white;">
              <h2 style="margin: 0;">Booking ${statusText}</h2>
            </div>
            <div style="padding: 20px;">
              <h3 style="margin-top: 0; color: #111827;">${greeting}</h3>
              <p>Your booking request for <strong>${hall_name}</strong> on <strong>${new Date(start_time).toLocaleString()}</strong> has been <strong>${statusText.toLowerCase()}</strong>.</p>
              
              <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-left: 4px solid ${color};">
                <p style="margin: 0; font-weight: bold; color: #374151;">Admin Notes:</p>
                <p style="margin: 10px 0 0 0; color: #4b5563;">${admin_notes || 'No additional notes provided.'}</p>
              </div>
              
              <p style="margin-top: 30px; margin-bottom: 0; color: #6b7280; font-size: 14px;">Thank you,<br>Vilvah Administration</p>
            </div>
          </div>
        `,
      };
    } else {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action' }) };
    }

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};
