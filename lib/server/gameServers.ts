// Конфіг ігрових Minecraft-серверів (окремий бекенд на порту 7000).
// Токен статичний і має лишатися ТІЛЬКИ на сервері — ніколи не віддаємо в браузер.

/** Складність світу — показуємо її замість кількості онлайну. */
export type ServerDifficulty = 'easy' | 'normal' | 'hard';

export const GAME_SERVERS = {
  luckysurvival: {
    name: 'LuckySurvival',
    ip: '188.245.202.194',
    difficulty: 'normal',
  },
  minewars: { name: 'MineWars', ip: '94.130.231.109', difficulty: 'hard' },
  calmsky: { name: 'CalmSky', ip: '195.201.115.31', difficulty: 'easy' },
} as const satisfies Record<
  string,
  { name: string; ip: string; difficulty: ServerDifficulty }
>;

export type GameServerKey = keyof typeof GAME_SERVERS;

export function getServerDifficulty(key: GameServerKey): ServerDifficulty {
  return GAME_SERVERS[key].difficulty;
}

export const GAME_API_PORT = 7000;

/** Стандартний порт Minecraft Java (technical/doc.txt). */
const MINECRAFT_GAME_PORT = 25565;

/** Підтримуваний діапазон версій Minecraft Java для всіх серверів. */
export const MINECRAFT_VERSION_LABEL = '1.12–1.19';

export function getServerConnectAddress(key: GameServerKey): string {
  return `${GAME_SERVERS[key].ip}:${MINECRAFT_GAME_PORT}`;
}

// Токен береться ТІЛЬКИ з оточення (.env.local на сервері). Без нього запит до
// ігрового API не пройде і сервер показуватиметься offline — це навмисно.
export const GAME_API_TOKEN = process.env.GAME_API_TOKEN ?? '';

// Боти не показуються в моніторингу — за ТЗ додаємо зміщення до кількості онлайн.
export const ONLINE_BOT_OFFSET = 30;
