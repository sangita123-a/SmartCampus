export function renderEmailTemplate(type: 'WELCOME' | 'OTP' | 'PASSWORD_RESET' | 'VERIFICATION', data: any) {
  const brandColor = '#0f766e';
  const logoText = 'SmartCampus';

  if (type === 'OTP') {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification OTP - SmartCampus</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
          <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: ${brandColor}; font-size: 24px; margin: 0; font-weight: 800;">${logoText}</h1>
              <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Security Verification Code</p>
            </div>
            
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hello <strong>${data.name || 'User'}</strong>,</p>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">Your one-time authentication passcode (OTP) for SmartCampus account access is:</p>
            
            <div style="background-color: #f0fdf4; border: 2px dashed ${brandColor}; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0;">
              <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: ${brandColor};">${data.otp || '123456'}</span>
            </div>
            
            <p style="color: #64748b; font-size: 13px; text-align: center;">This code will expire in <strong>10 minutes</strong>. Please do not share this passcode with anyone.</p>
            
            <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="color: #94a3b8; font-size: 11px;">© 2026 SmartCampus SaaS Inc. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  if (type === 'PASSWORD_RESET') {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password - SmartCampus</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
          <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: ${brandColor}; font-size: 24px; margin: 0; font-weight: 800;">${logoText}</h1>
              <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Password Reset Instructions</p>
            </div>
            
            <p style="color: #334155; font-size: 15px;">Hello <strong>${data.name || 'User'}</strong>,</p>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">We received a request to reset your SmartCampus password. Click the button below to complete the reset process:</p>
            
            <div style="text-align: center; margin: 28px 0;">
              <a href="${data.resetUrl}" style="background-color: ${brandColor}; color: #ffffff; text-decoration: none; padding: 14px 28px; font-weight: 700; font-size: 14px; border-radius: 10px; display: inline-block;">Reset Password Now →</a>
            </div>
            
            <p style="color: #64748b; font-size: 12px;">If you did not request a password reset, please ignore this email.</p>
            
            <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="color: #94a3b8; font-size: 11px;">© 2026 SmartCampus SaaS Inc.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Default Welcome template
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to SmartCampus</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
        <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0;">
          <h1 style="color: ${brandColor}; text-align: center;">Welcome to SmartCampus!</h1>
          <p>Hello <strong>${data.name || 'User'}</strong>,</p>
          <p>Your educational account has been configured. You can now access student attendance, timetables, fee invoices, and examinations.</p>
        </div>
      </body>
    </html>
  `;
}
