/**
 * Utility to parse and format Supabase Auth errors into clean, user-friendly messages.
 * Prevents "{}" or raw technical objects from ever being displayed to the user.
 */
export function formatAuthError(err: any, fallbackMessage: string = 'An unexpected error occurred. Please try again.'): string {
  if (!err) return fallbackMessage;

  // Extract message if error is string
  if (typeof err === 'string') {
    const trimmed = err.trim();
    if (trimmed && trimmed !== '{}' && trimmed !== '[]' && trimmed !== '[object Object]') {
      return sanitizeMessage(trimmed);
    }
  }

  // Extract from AuthError / Error object
  let rawMsg = '';
  if (typeof err.message === 'string') {
    rawMsg = err.message;
  } else if (typeof err.error_description === 'string') {
    rawMsg = err.error_description;
  } else if (typeof err.msg === 'string') {
    rawMsg = err.msg;
  } else if (typeof err.error === 'string') {
    rawMsg = err.error;
  } else if (err.toString && typeof err.toString === 'function') {
    const str = err.toString();
    if (str && str !== '[object Object]' && str !== 'Error') {
      rawMsg = str;
    }
  }

  // Clean empty json strings or object artifacts
  rawMsg = rawMsg.trim();
  if (!rawMsg || rawMsg === '{}' || rawMsg === '[]' || rawMsg === '[object Object]') {
    // Check if network error or status 521 / 500 / 0
    if (err.status === 521 || err.status === 503 || err.status === 500 || err.name === 'FetchError' || (err.message && err.message.includes('fetch'))) {
      return 'Authentication server is temporarily unreachable. Please check your internet connection or verify the database is active.';
    }
    return fallbackMessage;
  }

  return sanitizeMessage(rawMsg);
}

function sanitizeMessage(msg: string): string {
  const lower = msg.toLowerCase();

  // Network / server offline
  if (lower.includes('failed to fetch') || lower.includes('networkerror') || lower.includes('521') || lower.includes('503')) {
    return 'Unable to reach the server. Please check your internet connection or try again in a few moments.';
  }

  // Invalid login credentials
  if (lower.includes('invalid login credentials') || lower.includes('invalid_grant') || lower.includes('wrong password')) {
    return 'Invalid email or password. Please check your details and try again.';
  }

  // User not found
  if (lower.includes('user not found') || lower.includes('user does not exist')) {
    return 'No account was found with this email address. Please create a new account.';
  }

  // User already registered
  if (lower.includes('user already registered') || lower.includes('already exists') || lower.includes('user_already_exists')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }

  // Rate limit / Too many requests
  if (lower.includes('rate limit') || lower.includes('over_email_send_rate_limit') || lower.includes('too many requests') || lower.includes('security purposes')) {
    return 'For security, please wait 60 seconds before requesting another email or verification code.';
  }

  // Email not confirmed
  if (lower.includes('email not confirmed')) {
    return 'Please check your email inbox to confirm your account, or reset your password.';
  }

  // OTP / Verification Code
  if (lower.includes('token has expired') || lower.includes('otp has expired') || lower.includes('invalid token') || lower.includes('token is expired') || lower.includes('invalid otp')) {
    return 'The verification code is invalid or has expired. Please request a new code.';
  }

  // Password requirements
  if (lower.includes('password should be at least') || lower.includes('password must be')) {
    return 'Password must be at least 6 characters long.';
  }

  // Signups disabled
  if (lower.includes('signup is disabled') || lower.includes('signups not allowed')) {
    return 'New user registrations are currently disabled on this server.';
  }

  // Email format
  if (lower.includes('invalid email') || lower.includes('email address is invalid')) {
    return 'Please enter a valid email address.';
  }

  // Default clean message
  return msg;
}
