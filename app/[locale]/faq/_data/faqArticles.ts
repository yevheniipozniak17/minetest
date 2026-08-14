import type { FaqArticleCategoryId, FaqCategoryId, FaqSortOption } from './faqTypes';

export type FaqArticleMeta = {
  slug: string;
  listId: string;
  categoryId: FaqArticleCategoryId;
  categoryLabel: string;
  listCategoryLabel: string;
  breadcrumbCategory: string;
  breadcrumbShort: string;
  breadcrumbItemsDesktop: string[];
  breadcrumbLinksDesktop: string[];
  question: string;
  updated: string;
  updatedFull: string;
  views: number;
  readMinutes: number;
  quickAnswer: string;
  featured?: boolean;
  excerpt: string;
};

type ArticleSeed = {
  slug: string;
  listId: string;
  categoryId: FaqArticleCategoryId;
  question: string;
  breadcrumbShort: string;
  updated: string;
  views: number;
  readMinutes: number;
  quickAnswer: string;
  excerpt: string;
  featured?: boolean;
};

const CATEGORY_META: Record<
  FaqArticleCategoryId,
  { label: string; listLabel: string; breadcrumb: string }
> = {
  'getting-started': {
    label: 'Getting started',
    listLabel: 'Get started',
    breadcrumb: 'Getting started',
  },
  account: { label: 'Account & login', listLabel: 'Account', breadcrumb: 'Account & login' },
  payments: { label: 'Payments', listLabel: 'Payments', breadcrumb: 'Payments' },
  servers: { label: 'Servers & worlds', listLabel: 'Servers', breadcrumb: 'Servers & worlds' },
  privileges: { label: 'Privileges', listLabel: 'Privileges', breadcrumb: 'Privileges' },
  gameplay: { label: 'Gameplay', listLabel: 'Gameplay', breadcrumb: 'Gameplay' },
  technical: { label: 'Technical issues', listLabel: 'Tech', breadcrumb: 'Technical issues' },
  rules: { label: 'Rules & moderation', listLabel: 'Rules', breadcrumb: 'Rules & moderation' },
};

function buildArticleMeta(seed: ArticleSeed): FaqArticleMeta {
  const category = CATEGORY_META[seed.categoryId];

  return {
    slug: seed.slug,
    listId: seed.listId,
    categoryId: seed.categoryId,
    categoryLabel: category.label,
    listCategoryLabel: category.listLabel,
    breadcrumbCategory: category.breadcrumb,
    breadcrumbShort: seed.breadcrumbShort,
    breadcrumbItemsDesktop: ['Home', 'Support', 'FAQ', category.breadcrumb, seed.breadcrumbShort],
    breadcrumbLinksDesktop: ['/', '/faq', '/faq', `/faq?category=${seed.categoryId}`],
    question: seed.question,
    updated: seed.updated,
    updatedFull: `Updated ${seed.updated}, 2026`,
    views: seed.views,
    readMinutes: seed.readMinutes,
    quickAnswer: seed.quickAnswer,
    excerpt: seed.excerpt,
    featured: seed.featured,
  };
}

