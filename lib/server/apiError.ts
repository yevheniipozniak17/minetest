import { NextResponse } from 'next/server';
import { isAxiosError } from 'axios';

// Тіло відповіді Django буває довгим (HTML-сторінка 500) — у лог пишемо обрізане.
function logSnippet(data: unknown): unknown {
  if (typeof data === 'string') return data.slice(0, 500);
  return data;
}

// Без цього причина збою апстріму ніде не лишається: роут віддає клієнту
// узагальнений detail, а справжній статус/тіло Django зникають у catch.
function logUpstream(err: unknown, fallback: string) {
  if (isAxiosError(err)) {
    console.error(`[upstream] ${fallback}`, {
      status: err.response?.status ?? null,
      code: err.code ?? null,
      method: err.config?.method,
      url: `${err.config?.baseURL ?? ''}${err.config?.url ?? ''}`,
      data: logSnippet(err.response?.data),
    });
    return;
  }
  console.error(`[upstream] ${fallback}`, err);
}

export function handleApiError(err: unknown, fallback = 'Request failed') {
  logUpstream(err, fallback);

  if (isAxiosError(err)) {
    // Таймаут/обрив до Django — це не «поганий шлюз», а відсутність відповіді вчасно.
    const timedOut = !err.response && (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT');
    const status = err.response?.status ?? (timedOut ? 504 : 502);
    const data = err.response?.data;

    // Django може віддати HTML (наприклад сторінку 500) — не пробрасуємо розмітку назад
    if (typeof data === 'string') {
      return NextResponse.json(
        { detail: status >= 500 ? 'Backend server error' : fallback },
        { status }
      );
    }

    return NextResponse.json(data ?? { detail: fallback }, { status });
  }

  return NextResponse.json({ detail: 'Unexpected error' }, { status: 500 });
}
