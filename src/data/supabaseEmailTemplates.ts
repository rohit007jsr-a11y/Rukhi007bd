export interface SupabaseEmailTemplate {
  id: 'confirm-signup' | 'invite-user' | 'reset-password';
  title: string;
  supabaseTabName: string;
  defaultSubject: string;
  description: string;
  variables: string[];
  charCount: number;
  html: string;
}

export const CONFIRM_SIGNUP_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Verify Email - RUKHI</title></head>
<body style="margin:0;padding:20px 10px;background:#F7F7F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#FFF;border:2px solid #111;box-shadow:5px 5px 0 #111;">
<tr><td height="5" style="background:#E63946;font-size:0;line-height:5px;">&nbsp;</td></tr>
<tr><td style="background:#111;padding:20px;text-align:center;">
<div style="font-size:26px;font-weight:900;letter-spacing:3px;color:#FFF;text-transform:uppercase;">RUKHI<span style="color:#E63946;">.</span></div>
<div style="font-size:9px;font-weight:700;letter-spacing:2px;color:#9CA3AF;text-transform:uppercase;margin-top:2px;">Dhaka Streetwear Archive</div>
</td></tr>
<tr><td style="padding:24px 24px 10px;">
<span style="background:#FFF1F2;border:1px solid #FECDD3;color:#E63946;font-size:10px;font-weight:800;letter-spacing:1px;padding:3px 7px;">VERIFY ACCOUNT</span>
<h1 style="margin:10px 0 6px;font-size:20px;font-weight:900;text-transform:uppercase;color:#111;">Welcome to the crew.</h1>
<p style="margin:0;font-size:13px;line-height:1.5;color:#4B5563;">Thanks for joining <strong>RUKHI</strong>. Confirm your email ({{ .Email }}) to enable instant Cash-on-Delivery checkout and drop alerts.</p>
</td></tr>
<tr><td style="padding:10px 24px 18px;" align="center">
<a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;background:#111;color:#FFF;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:13px 30px;border:2px solid #111;box-shadow:3px 3px 0 #E63946;">Confirm My Email &rarr;</a>
</td></tr>
<tr><td style="padding:0 24px 18px;">
<div style="background:#F7F7F5;border:2px dashed #111;padding:14px;text-align:center;">
<div style="font-size:10px;font-weight:800;letter-spacing:1px;color:#6B7280;margin-bottom:3px;text-transform:uppercase;">Or enter 6-digit code in app:</div>
<div style="font-family:Courier,monospace;font-size:26px;font-weight:900;letter-spacing:6px;color:#111;">{{ .Token }}</div>
<div style="font-size:10px;color:#9CA3AF;margin-top:2px;">Expires in 24 hours</div>
</div>
</td></tr>
<tr><td style="padding:0 24px 14px;">
<div style="font-size:10px;color:#9CA3AF;line-height:1.4;border-top:1px solid #E5E7EB;padding-top:10px;">
Link not working? Paste into browser:<br><span style="color:#E63946;word-break:break-all;font-family:monospace;">{{ .ConfirmationURL }}</span>
</div>
</td></tr>
<tr><td style="background:#F7F7F5;padding:14px 24px;border-top:2px solid #111;font-size:10px;color:#6B7280;line-height:1.5;">
If you didn't sign up for RUKHI, ignore this email.<br>
<strong style="color:#111;">Rukhi Bangladesh</strong> &bull; Dhaka-1213 &bull; <a href="{{ .SiteURL }}" style="color:#111;font-weight:700;">Visit Store</a>
</td></tr>
</table>
<div style="max-width:520px;margin:10px auto 0;text-align:center;font-size:10px;color:#9CA3AF;">
Helpline: +880 1700 998877 &bull; hello@rukhibd.com &bull; &copy; 2026 RUKHI
</div>
</body>
</html>`;

export const INVITE_USER_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>You're Invited - RUKHI</title></head>
<body style="margin:0;padding:20px 10px;background:#F7F7F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#FFF;border:2px solid #111;box-shadow:5px 5px 0 #111;">
<tr><td height="5" style="background:#E63946;font-size:0;line-height:5px;">&nbsp;</td></tr>
<tr><td style="background:#111;padding:20px;text-align:center;">
<div style="font-size:26px;font-weight:900;letter-spacing:3px;color:#FFF;text-transform:uppercase;">RUKHI<span style="color:#E63946;">.</span></div>
<div style="font-size:9px;font-weight:700;letter-spacing:2px;color:#9CA3AF;text-transform:uppercase;margin-top:2px;">Dhaka Streetwear &bull; Team Portal</div>
</td></tr>
<tr><td style="padding:24px 24px 10px;">
<span style="background:#FFF1F2;border:1px solid #FECDD3;color:#E63946;font-size:10px;font-weight:800;letter-spacing:1px;padding:3px 7px;">OFFICIAL INVITATION</span>
<h1 style="margin:10px 0 6px;font-size:20px;font-weight:900;text-transform:uppercase;color:#111;">You're invited to join.</h1>
<p style="margin:0;font-size:13px;line-height:1.5;color:#4B5563;">An invitation was created for <strong>{{ .Email }}</strong> to access the RUKHI platform. Accept below to configure your credentials.</p>
</td></tr>
<tr><td style="padding:10px 24px 18px;" align="center">
<a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;background:#111;color:#FFF;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:13px 30px;border:2px solid #111;box-shadow:3px 3px 0 #E63946;">Accept Invitation &rarr;</a>
</td></tr>
<tr><td style="padding:0 24px 18px;">
<div style="background:#F7F7F5;border:2px dashed #111;padding:14px;text-align:center;">
<div style="font-size:10px;font-weight:800;letter-spacing:1px;color:#6B7280;margin-bottom:3px;text-transform:uppercase;">One-time invitation code:</div>
<div style="font-family:Courier,monospace;font-size:24px;font-weight:900;letter-spacing:6px;color:#111;">{{ .Token }}</div>
<div style="font-size:10px;color:#9CA3AF;margin-top:2px;">Single-use invitation token</div>
</div>
</td></tr>
<tr><td style="padding:0 24px 14px;">
<div style="font-size:10px;color:#9CA3AF;line-height:1.4;border-top:1px solid #E5E7EB;padding-top:10px;">
Link not working? Paste into browser:<br><span style="color:#E63946;word-break:break-all;font-family:monospace;">{{ .ConfirmationURL }}</span>
</div>
</td></tr>
<tr><td style="background:#F7F7F5;padding:14px 24px;border-top:2px solid #111;font-size:10px;color:#6B7280;line-height:1.5;">
If you did not expect an invite, disregard this email.<br>
<strong style="color:#111;">Rukhi Bangladesh</strong> &bull; Dhaka &bull; <a href="{{ .SiteURL }}" style="color:#111;font-weight:700;">Open Platform</a>
</td></tr>
</table>
<div style="max-width:520px;margin:10px auto 0;text-align:center;font-size:10px;color:#9CA3AF;">
Admin Support: hello@rukhibd.com &bull; &copy; 2026 RUKHI
</div>
</body>
</html>`;

