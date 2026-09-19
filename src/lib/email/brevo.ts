// Brevo (formerly Sendinblue) Transactional Email Service

export interface SendOtpEmailOptions {
  email: string;
  otp: string;
  name?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  devMode?: boolean;
  devOtp?: string;
}

export async function sendBrevoOtpEmail({
  email,
  otp,
  name
}: SendOtpEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim() || 'appointments@johnsalonkkd.com';
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || 'Trimorva | John Salon KKD';

  const recipientName = name || email.split('@')[0];

  // If no Brevo API key is set, operate in transparent Dev Mode so login isn't blocked
  if (!apiKey || apiKey === 'xkeysib-your_brevo_api_key_here' || apiKey === '') {
    console.warn(`\n======================================================`);
    console.warn(`[BREVO DEV MODE] No active BREVO_API_KEY configured in .env`);
    console.warn(`[BREVO DEV MODE] Target Recipient: ${email}`);
    console.warn(`[BREVO DEV MODE] Generated One-Time Password (OTP): >>> ${otp} <<<`);
    console.warn(`======================================================\n`);

    return {
      success: true,
      devMode: true,
      devOtp: otp,
      messageId: `dev-${Date.now()}`
    };
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Trimorva Login Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F7F4EE;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0A0A0A; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #141414; border: 1px solid rgba(197, 168, 128, 0.3); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
          
          <!-- Top Header -->
          <tr>
            <td style="padding: 35px 35px 25px 35px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06); background: linear-gradient(180deg, #1A1A1A 0%, #141414 100%);">
              <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; border-radius: 50%; background: #1C1C1C; border: 1px solid #C5A880; color: #C5A880; font-size: 20px; margin-bottom: 12px;">
                ✂
              </div>
              <h1 style="margin: 0; font-family: 'Times New Roman', Georgia, serif; font-size: 24px; font-weight: 700; letter-spacing: 2px; color: #F7F4EE;">
                TRIMORVA
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #C5A880; font-weight: 600;">
                John Salon Atelier · Kakinada
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 35px 35px 25px 35px; text-align: center;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #F7F4EE;">
                One-Time Login Verification Code
              </h2>
              <p style="margin: 0 0 28px 0; font-size: 13px; line-height: 1.6; color: #9E988F;">
                Hello <strong style="color: #F7F4EE;">${recipientName}</strong>,<br>
                Use the single-use 6-digit verification code below to sign in to your John Salon & Trimorva portal.
              </p>

              <!-- OTP Code Display -->
              <div style="background-color: #1C1C1C; border: 1px solid rgba(197, 168, 128, 0.4); border-radius: 14px; padding: 20px; margin: 0 auto 28px auto; max-width: 320px;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 700; letter-spacing: 10px; color: #C5A880; display: inline-block; padding-left: 10px;">
                  ${otp}
                </span>
              </div>

              <!-- Expiry & Security Warning -->
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #E5C590; font-weight: 500;">
                ⏱ This code will expire in <strong>10 minutes</strong>.
              </p>
              <p style="margin: 0; font-size: 11px; color: #66615B; line-height: 1.5;">
                For your security, never disclose this code to anyone. Our concierge staff will never ask for your verification code.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 35px 30px 35px; background-color: #0E0E0E; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #9E988F;">
                Cinema Hall Road, Opposite CNC Theatre, Kakinada, Andhra Pradesh
              </p>
              <p style="margin: 0; font-size: 10px; color: #66615B;">
                © 2026 Trimorva Technologies · Exclusive to John Salon KKD
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

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [
          {
            email: email.trim().toLowerCase(),
            name: recipientName
          }
        ],
        subject: `Your Trimorva Verification Code: ${otp}`,
        htmlContent
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo API Error:', data);
      return {
        success: false,
        error: data.message || `Brevo returned status ${response.status}: Failed to dispatch email.`
      };
    }

    return {
      success: true,
      messageId: data.messageId
    };
  } catch (error: any) {
    console.error('Error contacting Brevo email API:', error);
    return {
      success: false,
      error: error.message || 'Network error communicating with Brevo email service.'
    };
  }
}
