# RUKHI Native Supabase Auth Email Templates

Custom designed, high-converting, mobile-responsive HTML email templates matching **RUKHI**'s streetwear aesthetic (black `#111111`, accent `#E63946`, warm off-white `#F7F7F5`).

Each template is 100% compliant with Supabase's email template engine and supports **both** 1-Click action links (`{{ .ConfirmationURL }}`) and the 6-digit OTP token box (`{{ .Token }}`), ensuring compatibility whether your auth flow uses link redirects or in-app OTP modal verification.

---

## 📁 Files Included

| File | Supabase Dashboard Section | Description |
| :--- | :--- | :--- |
| `confirm-signup.html` | **Authentication &rarr; Email Templates &rarr; Confirm signup** | Sent upon new customer registration to verify email. |
| `invite-user.html` | **Authentication &rarr; Email Templates &rarr; Invite user** | Sent when an admin invites a team member, staff, or user. |
| `reset-password.html` | **Authentication &rarr; Email Templates &rarr; Reset password** | Sent when a customer requests a password reset code/link. |

---

## 🚀 How to Setup in Supabase Dashboard

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project (e.g. `ospvqktnstfmratkcmcr`).
3. In the left navigation sidebar, navigate to **Authentication** &rarr; **Email Templates**.
4. Configure each template:

### 1. Confirm signup (Email Verification)
- Click the **Confirm signup** tab.
- **Subject line:** `Welcome to RUKHI - Confirm Your Email`
- In the **Message Body (HTML)** editor:
  - Select and delete the default content.
  - Open `supabase/email-templates/confirm-signup.html`, copy all contents, and paste into the editor.
- Click **Save**.

### 2. Invite user (User Invitation)
- Click the **Invite user** tab.
- **Subject line:** `You've Been Invited to Join RUKHI`
- In the **Message Body (HTML)** editor:
  - Delete default content.
  - Open `supabase/email-templates/invite-user.html`, copy all contents, and paste into the editor.
- Click **Save**.

### 3. Reset password (Forgot Password)
- Click the **Reset password** tab.
- **Subject line:** `Reset Your RUKHI Password`
- In the **Message Body (HTML)** editor:
  - Delete default content.
  - Open `supabase/email-templates/reset-password.html`, copy all contents, and paste into the editor.
- Click **Save**.

---

## 🏷️ Supabase Variables Used

These templates utilize standard Supabase Go template tags accepted by the Auth service:

- `{{ .ConfirmationURL }}` &mdash; Full one-click secure redirect URL with token.
- `{{ .Token }}` &mdash; 6-digit OTP code / alphanumeric verification code.
- `{{ .Email }}` &mdash; Recipient's registered email address.
- `{{ .SiteURL }}` &mdash; The base website URL set in your Supabase Auth Settings.

---

## 📱 Email Client Compatibility
- Tested and styled for **Gmail** (Desktop & Mobile App), **Apple Mail**, **Outlook**, **Yahoo Mail**, and mobile web views.
- Includes hidden preheaders to prevent awkward inbox preview text leaks.
- Uses bulletproof VML buttons for Outlook and clean inline CSS for spam filter compliance.