const ARTICLE_SEEDS: ArticleSeed[] = [
  {
    slug: 'join',
    listId: '01',
    categoryId: 'getting-started',
    question: 'How do I join the server for the first time?',
    breadcrumbShort: 'How to join',
    updated: 'May 12',
    views: 12840,
    readMinutes: 3,
    quickAnswer:
      'Sign up → choose a server → copy IP → paste into Minecraft → Multiplayer → Add Server. The whole flow takes about 2 minutes if Minecraft is already installed.',
    excerpt:
      'Sign up on the website, pick a server, copy the IP from your dashboard, and add it in Minecraft Multiplayer. First join takes about two minutes.',
    featured: true,
  },
  {
    slug: 'supported-versions',
    listId: '02',
    categoryId: 'getting-started',
    question: 'What versions of Minecraft do you support?',
    breadcrumbShort: 'Supported versions',
    updated: 'May 09',
    views: 9620,
    readMinutes: 2,
    quickAnswer:
      'Java 1.12.2 – 1.19 and the latest Bedrock release. Versions outside this range are not supported because of the custom plugins we run.',
    excerpt:
      'We support Java 1.12.2 – 1.19 and the latest Bedrock release. Custom plugins require a supported client — other versions cannot connect.',
  },
  {
    slug: 'first-day-checklist',
    listId: '03',
    categoryId: 'getting-started',
    question: 'What should I do on my first day?',
    breadcrumbShort: 'First day checklist',
    updated: 'May 04',
    views: 7140,
    readMinutes: 3,
    quickAnswer:
      'Set a home, claim land, open /shop for daily quests, and join Discord. Those four steps cover 90% of new-player confusion.',
    excerpt:
      'Set a home with /sethome, claim your base, check /shop for daily quests, and join Discord to meet other players.',
  },
  {
    slug: 'dashboard-guide',
    listId: '04',
    categoryId: 'getting-started',
    question: 'How do I use the player dashboard?',
    breadcrumbShort: 'Dashboard guide',
    updated: 'Apr 28',
    views: 5890,
    readMinutes: 3,
    quickAnswer:
      'The dashboard shows server IPs, purchase history, tournament brackets, and account settings — all tied to one login.',
    excerpt:
      'Your dashboard holds server IPs, shop history, tournament status, and profile settings. Log in once to manage everything.',
  },
  {
    slug: 'change-nickname',
    listId: '05',
    categoryId: 'getting-started',
    question: 'Can I change my in-game nickname?',
    breadcrumbShort: 'Change nickname',
    updated: 'Apr 22',
    views: 4320,
    readMinutes: 2,
    quickAnswer:
      'Yes — once every 30 days from Dashboard → Settings. The change applies on next login across all servers.',
    excerpt:
      'You can change your visible nickname once every 30 days from Dashboard → Settings. It updates on your next login.',
  },
  {
    slug: 'reset-password',
    listId: '06',
    categoryId: 'account',
    question: 'I forgot my password — how do I reset it?',
    breadcrumbShort: 'Reset password',
    updated: 'May 09',
    views: 11200,
    readMinutes: 2,
    quickAnswer:
      'Use Forgot password on the login page. We email a one-time link valid for 30 minutes.',
    excerpt:
      'Click Forgot password on the login page. We send a one-time reset link to your email — valid for 30 minutes.',
  },
  {
    slug: 'link-microsoft',
    listId: '07',
    categoryId: 'account',
    question: 'How do I link my Microsoft / Mojang account?',
    breadcrumbShort: 'Link Microsoft',
    updated: 'May 04',
    views: 8760,
    readMinutes: 3,
    quickAnswer:
      'Dashboard → Settings → Linked accounts → Connect Microsoft. You stay logged in on both Java and Bedrock after linking.',
    excerpt:
      'Open Dashboard → Settings → Linked accounts and connect Microsoft. One link covers Java and Bedrock login going forward.',
  },
  {
    slug: 'two-factor-auth',
    listId: '08',
    categoryId: 'account',
    question: 'Do you support two-factor authentication?',
    breadcrumbShort: 'Two-factor auth',
    updated: 'Apr 28',
    views: 5210,
    readMinutes: 2,
    quickAnswer:
      'Yes — enable TOTP from Dashboard → Security. Required for large shop purchases once your account exceeds $50 lifetime spend.',
    excerpt:
      'Enable two-factor authentication from Dashboard → Security. We require it for high-value shop purchases on active accounts.',
  },
  {
    slug: 'delete-account',
    listId: '09',
    categoryId: 'account',
    question: 'How do I delete my account?',
    breadcrumbShort: 'Delete account',
    updated: 'Apr 20',
    views: 3180,
    readMinutes: 3,
    quickAnswer:
      'Dashboard → Settings → Delete account. Progress is removed after a 14-day grace period; purchases are not refunded automatically.',
    excerpt:
      'Request deletion from Dashboard → Settings. There is a 14-day grace period before progress is permanently removed.',
  },
  {
    slug: 'payment-methods',
    listId: '10',
    categoryId: 'payments',
    question: 'What payment methods do you accept?',
    breadcrumbShort: 'Payment methods',
    updated: 'Apr 25',
    views: 6540,
    readMinutes: 2,
    quickAnswer:
      'Visa, Mastercard, PayPal, Apple Pay, and Google Pay in supported regions. Crypto is not accepted.',
    excerpt:
      'We accept Visa, Mastercard, PayPal, Apple Pay, and Google Pay where available. All checkout runs through our secure payment partner.',
  },
  {
    slug: 'donations-privileges',
    listId: '11',
    categoryId: 'payments',
    question: 'How do donations and privileges work?',
    breadcrumbShort: 'Donations & privileges',
    updated: 'Apr 20',
    views: 7890,
    readMinutes: 3,
    quickAnswer:
      'Privileges are cosmetic and convenience perks — never pay-to-win. They activate instantly after payment and sync to every server.',
    excerpt:
      'Shop purchases grant ranks and cosmetics that sync across all servers. Privileges are convenience perks, not combat advantages.',
  },
  {
    slug: 'refund-policy',
    listId: '12',
    categoryId: 'payments',
    question: 'Can I refund a purchase or privilege?',
    breadcrumbShort: 'Refund policy',
    updated: 'Apr 18',
    views: 5430,
    readMinutes: 3,
    quickAnswer:
      'Refunds within 48 hours if the privilege was not used in-game. Open a ticket with your order ID from Dashboard → History.',
    excerpt:
      'Unused privileges can be refunded within 48 hours. Open a support ticket with your order ID from Dashboard → History.',
  },
  {
    slug: 'payment-failed',
    listId: '13',
    categoryId: 'payments',
    question: 'My payment failed — what should I do?',
    breadcrumbShort: 'Failed payment',
    updated: 'Apr 15',
    views: 4120,
    readMinutes: 2,
    quickAnswer:
      'Check your bank for blocks, try another method, or wait 15 minutes and retry. Double charges auto-reverse within an hour.',
    excerpt:
      'Verify your bank allows game purchases, try another payment method, or wait fifteen minutes before retrying.',
  },
  {
    slug: 'server-differences',
    listId: '14',
    categoryId: 'servers',
    question: "What's the difference between LuckySurvival, MineWars, and CalmSky?",
    breadcrumbShort: 'Server differences',
    updated: 'Apr 15',
    views: 9340,
    readMinutes: 3,
    quickAnswer:
      'LuckySurvival — fair PvP, TNT off. MineWars — ranked PvP, TNT on. CalmSky — peaceful building, no PvP.',
    excerpt:
      'LuckySurvival is balanced survival, MineWars is competitive PvP with TNT, and CalmSky is a peaceful building server.',
  },
  {
    slug: 'switch-servers',
    listId: '15',
    categoryId: 'servers',
    question: 'Can I switch between servers with one account?',
    breadcrumbShort: 'Switch servers',
    updated: 'Apr 12',
    views: 6780,
    readMinutes: 2,
    quickAnswer:
      'Yes — one account, separate inventories per server. Copy the new IP from Dashboard → Servers and add it in Minecraft.',
    excerpt:
      'One account works on every server. Each world keeps its own inventory — copy a new IP from the dashboard when switching.',
  },
  {
    slug: 'world-resets',
    listId: '16',
    categoryId: 'servers',
    question: 'Do worlds reset? How often?',
    breadcrumbShort: 'World resets',
    updated: 'Apr 08',
    views: 5560,
    readMinutes: 3,
    quickAnswer:
      'Main worlds do not reset on a schedule. Seasonal event worlds wipe after each tournament season — usually every three months.',
    excerpt:
      'Core survival worlds persist indefinitely. Seasonal event maps reset after each tournament season, roughly every three months.',
  },
  {
    slug: 'download-world',
    listId: '17',
    categoryId: 'servers',
    question: 'Can I download my world or builds?',
    breadcrumbShort: 'Download world',
    updated: 'Apr 04',
    views: 3890,
    readMinutes: 3,
    quickAnswer:
      'Claim owners can request a schematic export of their claimed area once per season from Dashboard → Servers → Export.',
    excerpt:
      'If you own a claim, request a schematic export once per season from Dashboard → Servers → Export.',
  },
  {
    slug: 'server-status',
    listId: '18',
    categoryId: 'servers',
    question: 'How do I check if a server is online?',
    breadcrumbShort: 'Server status',
    updated: 'Mar 30',
    views: 7210,
    readMinutes: 2,
    quickAnswer:
      'Dashboard → Servers shows live status. Green dot = online. You can also subscribe to status alerts by email.',
    excerpt:
      'Open Dashboard → Servers for live status dots, or enable email alerts when a server goes offline for maintenance.',
  },
  {
    slug: 'rank-benefits',
    listId: '19',
    categoryId: 'privileges',
    question: 'What benefits do VIP ranks include?',
    breadcrumbShort: 'VIP benefits',
    updated: 'Apr 12',
    views: 8120,
    readMinutes: 3,
    quickAnswer:
      'Extra homes, chat cosmetics, queue priority, and particle trails. No combat or economy advantages on any server.',
    excerpt:
      'VIP ranks add homes, chat flair, queue priority, and cosmetics. They never grant combat or economy advantages.',
  },
  {
    slug: 'rank-duration',
    listId: '20',
    categoryId: 'privileges',
    question: 'How long do purchased ranks last?',
    breadcrumbShort: 'Rank duration',
    updated: 'Apr 08',
    views: 4670,
    readMinutes: 2,
    quickAnswer:
      'Most ranks are 30 or 90 days. Lifetime tiers exist for supporters. Expiry dates appear in Dashboard → History.',
    excerpt:
      'Standard ranks run 30 or 90 days. Lifetime tiers are available in the shop — expiry dates show in your purchase history.',
  },
  {
    slug: 'gift-rank',
    listId: '21',
    categoryId: 'privileges',
    question: 'Can I gift a rank to another player?',
    breadcrumbShort: 'Gift a rank',
    updated: 'Apr 02',
    views: 3540,
    readMinutes: 2,
    quickAnswer:
      'Yes — choose Gift at checkout and enter the recipient username. They receive an in-game notification when it activates.',
    excerpt:
      'Select Gift at checkout and enter the recipient username. They get an in-game notification when the rank activates.',
  },
  {
    slug: 'claims-protection',
    listId: '22',
    categoryId: 'gameplay',
    question: 'How do claims and grief protection work?',
    breadcrumbShort: 'Claims & protection',
    updated: 'Apr 08',
    views: 10450,
    readMinutes: 3,
    quickAnswer:
      'Use a golden shovel to claim land. Blocks inside your claim cannot be broken by other players unless you trust them.',
    excerpt:
      'Claim land with a golden shovel. Other players cannot break blocks inside your claim unless you explicitly trust them.',
  },
  {
    slug: 'economy-basics',
    listId: '23',
    categoryId: 'gameplay',
    question: 'How does the in-game economy work?',
    breadcrumbShort: 'Economy basics',
    updated: 'Apr 04',
    views: 6980,
    readMinutes: 3,
    quickAnswer:
      'Earn coins from quests, trading, and events. Spend at /shop and player markets. Taxes apply only to large chest-shop sales.',
    excerpt:
      'Earn coins through quests, trading, and events. Spend at /shop or player markets — small trades have no tax.',
  },
  {
    slug: 'tournaments',
    listId: '24',
    categoryId: 'gameplay',
    question: 'How do weekly tournaments work?',
    breadcrumbShort: 'Tournaments',
    updated: 'Mar 28',
    views: 8870,
    readMinutes: 3,
    quickAnswer:
      'Brackets open Friday 18:00 UTC and close Sunday 23:59 UTC. Sign up from Dashboard → Tournaments or /tournament in-game.',
    excerpt:
      'Weekly brackets run Friday through Sunday UTC. Register from Dashboard → Tournaments or type /tournament in-game.',
  },
  {
    slug: 'report-player',
    listId: '25',
    categoryId: 'gameplay',
    question: 'How do I report another player?',
    breadcrumbShort: 'Report a player',
    updated: 'Mar 24',
    views: 5120,
    readMinutes: 2,
    quickAnswer:
      'Type /report <username> <reason> in-game or open a ticket with screenshots. Reports are reviewed within 24 hours.',
    excerpt:
      'Use /report in-game or open a support ticket with screenshots. Moderators review reports within twenty-four hours.',
  },
  {
    slug: 'connection-lost',
    listId: '26',
    categoryId: 'technical',
    question: 'Why am I getting "connection lost" errors?',
    breadcrumbShort: 'Connection lost',
    updated: 'Apr 12',
    views: 11890,
    readMinutes: 3,
    quickAnswer:
      'Usually a firewall, VPN, or version mismatch. Allow port 25565, disable VPN, and confirm you run Java 1.12.2 – 1.19 or latest Bedrock.',
    excerpt:
      'Connection lost errors usually mean a firewall, VPN, or version mismatch. Allow port 25565 and update your client.',
  },
  {
    slug: 'resource-pack-issues',
    listId: '27',
    categoryId: 'technical',
    question: "The resource pack won't download — what now?",
    breadcrumbShort: 'Resource pack issues',
    updated: 'Apr 08',
    views: 7640,
    readMinutes: 3,
    quickAnswer:
      'Restart Minecraft, rejoin, and wait on the loading screen. If stuck at 0%, type /resourcepack reload after spawning.',
    excerpt:
      'Restart Minecraft and rejoin. If the pack hangs at zero percent, type /resourcepack reload after you spawn in.',
  },
  {
    slug: 'lag-performance',
    listId: '28',
    categoryId: 'technical',
    question: 'How do I fix lag or low FPS on the server?',
    breadcrumbShort: 'Lag & performance',
    updated: 'Apr 02',
    views: 6230,
    readMinutes: 3,
    quickAnswer:
      'Lower render distance to 12 chunks, disable heavy shaders, and close background apps. Server-side lag spikes are posted on Discord.',
    excerpt:
      'Lower render distance, disable heavy shaders, and close background apps. Check Discord for known server-side lag events.',
  },
  {
    slug: 'server-rules',
    listId: '29',
    categoryId: 'rules',
    question: 'What are the main server rules?',
    breadcrumbShort: 'Server rules',
    updated: 'Mar 28',
    views: 9450,
    readMinutes: 3,
    quickAnswer:
      'No cheating, harassment, or real-money trading. Respect claims, follow chat guidelines, and listen to staff instructions.',
    excerpt:
      'No cheating, harassment, or real-money trading. Respect claims, keep chat civil, and follow staff directions.',
  },
  {
    slug: 'ban-appeal',
    listId: '30',
    categoryId: 'rules',
    question: 'How do I appeal a ban or mute?',
    breadcrumbShort: 'Ban appeal',
    updated: 'Mar 22',
    views: 4890,
    readMinutes: 3,
    quickAnswer:
      'Open Dashboard → Support → Appeal with your case ID. Appeals are reviewed within 72 hours — one appeal per punishment.',
    excerpt:
      'Submit an appeal from Dashboard → Support with your case ID. Each punishment allows one appeal, reviewed within 72 hours.',
  },
];

