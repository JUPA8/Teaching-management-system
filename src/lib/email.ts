import nodemailer from 'nodemailer';

// ─── SMTP configuration validation ───────────────────────────────────────────

function isSMTPConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransporter() {
  if (!isSMTPConfigured()) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
    // Retry on transient failures
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    // Timeouts
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 30_000,
  });
}

// ─── Public types ─────────────────────────────────────────────────────────────

export interface EmailResult {
  sent: boolean;
  /** Only present in development when SMTP is not configured */
  devVerificationLink?: string;
}

// ─── Verification email ───────────────────────────────────────────────────────

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<EmailResult> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/api/verify-email?token=${token}`;
  const fromAddress = process.env.SMTP_FROM || 'noreply@salam-institut.com';
  const fromName = 'Salam Institut';

  const transporter = createTransporter();

  // ── Development fallback ──────────────────────────────────────────────────
  if (!transporter) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n');
      console.log('══════════════════════════════════════════════════════');
      console.log('  [DEV] SMTP not configured — verification link below');
      console.log('══════════════════════════════════════════════════════');
      console.log(`  Email : ${email}`);
      console.log(`  Link  : ${verificationUrl}`);
      console.log('══════════════════════════════════════════════════════');
      console.log('\n');
      return { sent: false, devVerificationLink: verificationUrl };
    }
    // In production: throw so the caller can surface a meaningful error
    throw new Error(
      'Email service is not configured. ' +
      'Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM in your environment variables.'
    );
  }

  // ── Send ──────────────────────────────────────────────────────────────────
  const html = buildVerificationHtml({ name, verificationUrl, baseUrl });

  await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: email,
    subject: 'Verify your Salam Institut account',
    html,
    text: `Hello ${name},\n\nVerify your account by visiting:\n${verificationUrl}\n\nThis link expires in 24 hours.\n\nSalam Institut`,
    headers: {
      'X-Mailer': 'Salam Institut Mailer',
    },
  });

  return { sent: true };
}

// ─── Email HTML template ──────────────────────────────────────────────────────

function buildVerificationHtml({
  name,
  verificationUrl,
  baseUrl,
}: {
  name: string;
  verificationUrl: string;
  baseUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your Salam Institut account</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2B7A78 0%,#D9B574 100%);padding:40px 40px 30px;text-align:center;">
              <h1 style="margin:0 0 6px;color:#ffffff;font-size:26px;font-weight:bold;letter-spacing:-0.3px;">
                Salam Institut
              </h1>
              <p style="margin:0;color:rgba(255,255,255,0.85);font-size:14px;">
                Islamic Education Online · معهد سلام
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px;color:#1a1a2e;font-size:20px;font-weight:bold;">
                Welcome, ${escapeHtml(name)}!
              </h2>
              <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.65;">
                Thank you for registering at Salam Institut. Please verify your email address to activate your account and start learning.
              </p>

              <!-- CTA Button -->
              <div style="text-align:center;margin:32px 0;">
                <a
                  href="${verificationUrl}"
                  style="display:inline-block;background:linear-gradient(135deg,#2B7A78,#D9B574);color:#ffffff;font-size:16px;font-weight:bold;text-decoration:none;padding:16px 48px;border-radius:12px;letter-spacing:0.3px;"
                >
                  Verify My Email Address
                </a>
              </div>

              <p style="margin:0 0 12px;color:#6b7280;font-size:14px;line-height:1.6;">
                This link expires in <strong>24 hours</strong>.
                If you did not create an account at Salam Institut, you can safely ignore this email.
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />

              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                If the button above doesn't work, copy and paste this URL into your browser:<br />
                <a href="${verificationUrl}" style="color:#2B7A78;word-break:break-all;">${verificationUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © ${new Date().getFullYear()} Salam Institut ·
                <a href="${baseUrl}" style="color:#2B7A78;text-decoration:none;">salam-institut.com</a>
                · Phone: +20 122 032 5887
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── Password reset email ─────────────────────────────────────────────────────

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
): Promise<EmailResult> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  const fromAddress = process.env.SMTP_FROM || 'noreply@salam-institut.com';
  const fromName = 'Salam Institut';

  const transporter = createTransporter();

  if (!transporter) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n');
      console.log('══════════════════════════════════════════════════════');
      console.log('  [DEV] SMTP not configured — password reset link below');
      console.log('══════════════════════════════════════════════════════');
      console.log(`  Email : ${email}`);
      console.log(`  Link  : ${resetUrl}`);
      console.log('══════════════════════════════════════════════════════');
      console.log('\n');
      return { sent: false, devVerificationLink: resetUrl };
    }
    throw new Error(
      'Email service is not configured. ' +
      'Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM in your environment variables.'
    );
  }

  const html = buildPasswordResetHtml({ name, resetUrl, baseUrl });

  await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: email,
    subject: 'Reset your Salam Institut password',
    html,
    text: `Hello ${name},\n\nReset your password by visiting:\n${resetUrl}\n\nThis link expires in 1 hour. If you did not request a password reset, ignore this email.\n\nSalam Institut`,
  });

  return { sent: true };
}

function buildPasswordResetHtml({
  name,
  resetUrl,
  baseUrl,
}: {
  name: string;
  resetUrl: string;
  baseUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your Salam Institut password</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#2B7A78 0%,#D9B574 100%);padding:40px 40px 30px;text-align:center;">
              <h1 style="margin:0 0 6px;color:#ffffff;font-size:26px;font-weight:bold;">Salam Institut</h1>
              <p style="margin:0;color:rgba(255,255,255,0.85);font-size:14px;">Islamic Education Online · معهد سلام</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px;color:#1a1a2e;font-size:20px;font-weight:bold;">Password Reset Request</h2>
              <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.65;">
                Hello ${escapeHtml(name)},<br /><br />
                We received a request to reset the password for your Salam Institut account.
                Click the button below to choose a new password.
              </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#2B7A78,#D9B574);color:#ffffff;font-size:16px;font-weight:bold;text-decoration:none;padding:16px 48px;border-radius:12px;">
                  Reset My Password
                </a>
              </div>
              <p style="margin:0 0 12px;color:#6b7280;font-size:14px;line-height:1.6;">
                This link expires in <strong>1 hour</strong>.
                If you did not request a password reset, you can safely ignore this email — your password will not change.
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                If the button doesn't work, copy and paste this URL:<br />
                <a href="${resetUrl}" style="color:#2B7A78;word-break:break-all;">${resetUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © ${new Date().getFullYear()} Salam Institut ·
                <a href="${baseUrl}" style="color:#2B7A78;text-decoration:none;">salam-institut.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ─── Startup diagnostic ───────────────────────────────────────────────────────

if (process.env.NODE_ENV === 'production' && !isSMTPConfigured()) {
  console.warn(
    '[WARN] Email service is NOT configured. ' +
    'Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM in Vercel environment variables. ' +
    'Users will not receive verification emails until this is fixed.'
  );
}
