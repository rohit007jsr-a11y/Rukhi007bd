export interface SupabaseEmailTemplate {
  id: 'confirm-signup' | 'invite-user' | 'reset-password';
  title: string;
  supabaseTabName: string;
  defaultSubject: string;
  description: string;
  variables: string[];
  html: string;
}

export const CONFIRM_SIGNUP_HTML = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Confirm Your Email - RUKHI</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; min-width: 100%; background-color: #F7F7F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111111; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .mobile-pad { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-btn { display: block !important; width: 100% !important; text-align: center !important; }
      .token-digits { font-size: 26px !important; letter-spacing: 6px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F7F5;">
  <div style="display: none; font-size: 1px; color: #F7F7F5; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    Confirm your email to complete your registration with RUKHI Streetwear Dhaka.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F7F5; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; background-color: #FFFFFF; border: 2px solid #111111; border-radius: 0px; box-shadow: 6px 6px 0px #111111; overflow: hidden;">
          <tr>
            <td height="6" style="background-color: #E63946; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="background-color: #111111; padding: 28px 32px; text-align: center;" class="mobile-pad">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; font-size: 30px; font-weight: 900; letter-spacing: 4px; color: #FFFFFF; font-family: 'Impact', 'Arial Black', -apple-system, sans-serif; text-transform: uppercase;">
                      RUKHI<span style="color: #E63946;">.</span>
                    </span>
                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 2.5px; color: #A1A1AA; text-transform: uppercase; margin-top: 4px;">
                      Dhaka Streetwear &bull; Original Urban Wear
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 16px 36px;" class="mobile-pad">
              <div style="display: inline-block; background-color: #FFF1F2; border: 1px solid #FECDD3; color: #E63946; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px; margin-bottom: 16px;">
                VERIFY YOUR ACCOUNT
              </div>
              <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 900; line-height: 1.25; color: #111111; text-transform: uppercase; letter-spacing: 0.5px;">
                Welcome to the crew.
              </h1>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4B5563;">
                Thanks for joining <strong>RUKHI</strong>. To activate your account ({{ .Email }}) and enable instant Cash-on-Delivery checkout, drop notifications, and order tracking, please confirm your email address.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 36px;" class="mobile-pad" align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" target="_blank" class="mobile-btn" style="display: inline-block; background-color: #111111; color: #FFFFFF; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 16px 36px; border: 2px solid #111111; box-shadow: 4px 4px 0px #E63946; text-align: center;">
                      Confirm My Email &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 36px 24px 36px;" class="mobile-pad">
              <div style="background-color: #F7F7F5; border: 2px dashed #111111; padding: 20px; text-align: center;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #6B7280; margin-bottom: 8px;">
                  Or enter this 6-digit code in the app:
                </div>
                <div class="token-digits" style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 30px; font-weight: 900; letter-spacing: 8px; color: #111111; padding: 6px 0;">
                  {{ .Token }}
                </div>
                <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">
                  This code expires in 24 hours.
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 36px 24px 36px;" class="mobile-pad">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAFAFA; border: 1px solid #E5E7EB; padding: 14px 16px;">
                <tr>
                  <td width="33%" align="center" style="padding: 4px 8px; border-right: 1px solid #E5E7EB;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #111111;">100% COD</div>
                    <div style="font-size: 10px; color: #6B7280; margin-top: 2px;">Pay upon delivery</div>
                  </td>
                  <td width="33%" align="center" style="padding: 4px 8px; border-right: 1px solid #E5E7EB;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #111111;">Parcel Check</div>
                    <div style="font-size: 10px; color: #6B7280; margin-top: 2px;">Inspect before pay</div>
                  </td>
                  <td width="33%" align="center" style="padding: 4px 8px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #111111;">7-Day Return</div>
                    <div style="font-size: 10px; color: #6B7280; margin-top: 2px;">Hassle-free swap</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 36px 28px 36px; border-top: 1px solid #F3F4F6;" class="mobile-pad">
              <p style="margin: 16px 0 6px 0; font-size: 11px; color: #9CA3AF; line-height: 1.5;">
                Button not working? Copy and paste this URL directly into your browser:
              </p>
              <div style="word-break: break-all; font-family: monospace; font-size: 10px; color: #E63946; background-color: #F9FAFB; padding: 8px 10px; border: 1px solid #E5E7EB;">
                {{ .ConfirmationURL }}
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F7F7F5; padding: 24px 36px; border-top: 2px solid #111111;" class="mobile-pad">
              <p style="margin: 0 0 12px 0; font-size: 11px; line-height: 1.5; color: #6B7280;">
                If you did not sign up for an account on RUKHI, you can safely ignore this email. Someone may have entered your email by mistake.
              </p>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-size: 11px; color: #111111; font-weight: 700;">
                    Rukhi Bangladesh &bull; Dhaka-1213
                  </td>
                  <td align="right" style="font-size: 11px; color: #6B7280;">
                    <a href="{{ .SiteURL }}" target="_blank" style="color: #111111; font-weight: 700; text-decoration: underline;">Visit Store</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin-top: 16px;">
          <tr>
            <td align="center" style="font-size: 10px; color: #9CA3AF; line-height: 1.6; padding: 0 16px;">
              Need help? Reach out at <a href="mailto:hello@rukhibd.com" style="color: #6B7280; font-weight: 700; text-decoration: none;">hello@rukhibd.com</a> or helpline <span style="color: #6B7280; font-weight: 700;">+880 1700 998877</span>.<br />
              &copy; 2026 RUKHI. All rights reserved. Dhaka, Bangladesh.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const INVITE_USER_HTML = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>You're Invited to RUKHI</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; min-width: 100%; background-color: #F7F7F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111111; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .mobile-pad { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-btn { display: block !important; width: 100% !important; text-align: center !important; }
      .token-digits { font-size: 26px !important; letter-spacing: 6px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F7F5;">
  <div style="display: none; font-size: 1px; color: #F7F7F5; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    You have been invited to join RUKHI. Accept your invitation and set up your password.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F7F5; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; background-color: #FFFFFF; border: 2px solid #111111; border-radius: 0px; box-shadow: 6px 6px 0px #111111; overflow: hidden;">
          <tr>
            <td height="6" style="background-color: #E63946; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="background-color: #111111; padding: 28px 32px; text-align: center;" class="mobile-pad">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; font-size: 30px; font-weight: 900; letter-spacing: 4px; color: #FFFFFF; font-family: 'Impact', 'Arial Black', -apple-system, sans-serif; text-transform: uppercase;">
                      RUKHI<span style="color: #E63946;">.</span>
                    </span>
                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 2.5px; color: #A1A1AA; text-transform: uppercase; margin-top: 4px;">
                      Dhaka Streetwear &bull; Team &amp; Member Portal
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 16px 36px;" class="mobile-pad">
              <div style="display: inline-block; background-color: #FFF1F2; border: 1px solid #FECDD3; color: #E63946; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px; margin-bottom: 16px;">
                OFFICIAL INVITATION
              </div>
              <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 900; line-height: 1.25; color: #111111; text-transform: uppercase; letter-spacing: 0.5px;">
                You&apos;re invited to join RUKHI.
              </h1>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4B5563;">
                An invitation has been created for your email address (<strong>{{ .Email }}</strong>) to access the RUKHI platform. Click the button below to accept your invitation, configure your credentials, and start collaborating.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 36px 16px 36px;" class="mobile-pad">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F7F5; border: 2px solid #111111; padding: 16px 20px;">
                <tr>
                  <td>
                    <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #6B7280;">Invited Account</div>
                    <div style="font-size: 14px; font-weight: 800; color: #111111; margin-top: 2px; font-family: monospace;">{{ .Email }}</div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: #111111; color: #FFFFFF; font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 4px 8px; letter-spacing: 1px;">
                      Active Invite
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 36px;" class="mobile-pad" align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" target="_blank" class="mobile-btn" style="display: inline-block; background-color: #111111; color: #FFFFFF; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 16px 36px; border: 2px solid #111111; box-shadow: 4px 4px 0px #E63946; text-align: center;">
                      Accept Invitation &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 36px 24px 36px;" class="mobile-pad">
              <div style="background-color: #F7F7F5; border: 2px dashed #111111; padding: 20px; text-align: center;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #6B7280; margin-bottom: 8px;">
                  Or use your one-time invitation token:
                </div>
                <div class="token-digits" style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 26px; font-weight: 900; letter-spacing: 6px; color: #111111; padding: 6px 0;">
                  {{ .Token }}
                </div>
                <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">
                  Invitation link and code are single-use only.
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 36px 28px 36px; border-top: 1px solid #F3F4F6;" class="mobile-pad">
              <p style="margin: 16px 0 6px 0; font-size: 11px; color: #9CA3AF; line-height: 1.5;">
                If clicking the button does not open the setup page, copy and paste this link:
              </p>
              <div style="word-break: break-all; font-family: monospace; font-size: 10px; color: #E63946; background-color: #F9FAFB; padding: 8px 10px; border: 1px solid #E5E7EB;">
                {{ .ConfirmationURL }}
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F7F7F5; padding: 24px 36px; border-top: 2px solid #111111;" class="mobile-pad">
              <p style="margin: 0 0 12px 0; font-size: 11px; line-height: 1.5; color: #6B7280;">
                If you were not expecting an invitation from RUKHI, please delete this email or reach out to our admin support team.
              </p>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-size: 11px; color: #111111; font-weight: 700;">
                    Rukhi Bangladesh &bull; Dhaka
                  </td>
                  <td align="right" style="font-size: 11px; color: #6B7280;">
                    <a href="{{ .SiteURL }}" target="_blank" style="color: #111111; font-weight: 700; text-decoration: underline;">Open Platform</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin-top: 16px;">
          <tr>
            <td align="center" style="font-size: 10px; color: #9CA3AF; line-height: 1.6; padding: 0 16px;">
              Admin Operations &bull; RUKHI Streetwear Bangladesh<br />
              Questions? Contact <a href="mailto:hello@rukhibd.com" style="color: #6B7280; font-weight: 700; text-decoration: none;">hello@rukhibd.com</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const RESET_PASSWORD_HTML = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Reset Your Password - RUKHI</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; min-width: 100%; background-color: #F7F7F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111111; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .mobile-pad { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-btn { display: block !important; width: 100% !important; text-align: center !important; }
      .token-digits { font-size: 28px !important; letter-spacing: 6px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F7F5;">
  <div style="display: none; font-size: 1px; color: #F7F7F5; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    Reset your RUKHI password. Enter your 6-digit verification code or click the direct recovery link.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F7F5; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; background-color: #FFFFFF; border: 2px solid #111111; border-radius: 0px; box-shadow: 6px 6px 0px #111111; overflow: hidden;">
          <tr>
            <td height="6" style="background-color: #E63946; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="background-color: #111111; padding: 28px 32px; text-align: center;" class="mobile-pad">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; font-size: 30px; font-weight: 900; letter-spacing: 4px; color: #FFFFFF; font-family: 'Impact', 'Arial Black', -apple-system, sans-serif; text-transform: uppercase;">
                      RUKHI<span style="color: #E63946;">.</span>
                    </span>
                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 2.5px; color: #A1A1AA; text-transform: uppercase; margin-top: 4px;">
                      Dhaka Streetwear &bull; Account Security
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 16px 36px;" class="mobile-pad">
              <div style="display: inline-block; background-color: #FFF1F2; border: 1px solid #FECDD3; color: #E63946; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px; margin-bottom: 16px;">
                SECURITY CODE
              </div>
              <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 900; line-height: 1.25; color: #111111; text-transform: uppercase; letter-spacing: 0.5px;">
                Reset Your Password
              </h1>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4B5563;">
                We received a request to reset the password for your account (<strong>{{ .Email }}</strong>). If you made this request, enter the verification code below in the store modal or click the direct recovery link.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 36px;" class="mobile-pad">
              <div style="background-color: #F7F7F5; border: 2px solid #111111; box-shadow: 4px 4px 0px #111111; padding: 22px 20px; text-align: center;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #6B7280; margin-bottom: 6px;">
                  Your 6-Digit Reset Code
                </div>
                <div class="token-digits" style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 10px; color: #E63946; padding: 8px 0; margin-left: 8px;">
                  {{ .Token }}
                </div>
                <div style="display: inline-block; font-size: 11px; font-weight: 700; color: #111111; background-color: #E5E7EB; padding: 3px 10px; margin-top: 4px;">
                  Expires in 60 minutes
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 36px;" class="mobile-pad" align="center">
              <div style="font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">
                &mdash; OR CLICK DIRECT RECOVERY LINK &mdash;
              </div>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" target="_blank" class="mobile-btn" style="display: inline-block; background-color: #111111; color: #FFFFFF; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 16px 36px; border: 2px solid #111111; box-shadow: 4px 4px 0px #E63946; text-align: center;">
                      Reset My Password &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 36px 20px 36px;" class="mobile-pad">
              <div style="background-color: #FEF2F2; border-left: 4px solid #E63946; padding: 14px 16px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td>
                      <div style="font-size: 12px; font-weight: 800; color: #991B1B; text-transform: uppercase;">
                        Didn&apos;t request this change?
                      </div>
                      <div style="font-size: 12px; line-height: 1.5; color: #7F1D1D; margin-top: 4px;">
                        If you did not initiate this password reset, please ignore this email. Your password will remain unchanged and your account is secure.
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 36px 28px 36px; border-top: 1px solid #F3F4F6;" class="mobile-pad">
              <p style="margin: 16px 0 6px 0; font-size: 11px; color: #9CA3AF; line-height: 1.5;">
                Having trouble clicking the button? Copy and paste this URL into your browser:
              </p>
              <div style="word-break: break-all; font-family: monospace; font-size: 10px; color: #E63946; background-color: #F9FAFB; padding: 8px 10px; border: 1px solid #E5E7EB;">
                {{ .ConfirmationURL }}
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F7F7F5; padding: 24px 36px; border-top: 2px solid #111111;" class="mobile-pad">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-size: 11px; color: #111111; font-weight: 700;">
                    RUKHI Bangladesh &bull; Banani, Dhaka
                  </td>
                  <td align="right" style="font-size: 11px; color: #6B7280;">
                    <a href="{{ .SiteURL }}" target="_blank" style="color: #111111; font-weight: 700; text-decoration: underline;">Return to Store</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin-top: 16px;">
          <tr>
            <td align="center" style="font-size: 10px; color: #9CA3AF; line-height: 1.6; padding: 0 16px;">
              For urgent account assistance, contact helpline <span style="color: #6B7280; font-weight: 700;">+880 1700 998877</span> or email <a href="mailto:hello@rukhibd.com" style="color: #6B7280; font-weight: 700; text-decoration: none;">hello@rukhibd.com</a>.<br />
              &copy; 2026 RUKHI. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const SUPABASE_EMAIL_TEMPLATES: SupabaseEmailTemplate[] = [
  {
    id: 'confirm-signup',
    title: 'Sign Up / Confirm Signup',
    supabaseTabName: 'Confirm signup',
    defaultSubject: 'Welcome to RUKHI - Confirm Your Email',
    description: 'Sent when a new customer registers on Rukhi store to verify their email address. Displays both a 1-click confirmation button and 6-digit verification code.',
    variables: ['{{ .ConfirmationURL }}', '{{ .Token }}', '{{ .Email }}', '{{ .SiteURL }}'],
    html: CONFIRM_SIGNUP_HTML,
  },
  {
    id: 'invite-user',
    title: 'User Invitation',
    supabaseTabName: 'Invite user',
    defaultSubject: "You've Been Invited to Join RUKHI",
    description: 'Sent when an administrator invites a team member, staff, or VIP customer to access the RUKHI platform with a single-use setup link and code.',
    variables: ['{{ .ConfirmationURL }}', '{{ .Token }}', '{{ .Email }}', '{{ .SiteURL }}'],
    html: INVITE_USER_HTML,
  },
  {
    id: 'reset-password',
    title: 'Forget Password / Reset Password',
    supabaseTabName: 'Reset password',
    defaultSubject: 'Reset Your RUKHI Password',
    description: 'Sent when a user requests password recovery. Features an eye-catching 6-digit OTP code (matching Rukhi\'s in-app 3-step modal) and direct 1-click reset link.',
    variables: ['{{ .ConfirmationURL }}', '{{ .Token }}', '{{ .Email }}', '{{ .SiteURL }}'],
    html: RESET_PASSWORD_HTML,
  },
];

/**
 * Returns mock-rendered HTML for client-side preview in an iframe.
 */
export function renderTemplatePreview(html: string, mockEmail = 'customer@example.com'): string {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://rukhibd.com';
  return html
    .replace(/\{\{\s*\.ConfirmationURL\s*\}\}/g, `${currentOrigin}/#auth-verify?token=demo123456`)
    .replace(/\{\{\s*\.Token\s*\}\}/g, '482915')
    .replace(/\{\{\s*\.Email\s*\}\}/g, mockEmail)
    .replace(/\{\{\s*\.SiteURL\s*\}\}/g, currentOrigin);
}
