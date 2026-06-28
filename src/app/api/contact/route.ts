import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimitAsync, getClientIP, tooManyRequests } from '@/lib/rate-limit';
import nodemailer from 'nodemailer';

const contactSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email:   z.string().email('Invalid email address').max(254),
  subject: z.string().min(2, 'Subject is required').max(200).trim(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000).trim(),
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// POST /api/contact — Public contact form submission
export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const rl = await checkRateLimitAsync(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.success) return tooManyRequests(rl.retryAfterSeconds);

  try {
    const body = await request.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message ?? 'Validation failed' },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;

    // Log to server console (always — useful even without SMTP)
    console.log('[Contact Form]', { name, email, subject, timestamp: new Date().toISOString() });

    // Try to send email if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const adminEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 30_000,
      });

      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f5;padding:20px;">
  <table width="600" style="max-width:600px;background:#fff;border-radius:12px;padding:32px;margin:0 auto;">
    <tr><td>
      <h2 style="color:#2B7A78;margin:0 0 16px;">New Contact Form Submission</h2>
      <p style="color:#6b7280;font-size:13px;margin:0 0 24px;">Received: ${new Date().toUTCString()}</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:bold;color:#374151;width:120px;">Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#111827;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:bold;color:#374151;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#111827;">
            <a href="mailto:${escapeHtml(email)}" style="color:#2B7A78;">${escapeHtml(email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:bold;color:#374151;">Subject</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#111827;">${escapeHtml(subject)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-weight:bold;color:#374151;vertical-align:top;">Message</td>
          <td style="padding:10px 0;color:#111827;white-space:pre-wrap;">${escapeHtml(message)}</td>
        </tr>
      </table>
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;">
        <a href="mailto:${escapeHtml(email)}?subject=Re: ${escapeHtml(subject)}"
           style="display:inline-block;background:linear-gradient(135deg,#2B7A78,#D9B574);color:#fff;font-weight:bold;text-decoration:none;padding:12px 28px;border-radius:8px;">
          Reply to ${escapeHtml(name)}
        </a>
      </div>
      <p style="margin:24px 0 0;color:#9ca3af;font-size:12px;">
        © ${new Date().getFullYear()} Salam Institut — automated contact form notification
      </p>
    </td></tr>
  </table>
</body>
</html>`;

      await transporter.sendMail({
        from: `"Salam Institut Website" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: adminEmail,
        replyTo: `"${name}" <${email}>`,
        subject: `[Contact Form] ${subject}`,
        html,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      });
    }

    return NextResponse.json({ success: true, message: 'Your message has been sent.' });
  } catch (error: any) {
    console.error('[Contact Form] Error:', error?.message);
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
