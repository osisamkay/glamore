import nodemailer from 'nodemailer';

// Create transporter for sending emails
// For demo purposes, using Gmail SMTP (you can configure other providers)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your app password
    },
  });
};

// Send welcome email after signup
export const sendWelcomeEmail = async (userEmail, firstName, lastName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@glamore.com',
      to: userEmail,
      subject: '🌟 Welcome to GlamourGlow Fashion - Your Fashion Journey Begins!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to GlamourGlow Fashion</title>
          <style>
            body { 
              font-family: 'Georgia', serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .header { 
              background: linear-gradient(135deg, #56193f, #3d1230); 
              color: white; 
              padding: 30px; 
              text-align: center; 
              border-radius: 10px 10px 0 0; 
            }
            .content { 
              background: #ffffff; 
              padding: 30px; 
              border: 1px solid #e5e5e5; 
            }
            .footer { 
              background: #f8f9fa; 
              padding: 20px; 
              text-align: center; 
              border-radius: 0 0 10px 10px; 
              border: 1px solid #e5e5e5; 
              border-top: none; 
            }
            .btn { 
              display: inline-block; 
              background: #56193f; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0; 
            }
            .btn:hover { 
              background: #3d1230; 
            }
            .highlight { 
              color: #56193f; 
              font-weight: bold; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✨ Welcome to GlamourGlow Fashion! ✨</h1>
            <p>Where Fashion Meets Elegance</p>
          </div>
          
          <div class="content">
            <h2>Hello ${firstName} ${lastName}! 👋</h2>
            
            <p>We're absolutely <span class="highlight">thrilled</span> to have you join the GlamourGlow Fashion family! Your fashion journey starts now, and we couldn't be more excited to be part of it.</p>
            
            <h3>🎉 What's Next?</h3>
            <ul>
              <li><strong>Explore Our Collection:</strong> Discover curated pieces that speak to your style</li>
              <li><strong>Personalized Recommendations:</strong> Get fashion suggestions tailored just for you</li>
              <li><strong>Exclusive Access:</strong> Be the first to know about new arrivals and special offers</li>
              <li><strong>Style Community:</strong> Connect with fellow fashion enthusiasts</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="http://localhost:3000" class="btn">Start Shopping Now</a>
            </div>
            
            <h3>💎 Why GlamourGlow Fashion?</h3>
            <p>At GlamourGlow Fashion, we believe that fashion is more than just clothing—it's a form of self-expression, confidence, and art. Every piece in our collection is carefully selected to help you tell your unique story.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>🎁 Special Welcome Offer:</strong> Use code <span class="highlight">WELCOME10</span> for 10% off your first order!</p>
            </div>
            
            <p>If you have any questions or need styling advice, our team is here to help. Simply reply to this email or visit our support center.</p>
            
            <p>Welcome aboard, and happy shopping!</p>
            
            <p>With love and style,<br>
            <strong>The GlamourGlow Fashion Team</strong> 💕</p>
          </div>
          
          <div class="footer">
            <p><small>This is a demo email from GlamourGlow Fashion E-Commerce Platform</small></p>
            <p><small>© 2024 GlamourGlow Fashion. All rights reserved.</small></p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to GlamourGlow Fashion, ${firstName} ${lastName}!
        
        We're thrilled to have you join the GlamourGlow Fashion family! Your fashion journey starts now.
        
        What's Next?
        - Explore our curated collection
        - Get personalized recommendations
        - Enjoy exclusive access to new arrivals
        - Connect with our style community
        
        Special Welcome Offer: Use code WELCOME10 for 10% off your first order!
        
        Visit us at: http://localhost:3000
        
        Welcome aboard, and happy shopping!
        
        The GlamourGlow Fashion Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email (for future use)
export const sendPasswordResetEmail = async (userEmail, resetToken) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@glamore.com',
      to: userEmail,
      subject: '🔐 Reset Your GlamourGlow Fashion Password',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #56193f; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1>Password Reset Request</h1>
          </div>
          <div style="background: white; padding: 30px; border: 1px solid #e5e5e5;">
            <p>You requested a password reset for your GlamourGlow Fashion account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/reset-password?token=${resetToken}" 
                 style="background: #56193f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                Reset Password
              </a>
            </div>
            <p><small>This link will expire in 1 hour for security reasons.</small></p>
            <p><small>If you didn't request this, please ignore this email.</small></p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};
