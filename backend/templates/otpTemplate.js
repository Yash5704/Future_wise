
exports.otpEmailTemplate = (otp, name) => {
  `<div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
  <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h2 style="color: #4CAF50;">FutureVise - Email Verification</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thank you for signing up. Please verify your email using the OTP below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="display: inline-block; font-size: 24px; letter-spacing: 10px; color: #333; border: 1px dashed #4CAF50; padding: 10px 20px; border-radius: 6px;">
        ${otp}
      </span>
    </div>
    <p>This OTP will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <br/>
    <p>Regards,<br/>FutureVise Team</p>
  </div>
</div>`
};
