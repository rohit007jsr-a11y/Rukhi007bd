# RUKHI Native Supabase Auth Email Templates (Optimized & Verified)

Custom designed, high-converting HTML email templates matching **RUKHI**'s streetwear aesthetic (black `#111111`, accent `#E63946`, warm off-white `#F7F7F5`).

> **Supabase Guideline Compliance Note:**
> Supabase Auth Email Templates strictly enforce a **5,000 character limit** (`content: <=5000 characters`). All templates below have been streamlined and verified to be well under this limit while preserving high-end responsive styling, branding, and dual-mode authentication.

---

## 📁 Template Directory & Size Audit

| File | Supabase Dashboard Tab | Character Count | Status |
| :--- | :--- | :--- | :--- |
| `confirm-signup.html` | **Confirm signup** | **3,229 chars** | Passed (`<= 5000`) |
| `invite-user.html` | **Invite user** | **3,232 chars** | Passed (`<= 5000`) |
| `reset-password.html` | **Reset password** | **3,503 chars** | Passed (`<= 5000`) |

---

## 🚀 How to Setup in Supabase Dashboard

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Authentication** &rarr; **Email Templates**.
3. Select each tab and paste the corresponding HTML:

### 1. Confirm signup (Email Verification)
- **Tab:** `Confirm signup`
- **Subject line:** `Welcome to RUKHI - Confirm Your Email`
- **Body:** Copy and paste the entire contents of `supabase/email-templates/confirm-signup.html`
- Click **Save changes**.

### 2. Invite user (User Invitation)
- **Tab:** `Invite user`
- **Subject line:** `You've Been Invited to Join RUKHI`
- **Body:** Copy and paste the entire contents of `supabase/email-templates/invite-user.html`
- Click **Save changes**.

### 3. Reset password (Forgot Password)
- **Tab:** `Reset password`
- **Subject line:** `Reset Your RUKHI Password`
- **Body:** Copy and paste the entire contents of `supabase/email-templates/reset-password.html`
- Click **Save changes**.

---

## 🏷️ Supported Supabase Variables
- `{{ .ConfirmationURL }}` &mdash; One-click secure redirect link.
- `{{ .Token }}` &mdash; 6-digit OTP code (matches Rukhi's in-app 3-step modal).
- `{{ .Email }}` &mdash; Recipient's email address.
- `{{ .SiteURL }}` &mdash; Store URL.
