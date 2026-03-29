import nodemailer from 'nodemailer';

function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) {
    console.error('SMTP not configured — skipping verification email');
    return;
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/api/verify-email?token=${token}`;
  const fromAddress = process.env.SMTP_FROM || 'noreply@salam-institut.com';

  await transporter.sendMail({
    from: `"Salam Institut" <${fromAddress}>`,
    to: email,
    subject: 'Please verify your email — Salam Institut',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2B7A78,#D9B574);padding:40px 40px 30px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;letter-spacing:-0.5px;">Salam Institut</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Islamic Education Online</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:22px;">Welcome, ${name}!</h2>
              <p style="margin:0 0 24px;color:#4b5563;font-size:16px;line-height:1.6;">
                Thank you for registering at Salam Institut. To complete your registration and access your account, please verify your email address by clicking the button below.
              </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${verificationUrl}"
                   style="display:inline-block;background:linear-gradient(135deg,#2B7A78,#D9B574);color:#ffffff;font-size:16px;font-weight:bold;text-decoration:none;padding:16px 40px;border-radius:12px;letter-spacing:0.3px;">
                  Verify My Email
                </a>
              </div>
              <p style="margin:24px 0 0;color:#6b7280;font-size:14px;line-height:1.6;">
                This link expires in <strong>24 hours</strong>. If you did not create an account, you can safely ignore this email.
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                If the button doesn't work, copy and paste this URL into your browser:<br/>
                <a href="${verificationUrl}" style="color:#2B7A78;word-break:break-all;">${verificationUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:13px;">
                © ${new Date().getFullYear()} Salam Institut · <a href="${baseUrl}" style="color:#2B7A78;text-decoration:none;">salam-institut.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
