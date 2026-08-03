/** Mock leaderboard rows for marketing sections (home Rate, etc.). */
export type TopRatedPlayer = {
  rank: number;
  player: string;
  server: 'LuckySurvival' | 'MineWars' | 'CalmSky';
  level: number;
  play_time: string;
  active_score: string;
};

export const TOP_RATED_PLAYERS: TopRatedPlayer[] = [
  {
    rank: 1,
    player: 'RedstoneKing',
    server: 'LuckySurvival',
    level: 92,
    play_time: '412h',
    active_score: '12,840',
  },
  {
    rank: 2,
    player: 'WarLord',
    server: 'MineWars',
    level: 88,
    play_time: '387h',
    active_score: '11,520',
  },
  {
    rank: 3,
    player: 'SkyBuilder',
    server: 'CalmSky',
    level: 81,
    play_time: '341h',
    active_score: '10,230',
  },
  {
    rank: 4,
    player: 'AlexPvP',
    server: 'MineWars',
    level: 78,
    play_time: '318h',
    active_score: '9,840',
  },
  {
    rank: 5,
    player: 'PixelHunter',
    server: 'LuckySurvival',
    level: 74,
    play_time: '296h',
    active_score: '9,120',
  },
  {
    rank: 6,
    player: 'FireStrike',
    server: 'MineWars',
    level: 71,
    play_time: '274h',
    active_score: '8,650',
  },
  {
    rank: 7,
    player: 'CraftQueen',
    server: 'CalmSky',
    level: 68,
    play_time: '251h',
    active_score: '8,110',
  },
];