export const FAQ_ARTICLES: FaqArticleMeta[] = ARTICLE_SEEDS.map(buildArticleMeta);

export function getFaqArticleBySlug(slug: string): FaqArticleMeta | undefined {
  return FAQ_ARTICLES.find(article => article.slug === slug);
}

export function getAllFaqSlugs(): string[] {
  return FAQ_ARTICLES.map(article => article.slug);
}

export function getFaqArticleHref(slug: string): string {
  return `/faq/${slug}`;
}

export function formatArticleViews(views: number): string {
  return views.toLocaleString('en-US');
}

function getArticlesByCategory(categoryId: FaqCategoryId): FaqArticleMeta[] {
  if (categoryId === 'all') {
    return FAQ_ARTICLES;
  }

  return FAQ_ARTICLES.filter(article => article.categoryId === categoryId);
}

function matchesFaqSearch(article: FaqArticleMeta, query: string): boolean {
  const haystack = [
    article.question,
    article.excerpt,
    article.quickAnswer,
    article.categoryLabel,
    article.listCategoryLabel,
    article.breadcrumbShort,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

export function filterFaqArticles(categoryId: FaqCategoryId, searchQuery: string): FaqArticleMeta[] {
  const normalized = searchQuery.trim().toLowerCase();
  const byCategory = getArticlesByCategory(categoryId);

  if (!normalized) {
    return byCategory;
  }

  return byCategory.filter(article => matchesFaqSearch(article, normalized));
}

const MONTH_INDEX: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function getUpdatedTimestamp(updated: string): number {
  const [month, day] = updated.split(' ');
  const monthIndex = MONTH_INDEX[month] ?? 0;
  const dayNumber = Number.parseInt(day ?? '1', 10);

  return new Date(2026, monthIndex, Number.isNaN(dayNumber) ? 1 : dayNumber).getTime();
}

export function sortFaqArticles(articles: FaqArticleMeta[], sort: FaqSortOption): FaqArticleMeta[] {
  const byListId = (a: FaqArticleMeta, b: FaqArticleMeta) =>
    a.listId.localeCompare(b.listId, undefined, { numeric: true });

  if (sort === 'all') {
    return [...articles].sort(byListId);
  }

  const sorted = [...articles];

  return sorted.sort(
    (a, b) => getUpdatedTimestamp(b.updated) - getUpdatedTimestamp(a.updated) || byListId(a, b),
  );
}

export const FAQ_TOTAL_COUNT = FAQ_ARTICLES.length;

export function getCategoryCounts(): Record<FaqArticleCategoryId, number> {
  const counts = {
    'getting-started': 0,
    account: 0,
    payments: 0,
    servers: 0,
    privileges: 0,
    gameplay: 0,
    technical: 0,
    rules: 0,
  } satisfies Record<FaqArticleCategoryId, number>;

  for (const article of FAQ_ARTICLES) {
    counts[article.categoryId] += 1;
  }

  return counts;
}

export function getRelatedArticleSlugs(slug: string, limit = 3): string[] {
  const current = getFaqArticleBySlug(slug);
  if (!current) {
    return [];
  }

  return FAQ_ARTICLES.filter(
    article => article.slug !== slug && article.categoryId === current.categoryId,
  )
    .slice(0, limit)
    .map(article => article.slug);
}
