const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For development, use a test account or configure with your email service
  // For production, use environment variables for credentials
  
  if (process.env.NODE_ENV === 'production') {
    // Production email config (e.g., Gmail, SendGrid, AWS SES)
    return nodemailer.createTransport({
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
    return nodemailer.createTransport({
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
  verificationEmail: (userName, verificationLink) => ({
    subject: '🎓 Verify Your Email - Alumni Network',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 40px 30px; border-radius: 0 0 10px 10px; }
          .card { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
          .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; margin: 15px 0; font-weight: 600; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎓 Welcome to Alumni Network!</h1>
          </div>
          <div class="content">
            <p style="font-size: 16px;">Hi <strong>${userName}</strong>,</p>
            <p>Thank you for joining our Alumni Network! We're excited to have you as part of our community.</p>
            
            <div class="card">
              <h2 style="color: #f59e0b; margin-top: 0;">Verify Your Email Address</h2>
              <p>To complete your registration and access all features, please verify your email address by clicking the button below:</p>
              
              <a href="${verificationLink}" class="button">Verify Email Address</a>
              
              <p style="margin-top: 20px; font-size: 14px; color: #666;">This link will expire in 24 hours.</p>
            </div>

            <div class="warning">
              <p style="margin: 0; font-size: 14px;"><strong>⏰ Action Required:</strong> You won't be able to log in until you verify your email address.</p>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 25px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 12px; word-break: break-all; background: #fff; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">${verificationLink}</p>
            
            <div class="footer">
              <p><strong>Didn't create an account?</strong></p>
              <p>If you didn't sign up for Alumni Network, please ignore this email or contact support if you have concerns.</p>
              <p style="margin-top: 15px;">© ${new Date().getFullYear()} Alumni Network Platform. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Alumni Network!

      Hi ${userName},

      Thank you for joining our Alumni Network! To complete your registration, please verify your email address.

      Click this link to verify: ${verificationLink}

      This link will expire in 24 hours.

      Note: You won't be able to log in until you verify your email address.

      If you didn't create an account, please ignore this email.

      © ${new Date().getFullYear()} Alumni Network Platform
    `,
  }),
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
    console.log('\n=== SENDING EMAIL ===');
    console.log('To:', to);
    console.log('Subject:', template.subject);
    
    // Check if email credentials are configured
    const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
    
    if (!hasEmailConfig) {
      console.log('⚠️  EMAIL NOT CONFIGURED!');
      console.log('Please set up email credentials in your .env file:');
      console.log('For Gmail:');
      console.log('  EMAIL_HOST=smtp.gmail.com');
      console.log('  EMAIL_PORT=587');
      console.log('  EMAIL_USER=your-email@gmail.com');
      console.log('  EMAIL_PASSWORD=your-app-password');
      console.log('  EMAIL_FROM="Alumni Network" <your-email@gmail.com>');
      console.log('\nNote: For Gmail, you need to use an App Password, not your regular password.');
      console.log('Generate one at: https://myaccount.google.com/apppasswords');
      console.log('========================\n');
      return { success: false, error: 'Email not configured' };
    }

    // Use real email service with environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Alumni Network" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully to real inbox!');
    console.log('Message ID:', info.messageId);
    console.log('Recipient:', to);
    console.log('========================\n');
    
    return { 
      success: true, 
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.error('Error details:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure EMAIL_USER and EMAIL_PASSWORD are set in .env');
    console.log('2. For Gmail, use an App Password (not your regular password)');
    console.log('3. Check that "Less secure app access" is enabled (if not using App Password)');
    console.log('4. Verify your EMAIL_HOST and EMAIL_PORT are correct');
    console.log('========================\n');
    // Don't throw error, just log it so the app continues working
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  emailTemplates,
};
