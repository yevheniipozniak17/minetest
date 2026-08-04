// Liveness-перевірка для зовнішнього моніторингу: свідомо не звертається до
// ігрового API, щоб проба була миттєвою і не залежала від сторонніх сервісів.
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ ok: true });
}