export const RESET_PASSWORD_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reset Password - RUKHI</title></head>
<body style="margin:0;padding:20px 10px;background:#F7F7F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#FFF;border:2px solid #111;box-shadow:5px 5px 0 #111;">
<tr><td height="5" style="background:#E63946;font-size:0;line-height:5px;">&nbsp;</td></tr>
<tr><td style="background:#111;padding:20px;text-align:center;">
<div style="font-size:26px;font-weight:900;letter-spacing:3px;color:#FFF;text-transform:uppercase;">RUKHI<span style="color:#E63946;">.</span></div>
<div style="font-size:9px;font-weight:700;letter-spacing:2px;color:#9CA3AF;text-transform:uppercase;margin-top:2px;">Dhaka Streetwear &bull; Account Security</div>
</td></tr>
<tr><td style="padding:24px 24px 10px;">
<span style="background:#FFF1F2;border:1px solid #FECDD3;color:#E63946;font-size:10px;font-weight:800;letter-spacing:1px;padding:3px 7px;">SECURITY ALERT</span>
<h1 style="margin:10px 0 6px;font-size:20px;font-weight:900;text-transform:uppercase;color:#111;">Reset Your Password</h1>
<p style="margin:0;font-size:13px;line-height:1.5;color:#4B5563;">We received a request to reset the password for <strong>{{ .Email }}</strong>. Enter the 6-digit code in the store modal or click the link below.</p>
</td></tr>
<tr><td style="padding:10px 24px 18px;">
<div style="background:#F7F7F5;border:2px solid #111;box-shadow:3px 3px 0 #111;padding:14px;text-align:center;">
<div style="font-size:10px;font-weight:800;letter-spacing:1px;color:#6B7280;margin-bottom:3px;text-transform:uppercase;">Your 6-Digit Reset Code</div>
<div style="font-family:Courier,monospace;font-size:30px;font-weight:900;letter-spacing:8px;color:#E63946;">{{ .Token }}</div>
<div style="font-size:10px;color:#6B7280;margin-top:2px;">Expires in 60 minutes</div>
</div>
</td></tr>
<tr><td style="padding:0 24px 16px;" align="center">
<a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;background:#111;color:#FFF;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:13px 30px;border:2px solid #111;box-shadow:3px 3px 0 #E63946;">Reset Password Link &rarr;</a>
</td></tr>
<tr><td style="padding:0 24px 14px;">
<div style="background:#FEF2F2;border-left:3px solid #E63946;padding:9px 12px;font-size:11px;color:#7F1D1D;line-height:1.4;">
<strong>Didn't request this?</strong> Ignore this email. Your current password remains secure.
</div>
</td></tr>
<tr><td style="padding:0 24px 14px;">
<div style="font-size:10px;color:#9CA3AF;line-height:1.4;border-top:1px solid #E5E7EB;padding-top:10px;">
Button not working? Direct URL:<br><span style="color:#E63946;word-break:break-all;font-family:monospace;">{{ .ConfirmationURL }}</span>
</div>
</td></tr>
<tr><td style="background:#F7F7F5;padding:14px 24px;border-top:2px solid #111;font-size:10px;color:#6B7280;line-height:1.5;">
<strong style="color:#111;">Rukhi Bangladesh</strong> &bull; Banani, Dhaka &bull; <a href="{{ .SiteURL }}" style="color:#111;font-weight:700;">Return to Store</a>
</td></tr>
</table>
<div style="max-width:520px;margin:10px auto 0;text-align:center;font-size:10px;color:#9CA3AF;">
Helpline: +880 1700 998877 &bull; hello@rukhibd.com &bull; &copy; 2026 RUKHI
</div>
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
    charCount: CONFIRM_SIGNUP_HTML.length,
    html: CONFIRM_SIGNUP_HTML,
  },
  {
    id: 'invite-user',
    title: 'User Invitation',
    supabaseTabName: 'Invite user',
    defaultSubject: "You've Been Invited to Join RUKHI",
    description: 'Sent when an administrator invites a team member, staff, or VIP customer to access the RUKHI platform with a single-use setup link and code.',
    variables: ['{{ .ConfirmationURL }}', '{{ .Token }}', '{{ .Email }}', '{{ .SiteURL }}'],
    charCount: INVITE_USER_HTML.length,
    html: INVITE_USER_HTML,
  },
  {
    id: 'reset-password',
    title: 'Forget Password / Reset Password',
    supabaseTabName: 'Reset password',
    defaultSubject: 'Reset Your RUKHI Password',
    description: 'Sent when a user requests password recovery. Features an eye-catching 6-digit OTP code (matching Rukhi\'s in-app 3-step modal) and direct 1-click reset link.',
    variables: ['{{ .ConfirmationURL }}', '{{ .Token }}', '{{ .Email }}', '{{ .SiteURL }}'],
    charCount: RESET_PASSWORD_HTML.length,
    html: RESET_PASSWORD_HTML,
  },
];

export function renderTemplatePreview(html: string, mockEmail = 'customer@example.com'): string {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://rukhibd.com';
  return html
    .replace(/\{\{\s*\.ConfirmationURL\s*\}\}/g, `${currentOrigin}/#auth-verify?token=demo123456`)
    .replace(/\{\{\s*\.Token\s*\}\}/g, '482915')
    .replace(/\{\{\s*\.Email\s*\}\}/g, mockEmail)
    .replace(/\{\{\s*\.SiteURL\s*\}\}/g, currentOrigin);
}
