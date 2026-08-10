import { logout } from '@/lib/api/auth';
import { setLoggingOut } from '@/lib/api/authRedirect';

export async function performClientLogout() {
  setLoggingOut(true);
  try {
    await logout();
  } catch {
    // виходимо навіть якщо API впав
  } finally {
    window.localStorage.removeItem('user_email');
    // replace, а не assign: назад у браузері не має вести на сторінку в стані «залогінений»
    window.location.replace('/');
  }
}
