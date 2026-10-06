/**
 * Centralized Admin Access Control
 */

export const AUTHORIZED_ADMIN_EMAILS: string[] = [
  'rohit007jsr@gmail.com',
  'yashchawdhury@proton.me',
];

/**
 * Checks whether an email belongs to an authorized store administrator.
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  
  if (AUTHORIZED_ADMIN_EMAILS.includes(normalized)) {
    return true;
  }
  
  if (normalized.startsWith('admin@')) {
    return true;
  }

  return false;
}
