const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For development, use a test account or configure with your email service
  // For production, use environment variables for credentials
  
  if (process.env.NODE_ENV === 'production') {
    // Production email config (e.g., Gmail, SendGrid, AWS SES)
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Development: Log emails to console instead of sending
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER || 'test@example.com',
        pass: process.env.EMAIL_PASSWORD || 'test',
      },
    });
  }
};

// Email templates
const emailTemplates = {
  mentorshipRequest: (mentorName, menteeName, menteeEmail, goals, message) => ({
    subject: `New Mentorship Request from ${menteeName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 New Mentorship Request</h1>
          </div>
          <div class="content">
            <p>Hi ${mentorName},</p>
            <p>You have received a new mentorship request!</p>
            
            <div class="card">
              <h3>From: ${menteeName}</h3>
              <p><strong>Email:</strong> ${menteeEmail}</p>
              <p><strong>Goals:</strong> ${goals}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/mentorship" class="button">View Request</a>
            </div>

            <p>You can accept or decline this request from your mentorship dashboard.</p>
            
            <div class="footer">
              <p>This is an automated email from Alumni Network Platform</p>
              <p>If you didn't expect this email, please ignore it.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${mentorName},

      You have received a new mentorship request!

      From: ${menteeName}
      Email: ${menteeEmail}
      Goals: ${goals}
      Message: ${message}

      Visit ${process.env.FRONTEND_URL}/mentorship to view and respond to this request.
    `,
  }),

  mentorshipAccepted: (menteeName, menteeEmail, mentorName, mentorEmail) => ({
    subject: `${mentorName} Accepted Your Mentorship Request!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Great News!</h1>
          </div>
          <div class="content">
            <p>Hi ${menteeName},</p>
            <p>Your mentorship request has been accepted by ${mentorName}!</p>
            
            <div class="card">
              <h3>Next Steps:</h3>
              <ul>
                <li>Reach out to your mentor at: ${mentorEmail}</li>
                <li>Schedule your first session through the platform</li>
                <li>Prepare questions and goals for your mentorship journey</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/mentorship" class="button">Schedule Session</a>
            </div>

            <p>We're excited to see you grow through this mentorship!</p>
            
            <div class="footer">
              <p>This is an automated email from Alumni Network Platform</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${menteeName},

      Your mentorship request has been accepted by ${mentorName}!

      Next Steps:
      - Reach out to your mentor at: ${mentorEmail}
      - Schedule your first session through the platform
      - Prepare questions and goals for your mentorship journey

      Visit ${process.env.FRONTEND_URL}/mentorship to schedule your first session.
    `,
  }),

  mentorshipRejected: (menteeName, mentorName, rejectionReason) => ({
    subject: `Update on Your Mentorship Request`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📩 Mentorship Request Update</h1>
          </div>
          <div class="content">
            <p>Hi ${menteeName},</p>
            <p>Thank you for your interest in connecting with ${mentorName}. Unfortunately, they are unable to accept new mentees at this time.</p>
            
            ${rejectionReason ? `
            <div class="card">
              <p><strong>Reason:</strong> ${rejectionReason}</p>
            </div>
            ` : ''}

            <p>Don't be discouraged! There are many other amazing mentors available on our platform.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/mentorship" class="button">Find Other Mentors</a>
            </div>
            
            <div class="footer">
              <p>This is an automated email from Alumni Network Platform</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${menteeName},

      Thank you for your interest in connecting with ${mentorName}. Unfortunately, they are unable to accept new mentees at this time.

      ${rejectionReason ? `Reason: ${rejectionReason}` : ''}

      Don't be discouraged! There are many other amazing mentors available on our platform.

      Visit ${process.env.FRONTEND_URL}/mentorship to find other mentors.
    `,
  }),

  sessionScheduled: (recipientName, mentorName, menteeName, date, duration, meetingLink) => ({
    subject: `Mentorship Session Scheduled`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .button { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Session Scheduled</h1>
          </div>
          <div class="content">
            <p>Hi ${recipientName},</p>
            <p>A mentorship session has been scheduled!</p>
            
            <div class="card">
              <h3>Session Details:</h3>
              <p><strong>Mentor:</strong> ${mentorName}</p>
              <p><strong>Mentee:</strong> ${menteeName}</p>
              <p><strong>Date:</strong> ${new Date(date).toLocaleString()}</p>
              <p><strong>Duration:</strong> ${duration} minutes</p>
              ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              ${meetingLink ? `<a href="${meetingLink}" class="button">Join Meeting</a>` : ''}
              <a href="${process.env.FRONTEND_URL}/mentorship" class="button">View Details</a>
            </div>

            <p>Add this to your calendar so you don't forget!</p>
            
            <div class="footer">
              <p>This is an automated email from Alumni Network Platform</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${recipientName},

      A mentorship session has been scheduled!

      Session Details:
      Mentor: ${mentorName}
      Mentee: ${menteeName}
      Date: ${new Date(date).toLocaleString()}
      Duration: ${duration} minutes
      ${meetingLink ? `Meeting Link: ${meetingLink}` : ''}

      Visit ${process.env.FRONTEND_URL}/mentorship to view details.
    `,
  }),
};

// Send email function
const sendEmail = async (to, template) => {
  try {
    // In development, just log the email instead of sending
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n=== EMAIL NOTIFICATION ===');
      console.log('To:', to);
      console.log('Subject:', template.subject);
      console.log('Content:', template.text);
      console.log('========================\n');
      return { success: true, messageId: 'dev-mode' };
    }

    // For production, you would configure nodemailer here
    const transporter = require('nodemailer').createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Alumni Network" <noreply@alumninetwork.com>',
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't throw error, just log it so the app continues working
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  emailTemplates,
};
