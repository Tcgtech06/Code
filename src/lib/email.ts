// This utility file sends emails by calling our local NodeJS backend

const API_URL = '/.netlify/functions/sendEmail';

export const sendBookingRequestEmail = async (bookingDetails: any) => {
  try {
    const payload = { action: 'admin-request', ...bookingDetails };
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to send admin email');
    }

    console.log('Admin notification email sent successfully.');
  } catch (error) {
    console.error('Error in sendBookingRequestEmail:', error);
    // We don't throw the error so that the main booking flow isn't interrupted if email fails
  }
};

export const sendBookingStatusEmail = async (
  userEmail: string, 
  userName: string,
  status: 'accepted' | 'cancelled', 
  adminNotes: string,
  hallName: string,
  startTime: string
) => {
  try {
    const payload = {
      action: 'user-status',
      to_email: userEmail,
      user_name: userName,
      status,
      admin_notes: adminNotes,
      hall_name: hallName,
      start_time: startTime,
    };
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to send user status email');
    }

    console.log('User status email sent successfully.');
  } catch (error) {
    console.error('Error in sendBookingStatusEmail:', error);
  }
};
