// Фронт цей роут не використовує — його пінгує зовнішній моніторинг (алерт
// McGameApiDown). Не видаляти разом зі змінами відображення онлайну на сайті.
import { NextResponse } from 'next/server';
import { fetchServerOnline } from '@/lib/server/fetchServerOnline';
import { GAME_SERVERS, type GameServerKey } from '@/lib/server/gameServers';

export const dynamic = 'force-dynamic';

const SERVER_KEYS = Object.keys(GAME_SERVERS) as GameServerKey[];

export async function GET() {
  const servers = await Promise.all(SERVER_KEYS.map(fetchServerOnline));

  const totalOnline = servers.reduce((sum, entry) => sum + (entry.online ?? 0), 0);
  const serversOnline = servers.filter(entry => entry.status === 'online').length;

  return NextResponse.json({
    totalOnline,
    serversOnline,
    totalServers: SERVER_KEYS.length,
    servers,
  });
}
