import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { isLoggingOut } from './authRedirect';

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Клієнт для авторизованих запитів: на 401 один раз оновлює токен і повторює,
// інакше відправляє користувача на /login.
export const http = axios.create({ baseURL: '/api' });

let refreshing: Promise<boolean> | null = null;

function tryRefresh(): Promise<boolean> {
  if (!refreshing) {
    refreshing = axios
      .post('/api/auth/refresh')
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

http.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      // Під час логауту не оновлюємо токен: /api/auth/refresh поставив би куки
      // назад уже після того, як /api/auth/logout їх зчистив.
      if (isLoggingOut()) return Promise.reject(error);

      original._retry = true;
      const ok = await tryRefresh();
      if (ok) return http(original);

      if (typeof window !== 'undefined') {
        if (window.location.pathname.startsWith('/dashboard')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);
