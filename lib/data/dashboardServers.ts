import { GAME_SERVERS, type ServerDifficulty } from '@/lib/server/gameServers';

type ServerStatus = 'online' | 'offline';

export type DashboardServer = {
  id: string;
  name: string;
  nameMobile?: string;
  breadcrumbLabel: string;
  detailTitle: string;
  status: ServerStatus;
  difficulty: ServerDifficulty;
  image: string;
  latency: string;
  uptime: string;
  ip: string;
  version: string;
  featureCount: number;
  featureCountDesktop: number;
};

export const DASHBOARD_SERVERS: DashboardServer[] = [
  {
    id: 'luckysurvival',
    name: 'LuckySurvival',
    breadcrumbLabel: 'LuckySurvival',
    detailTitle: 'LuckySurvival',
    status: 'online',
    difficulty: GAME_SERVERS.luckysurvival.difficulty,
    image: '/profile/servers/1.webp',
    latency: '12 ms',
    uptime: '99.9%',
    ip: GAME_SERVERS.luckysurvival.ip,
    version: 'Java • 1.12–1.19',
    featureCount: 4,
    featureCountDesktop: 4,
  },
  {
    id: 'minewars',
    name: 'MineWars',
    breadcrumbLabel: 'MineWars',
    detailTitle: 'MineWars',
    status: 'online',
    difficulty: GAME_SERVERS.minewars.difficulty,
    image: '/profile/servers/2.webp',
    latency: '8 ms',
    uptime: '99.8%',
    ip: GAME_SERVERS.minewars.ip,
    version: 'Java • 1.12–1.19',
    featureCount: 4,
    featureCountDesktop: 4,
  },
  {
    id: 'calmsky',
    name: 'CalmSky',
    nameMobile: 'CalmSky',
    breadcrumbLabel: 'CalmSky',
    detailTitle: 'CalmSky',
    status: 'online',
    difficulty: GAME_SERVERS.calmsky.difficulty,
    image: '/profile/servers/3.webp',
    latency: '15 ms',
    uptime: '99.7%',
    ip: GAME_SERVERS.calmsky.ip,
    version: 'Java • 1.12–1.19',
    featureCount: 4,
    featureCountDesktop: 4,
  },
];

export function getDashboardServer(id: string): DashboardServer | undefined {
  return DASHBOARD_SERVERS.find(server => server.id === id);
}
