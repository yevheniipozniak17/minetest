import type { FaqArticleFullContent, FaqSectionContent } from './faqArticleTypes';
import {
  JOIN_ADD_SERVER,
  JOIN_BEFORE,
  JOIN_CHOOSE_SERVER,
  JOIN_CONNECT,
  JOIN_CREATE_ACCOUNT,
  JOIN_LEAD,
  JOIN_TROUBLESHOOTING,
  JOIN_WHATS_NEXT,
} from './joinArticleContent';

function block(mobile: string, desktop?: string) {
  return { mobile, desktop: desktop ?? mobile };
}

function list(mobile: readonly string[], desktop?: readonly string[]) {
  return { mobile, desktop: desktop ?? mobile };
}

const JOIN_CONTENT: FaqArticleFullContent = {
  lead: JOIN_LEAD,
  sidebarRelatedSlugs: [
    'supported-versions',
    'reset-password',
    'connection-lost',
    'link-microsoft',
  ],
  cta: {
    primary: 'Join Twitch',
    primaryHref: 'https://www.twitch.tv/minecraftsgame',
    secondary: 'Browse all FAQ',
    secondaryHref: '/faq',
  },
  sections: [
    {
      id: 'before-you-start',
      tocNum: '01',
      tocLabel: 'Before you start',
      title: 'Before you start',
      lead: JOIN_BEFORE.lead,
      bullets: JOIN_BEFORE.bullets,
      callout: { variant: 'info', title: 'Heads up', text: JOIN_BEFORE.callout },
    },
    {
      id: 'create-account',
      tocNum: '02',
      tocLabel: '1. Create an account',
      title: '1. Create an account',
      lead: JOIN_CREATE_ACCOUNT.lead,
      steps: JOIN_CREATE_ACCOUNT.steps,
      figure: {
        src: '/faq/article1.webp',
        alt: 'Green Minecraft cat creating an account at a terminal',
        caption: JOIN_CREATE_ACCOUNT.caption,
      },
    },
    {
      id: 'choose-server',
      tocNum: '03',
      tocLabel: '2. Choose your server',
      title: '2. Choose your server',
      lead: JOIN_CHOOSE_SERVER.lead,
      bullets: JOIN_CHOOSE_SERVER.bullets,
      callout: { variant: 'info', title: 'Tip', text: JOIN_CHOOSE_SERVER.callout },
    },
    {
      id: 'add-server',
      tocNum: '04',
      tocLabel: '3. Add the server',
      title: JOIN_ADD_SERVER.title.mobile,
      titleDesktop: JOIN_ADD_SERVER.title.desktop,
      lead: JOIN_ADD_SERVER.lead,
      steps: JOIN_ADD_SERVER.steps,
      showIpBox: true,
    },
    {
      id: 'connect',
      tocNum: '05',
      tocLabel: '4. Connect for the first time',
      title: '4. Connect for the first time',
      lead: JOIN_CONNECT.lead,
      steps: JOIN_CONNECT.steps,
      figure: {
        src: '/faq/article2.webp',
        alt: 'Green Minecraft cat in the spawn lobby',
        caption: JOIN_CONNECT.caption,
        desktopOnly: true,
      },
      callout: {
        variant: 'success',
        title: JOIN_CONNECT.successTitle.mobile,
        titleDesktop: JOIN_CONNECT.successTitle.desktop,
        text: JOIN_CONNECT.callout,
      },
    },
    {
      id: 'troubleshooting',
      tocNum: '06',
      tocLabel: 'Troubleshooting',
      title: 'Troubleshooting',
      lead: JOIN_TROUBLESHOOTING.lead,
      troubleItems: JOIN_TROUBLESHOOTING.items,
    },
    {
      id: 'whats-next',
      tocNum: '07',
      tocLabel: "What's next?",
      title: "What's next?",
      lead: JOIN_WHATS_NEXT.lead,
      bullets: JOIN_WHATS_NEXT.bullets,
    },
  ],
};

type SimpleArticleSeed = {
  slug: string;
  lead: { mobile: string; desktop: string };
  sections: Array<{
    title: string;
    lead: { mobile: string; desktop: string };
    bullets?: string[];
    steps?: string[];
    callout?: { title: string; mobile: string; desktop: string };
    troubleItems?: {
      mobile: readonly { title: string; text: string }[];
      desktop: readonly { title: string; text: string }[];
    };
  }>;
  related: string[];
};

function buildSimpleArticle(seed: SimpleArticleSeed): FaqArticleFullContent {
  const sections: FaqSectionContent[] = seed.sections.map((section, index) => ({
    id: `section-${index + 1}`,
    tocNum: String(index + 1).padStart(2, '0'),
    tocLabel: section.title,
    title: section.title,
    lead: block(section.lead.mobile, section.lead.desktop),
    bullets: section.bullets ? list(section.bullets, section.bullets) : undefined,
    steps: section.steps ? list(section.steps, section.steps) : undefined,
    callout: section.callout
      ? {
          variant: 'info' as const,
          title: section.callout.title,
          text: block(section.callout.mobile, section.callout.desktop),
        }
      : undefined,
    troubleItems: section.troubleItems,
  }));

  return {
    lead: block(seed.lead.mobile, seed.lead.desktop),
    sections,
    sidebarRelatedSlugs: seed.related,
    cta: {
      primary: 'Contact us',
      primaryHref: '/faq',
      secondary: 'Browse all FAQ',
      secondaryHref: '/faq',
    },
  };
}

const SIMPLE_ARTICLES: SimpleArticleSeed[] = [
  {
    slug: 'supported-versions',
    lead: {
      mobile:
        'We run custom plugins that require a current Minecraft client. Here is what works today.',
      desktop:
        'We run custom plugins, anti-cheat, and economy systems that require a current Minecraft client. Here is exactly what works today — and what does not.',
    },
    sections: [
      {
        title: 'Supported clients',
        lead: {
          mobile: 'These versions connect without compatibility warnings.',
          desktop:
            'These client versions connect without compatibility warnings and receive the full feature set including tournaments and the in-game shop.',
        },
        bullets: [
          'Java Edition 1.20.4 — recommended for PC players.',
          'Latest Bedrock release on Windows, iOS, Android, and console.',
          'Our launcher auto-selects the correct profile after login.',
        ],
      },
      {
        title: 'Unsupported versions',
        lead: {
          mobile: 'Older clients cannot join because plugin APIs differ between major releases.',
          desktop:
            'Older clients cannot join because our plugin APIs differ between major releases. Attempting to connect shows an outdated client or server message.',
        },
        bullets: [
          'Java versions below 1.20.4.',
          'Legacy console editions without Bedrock cross-play.',
          'Cracked or modified clients flagged by anti-cheat.',
        ],
        callout: {
          title: 'Tip',
          mobile:
            'Update Minecraft before copying a server IP — it saves a confusing error screen.',
          desktop:
            'Update Minecraft to the latest patch before copying a server IP. It saves a confusing error screen and a common support dead-end.',
        },
      },
      {
        title: 'Check your version',
        lead: {
          mobile:
            'Java: main menu bottom-left shows the version string. Bedrock: Settings → About.',
          desktop:
            'Java Edition shows the version string on the main menu bottom-left. Bedrock lists the build under Settings → About. Match it against the supported list above.',
        },
        steps: [
          'Open Minecraft and note your version number.',
          'Compare it to Java 1.20.4 or the latest Bedrock build.',
          'Update through the official launcher if needed.',
          'Reconnect to the server from your dashboard IP.',
        ],
      },
    ],
    related: ['join', 'connection-lost', 'resource-pack-issues'],
  },
  {
    slug: 'first-day-checklist',
    lead: {
      mobile:
        'Your first session sets the pace for everything after. These four steps cover what most new players miss.',
      desktop:
        'Your first session sets the pace for everything after. These four steps cover what most new players miss before they ask in chat — homes, claims, quests, and community.',
    },
    sections: [
      {
        title: 'Set a home base',
        lead: {
          mobile: 'Run /sethome where you want to return. You start with three free home slots.',
          desktop:
            'Run /sethome where you want to return after mining or dying. Every account starts with three free home slots across all survival servers.',
        },
        steps: [
          'Build or find a safe spot above ground.',
          'Stand in the center and type /sethome base.',
          'Test with /home base before exploring far.',
        ],
      },
      {
        title: 'Claim your land',
        lead: {
          mobile:
            'A golden shovel defines your protected area. Other players cannot grief inside it.',
          desktop:
            'Craft or buy a golden shovel to define your protected area. Other players cannot break blocks inside unless you /trust them explicitly.',
        },
        bullets: [
          'Right-click two opposite corners with the golden shovel.',
          'Claims show particle borders only to you.',
          'Expand later with /claim expand when you have claim blocks.',
        ],
      },
      {
        title: 'Open the shop and quests',
        lead: {
          mobile:
            '/shop lists daily quests that pay coins for simple tasks — mine stone, catch fish, deliver items.',
          desktop:
            '/shop lists daily quests that pay coins for simple tasks like mining stone, catching fish, or delivering items to NPCs at spawn.',
        },
        bullets: [
          'Daily quests reset at 00:00 UTC.',
          'Coins spend at player markets and the official shop.',
          'Quest progress syncs if you switch servers later the same day.',
        ],
      },
    ],
    related: ['join', 'claims-protection', 'economy-basics'],
  },
  {
    slug: 'dashboard-guide',
    lead: {
      mobile:
        'The dashboard is your control panel outside Minecraft — servers, purchases, tournaments, and settings.',
      desktop:
        'The dashboard is your control panel outside Minecraft. Everything tied to your account lives here: server IPs, purchases, tournament brackets, and profile settings.',
    },
    sections: [
      {
        title: 'Servers page',
        lead: {
          mobile: 'Copy IPs, see live status, and jump to server-specific guides.',
          desktop:
            'The Servers page lists every world you can join with one-click IP copy, live status dots, and links to server-specific guides.',
        },
        bullets: [
          'Green dot = server online and accepting players.',
          'Copy IP adds the address to your clipboard.',
          'Last played timestamp helps you pick up where you left off.',
        ],
      },
      {
        title: 'Shop & history',
        lead: {
          mobile: 'Buy ranks and cosmetics. History stores receipts and expiry dates.',
          desktop:
            'Buy ranks and cosmetics from the integrated shop. History stores receipts, expiry dates, and refund eligibility windows.',
        },
        bullets: [
          'Privileges activate within seconds of payment.',
          'Gift checkout lets you send ranks to friends.',
          'Download invoices for your records from any order row.',
        ],
      },
      {
        title: 'Tournaments & settings',
        lead: {
          mobile: 'Register for brackets and manage nickname, security, and linked accounts.',
          desktop:
            'Register for active brackets, view seeding, and manage nickname changes, two-factor authentication, and linked Microsoft accounts.',
        },
        steps: [
          'Open Tournaments during an active season window.',
          'Click Register on the bracket you qualify for.',
          'Adjust profile settings under Settings → Profile.',
        ],
      },
    ],
    related: ['join', 'switch-servers', 'tournaments'],
  },
  {
    slug: 'change-nickname',
    lead: {
      mobile: 'Your nickname is what other players see in chat and in the tab list.',
      desktop:
        'Your nickname is what other players see in chat and in the tab list. It can differ from your Microsoft gamertag or email username.',
    },
    sections: [
      {
        title: 'Change your nickname',
        lead: {
          mobile: 'Dashboard → Settings → Profile → Edit nickname.',
          desktop:
            'Go to Dashboard → Settings → Profile and click Edit nickname. Confirm with your password if two-factor authentication is enabled.',
        },
        steps: [
          'Open Settings → Profile in the dashboard.',
          'Click Edit nickname and type the new name.',
          'Save — the change applies on your next login.',
        ],
      },
      {
        title: 'Naming rules',
        lead: {
          mobile: 'Names must be 3–16 characters, alphanumeric plus underscores.',
          desktop:
            'Names must be 3–16 characters, alphanumeric plus underscores, and cannot impersonate staff or contain slurs filtered by our chat system.',
        },
        bullets: [
          'Offensive names are rejected automatically.',
          'Staff names and rank prefixes are reserved.',
          'You cannot take a name already linked to another account.',
        ],
      },
      {
        title: 'Cooldown',
        lead: {
          mobile: 'Nickname changes are limited to once every 30 days per account.',
          desktop:
            'Nickname changes are limited to once every 30 days per account to prevent confusion in trades and tournament records.',
        },
        callout: {
          title: 'Heads up',
          mobile: 'Tournament seasons lock nicknames 24 hours before finals.',
          desktop:
            'Active tournament seasons lock nickname changes 24 hours before finals — plan changes outside that window.',
        },
      },
    ],
    related: ['dashboard-guide', 'link-microsoft', 'two-factor-auth'],
  },
  {
    slug: 'reset-password',
    lead: {
      mobile: 'Password resets are email-based and expire quickly for security.',
      desktop:
        'Password resets are email-based, expire quickly for security, and never ask you to share the new password with staff.',
    },
    sections: [
      {
        title: 'Request a reset link',
        lead: {
          mobile: 'Use Forgot password on the login page.',
          desktop:
            'On the login page, click Forgot password and enter the email tied to your account.',
        },
        steps: [
          'Open the login page and click Forgot password.',
          'Enter your account email and submit.',
          'Check inbox and spam for the reset email.',
          'Click the link within 30 minutes.',
        ],
      },
      {
        title: 'Choose a new password',
        lead: {
          mobile: 'Pick at least 10 characters with mixed case and numbers.',
          desktop:
            'Pick at least 10 characters with mixed case, numbers, and a symbol. Reusing your Minecraft or email password is discouraged.',
        },
        bullets: [
          'Confirm the password twice on the reset form.',
          'You will log in on all devices with the new password.',
          'Enable two-factor auth afterward if available.',
        ],
      },
      {
        title: 'Still locked out?',
        lead: {
          mobile: 'If the email never arrives, open a ticket with your username and signup date.',
          desktop:
            'If the email never arrives after five minutes, open a support ticket with your username and approximate signup date for manual verification.',
        },
        callout: {
          title: 'Security note',
          mobile: 'Staff will never ask for your password in chat or Discord.',
          desktop:
            'Staff and moderators will never ask for your password in chat, Discord, or email. Report impersonators immediately.',
        },
      },
    ],
    related: ['link-microsoft', 'two-factor-auth', 'delete-account'],
  },
  {
    slug: 'link-microsoft',
    lead: {
      mobile: 'Linking Microsoft merges your launcher identity with your website account.',
      desktop:
        'Linking Microsoft merges your launcher identity with your website account so purchases, bans, and progress stay on one profile.',
    },
    sections: [
      {
        title: 'Start the link flow',
        lead: {
          mobile: 'Dashboard → Settings → Linked accounts → Connect Microsoft.',
          desktop:
            'From Dashboard → Settings → Linked accounts, click Connect Microsoft and sign in with the account you use in Minecraft.',
        },
        steps: [
          'Open Linked accounts in dashboard settings.',
          'Click Connect Microsoft.',
          'Sign in to the Microsoft popup window.',
          'Confirm the success banner in the dashboard.',
        ],
      },
      {
        title: 'After linking',
        lead: {
          mobile: 'Your rank, coins, and tournament history follow the linked profile.',
          desktop:
            'Your rank, coin balance, and tournament history follow the linked profile across Java and Bedrock sessions.',
        },
        bullets: [
          'Unlinking requires a support ticket if you need to swap accounts.',
          'Only one Microsoft account can link at a time.',
          'Bedrock and Java share the same link entry.',
        ],
      },
      {
        title: 'Troubleshooting',
        lead: {
          mobile:
            'If the popup closes instantly, disable ad blockers and allow popups for our domain.',
          desktop:
            'If the Microsoft popup closes instantly, disable ad blockers, allow popups for our domain, and try an incognito window.',
        },
        callout: {
          title: 'Tip',
          mobile: 'Use the same Microsoft login you pick in the Minecraft launcher.',
          desktop:
            'Use the exact Microsoft login you select in the Minecraft launcher — mismatched accounts are the top linking failure we see.',
        },
      },
    ],
    related: ['reset-password', 'change-nickname', 'join'],
  },
  {
    slug: 'two-factor-auth',
    lead: {
      mobile: 'Two-factor authentication adds a six-digit code from an authenticator app on login.',
      desktop:
        'Two-factor authentication adds a six-digit TOTP code from an authenticator app whenever you log in or confirm sensitive shop actions.',
    },
    sections: [
      {
        title: 'Enable 2FA',
        lead: {
          mobile: 'Dashboard → Security → Enable two-factor authentication.',
          desktop:
            'Open Dashboard → Security, click Enable two-factor authentication, and scan the QR code with Google Authenticator, Authy, or 1Password.',
        },
        steps: [
          'Install an authenticator app on your phone.',
          'Scan the QR code shown in Security settings.',
          'Enter the six-digit code to confirm.',
          'Save the backup codes in a safe place.',
        ],
      },
      {
        title: 'When it is required',
        lead: {
          mobile:
            'High-value shop checkouts and rank gifts may prompt for 2FA even if you are already logged in.',
          desktop:
            'High-value shop checkouts, rank gifts, and account deletion requests may prompt for 2FA even if you are already logged in.',
        },
        bullets: [
          'Login always accepts TOTP after password entry.',
          'Backup codes work once each if you lose your phone.',
          'Disabling 2FA requires email confirmation.',
        ],
      },
      {
        title: 'Lost access',
        lead: {
          mobile: 'Open a ticket with ID verification if you lose both phone and backup codes.',
          desktop:
            'Open a support ticket with ID verification if you lose both your phone and backup codes. Recovery takes 24–48 hours.',
        },
        callout: {
          title: 'Heads up',
          mobile: 'Staff cannot read or reset your TOTP secret over chat.',
          desktop:
            'Staff cannot read or reset your TOTP secret over chat — the recovery flow exists to protect your purchases.',
        },
      },
    ],
    related: ['reset-password', 'delete-account', 'payment-methods'],
  },
  {
    slug: 'delete-account',
    lead: {
      mobile:
        'Account deletion is permanent after the grace period. Export anything you need first.',
      desktop:
        'Account deletion is permanent after the grace period. Export schematics, download invoices, and cancel active subscriptions before you confirm.',
    },
    sections: [
      {
        title: 'Request deletion',
        lead: {
          mobile: 'Dashboard → Settings → Delete account.',
          desktop:
            'Dashboard → Settings → Delete account. You must confirm with password and 2FA if enabled.',
        },
        steps: [
          'Read the deletion summary carefully.',
          'Confirm with your password.',
          'Enter 2FA if prompted.',
          'Check your email for the final confirmation link.',
        ],
      },
      {
        title: 'Grace period',
        lead: {
          mobile: 'You have 14 days to cancel by logging in and clicking Restore account.',
          desktop:
            'You have 14 days to cancel deletion by logging in and clicking Restore account on the banner shown at the top of the dashboard.',
        },
        bullets: [
          'Progress, claims, and ranks are removed after grace ends.',
          'Purchase history is anonymised, not deleted, for tax records.',
          'Active tournament registrations are cancelled immediately.',
        ],
      },
      {
        title: 'Before you go',
        lead: {
          mobile: 'Consider a nickname change or server break instead if you only need a pause.',
          desktop:
            'Consider a nickname change or a server break instead if you only need a pause — deletion cannot be reversed after day 14.',
        },
        callout: {
          title: 'Refunds',
          mobile: 'Deletion does not automatically refund unused ranks.',
          desktop:
            'Deletion does not automatically refund unused ranks. Request refunds separately before starting deletion if eligible.',
        },
      },
    ],
    related: ['reset-password', 'two-factor-auth', 'refund-policy'],
  },
  {
    slug: 'payment-methods',
    lead: {
      mobile: 'Checkout supports major cards and wallets in most regions where we operate.',
      desktop:
        'Checkout supports major cards and wallets in most regions where we operate. All payments route through our PCI-compliant processor.',
    },
    sections: [
      {
        title: 'Accepted methods',
        lead: {
          mobile: 'Pick any option shown at checkout for your country.',
          desktop:
            'Pick any option shown at checkout for your country — availability varies by region.',
        },
        bullets: [
          'Visa and Mastercard debit/credit cards.',
          'PayPal where supported.',
          'Apple Pay and Google Pay on mobile browsers.',
        ],
      },
      {
        title: 'Currency and taxes',
        lead: {
          mobile:
            'Prices display in USD by default; local currency conversion happens at checkout.',
          desktop:
            'Prices display in USD by default. Your bank or wallet converts to local currency and may add foreign transaction fees.',
        },
        bullets: [
          'VAT or sales tax appears before you pay where required.',
          'Invoices email automatically after successful purchase.',
          'Failed authorisations leave no charge on your statement.',
        ],
      },
      {
        title: 'Not accepted',
        lead: {
          mobile: 'We do not accept crypto, wire transfers, or third-party gift cards.',
          desktop:
            'We do not accept cryptocurrency, manual wire transfers, or third-party gift cards sold outside our official shop.',
        },
        callout: {
          title: 'Security',
          mobile: 'We never ask for card numbers in Discord or in-game chat.',
          desktop:
            'We never ask for card numbers in Discord or in-game chat. Checkout always happens on our HTTPS shop domain.',
        },
      },
    ],
    related: ['donations-privileges', 'payment-failed', 'refund-policy'],
  },
  {
    slug: 'donations-privileges',
    lead: {
      mobile: 'Shop purchases fund server hardware and support cosmetic/convenience perks.',
      desktop:
        'Shop purchases fund server hardware, moderation, and event prizes. Privileges are cosmetic and convenience perks — never combat pay-to-win.',
    },
    sections: [
      {
        title: 'What you can buy',
        lead: {
          mobile: 'Ranks, particle trails, chat colors, extra homes, and queue priority.',
          desktop:
            'Ranks, particle trails, chat colors, extra homes, and queue priority during peak hours. Every perk lists exactly what it includes before checkout.',
        },
        bullets: [
          'Cosmetics show to other players but do not change damage.',
          'Extra homes save time — they do not grant items.',
          'Queue priority skips login lines, not combat balance.',
        ],
      },
      {
        title: 'Activation',
        lead: {
          mobile: 'Privileges apply within seconds on all servers tied to your account.',
          desktop:
            'Privileges apply within seconds on all servers tied to your account. Relog if a cosmetic does not appear immediately.',
        },
        steps: [
          'Complete checkout on the shop page.',
          'Wait for the success screen and email receipt.',
          'Rejoin any server to sync permissions.',
        ],
      },
      {
        title: 'Fair play promise',
        lead: {
          mobile: 'We publish a perk diff any time a rank changes so players can audit balance.',
          desktop:
            'We publish a perk diff any time a rank changes so players can audit balance. Report pay-to-win concerns to staff — they are investigated within 24 hours.',
        },
        callout: {
          title: 'Tip',
          mobile: 'Compare rank cards side-by-side on the shop before buying.',
          desktop:
            'Compare rank cards side-by-side on the shop before buying — duration and renewal discounts are listed on each tile.',
        },
      },
    ],
    related: ['rank-benefits', 'payment-methods', 'gift-rank'],
  },
  {
    slug: 'refund-policy',
    lead: {
      mobile: 'Refunds are limited to unused privileges within 48 hours of purchase.',
      desktop:
        'Refunds are limited to unused privileges within 48 hours of purchase. Used cosmetics, consumed rank time, or gifted items are not eligible.',
    },
    sections: [
      {
        title: 'Eligible refunds',
        lead: {
          mobile: 'You can request a refund if the perk never activated in-game.',
          desktop:
            'You can request a refund if the perk never activated in-game or if you purchased the wrong server tier by mistake within 48 hours.',
        },
        bullets: [
          'Include your order ID from Dashboard → History.',
          'Explain whether the perk appeared in-game.',
          'Refunds return to the original payment method.',
        ],
      },
      {
        title: 'Not eligible',
        lead: {
          mobile: 'Partially used rank time, opened loot boxes, and gifted purchases are final.',
          desktop:
            'Partially used rank time, opened loot boxes, and gifted purchases are final unless the recipient never claimed the gift.',
        },
        bullets: [
          'Chargebacks may result in a permanent shop ban.',
          'Promotional bonus items are non-refundable.',
          'Taxes are refunded only where legally required.',
        ],
      },
      {
        title: 'Submit a request',
        lead: {
          mobile: 'Dashboard → History → Request refund on the order row.',
          desktop:
            'Dashboard → History → Request refund on the order row, or open a support ticket if the button is greyed out.',
        },
        steps: [
          'Locate the order in History.',
          'Click Request refund and select a reason.',
          'Wait for email confirmation — usually within one business day.',
        ],
      },
    ],
    related: ['payment-failed', 'payment-methods', 'delete-account'],
  },
  {
    slug: 'payment-failed',
    lead: {
      mobile:
        'Failed payments usually mean a bank block, wrong billing zip, or temporary processor outage.',
      desktop:
        'Failed payments usually mean a bank block, wrong billing zip, or temporary processor outage. No privilege is granted until checkout succeeds.',
    },
    sections: [
      {
        title: 'Quick fixes',
        lead: {
          mobile: 'Try these before opening a ticket.',
          desktop: 'Try these before opening a ticket — they resolve most checkout errors.',
        },
        steps: [
          'Verify your card allows online game purchases.',
          'Match billing zip to your bank records.',
          'Try PayPal or another wallet if cards fail.',
          'Wait 15 minutes and retry once.',
        ],
      },
      {
        title: 'Double charges',
        lead: {
          mobile: 'If you clicked pay twice, pending authorisations drop within an hour.',
          desktop:
            'If you double-clicked pay, pending authorisations usually drop within an hour. Only one completed order creates a rank.',
        },
        bullets: [
          'Check History before paying again.',
          'Send order IDs if two charges post.',
          'We void duplicate pending charges automatically when detected.',
        ],
      },
      {
        title: 'Contact support',
        lead: {
          mobile: 'Open a ticket with the error code shown on the red checkout banner.',
          desktop:
            'Open a ticket with the error code shown on the red checkout banner and a screenshot of History if money left your account without delivery.',
        },
        callout: {
          title: 'Heads up',
          mobile: 'Never buy ranks through players offering "cheaper PayPal" — those are scams.',
          desktop:
            'Never buy ranks through players offering cheaper PayPal or crypto — those are scams and will not be restored by staff.',
        },
      },
    ],
    related: ['payment-methods', 'refund-policy', 'rank-benefits'],
  },
  {
    slug: 'server-differences',
    lead: {
      mobile: 'Three servers, three playstyles — same account, different rulesets.',
      desktop:
        'We run three parallel servers tuned for different playstyles. One account works everywhere, but inventories and worlds stay separate.',
    },
    sections: [
      {
        title: 'LuckySurvival',
        lead: {
          mobile: 'Default recommendation for new players.',
          desktop:
            'Our default recommendation for new players — vanilla survival with fair PvP, balanced economy, and TNT disabled.',
        },
        bullets: [
          'Claims and shop quests enabled.',
          'PvP only outside spawn and untrusted zones.',
          'Weekly economy events with coin prizes.',
        ],
      },
      {
        title: 'MineWars',
        lead: {
          mobile: 'Competitive PvP with TNT enabled and ranked tournaments.',
          desktop:
            'Competitive PvP with TNT enabled, ranked tournaments, and larger clan wars on weekends.',
        },
        bullets: [
          'Explosion damage ON in unclaimed wilderness.',
          'Separate ELO tracker from LuckySurvival.',
          'Hardcore-style weekend events announced on Discord.',
        ],
      },
      {
        title: 'CalmSky',
        lead: {
          mobile: 'Peaceful building — no PvP, no TNT, larger plot limits.',
          desktop:
            'Peaceful building focused — no PvP, no TNT, larger plot limits, and creative-adjacent events.',
        },
        callout: {
          title: 'Tip',
          mobile: 'You can hop between servers anytime — copy the new IP from the dashboard.',
          desktop:
            'You can hop between servers anytime by copying the new IP from the dashboard. Inventories do not transfer between worlds.',
        },
      },
    ],
    related: ['join', 'switch-servers', 'server-status'],
  },
  {
    slug: 'switch-servers',
    lead: {
      mobile: 'One login covers every server. Each world keeps its own inventory and claims.',
      desktop:
        'One website login covers all three of our servers. Each world keeps its own inventory, claims, and economy balance.',
    },
    sections: [
      {
        title: 'How to switch',
        lead: {
          mobile: 'Copy the new IP from Dashboard → Servers and add it in Minecraft multiplayer.',
          desktop:
            'Copy the new IP from Dashboard → Servers and add it in Minecraft multiplayer — or select it if you already saved the address.',
        },
        steps: [
          'Log out of your current server world.',
          'Open Dashboard → Servers on the website.',
          'Copy the IP for the destination server.',
          'Join from your Minecraft server list.',
        ],
      },
      {
        title: 'What transfers',
        lead: {
          mobile: 'Ranks, dashboard settings, and tournament registrations follow your account.',
          desktop:
            'Purchased ranks, dashboard settings, and tournament registrations follow your account. World-specific items and claims do not.',
        },
        bullets: [
          'Shop cosmetics sync on login.',
          'Discord roles update within five minutes.',
          'Ban status applies across all servers.',
        ],
      },
      {
        title: 'What stays behind',
        lead: {
          mobile: 'Chests, builds, and in-world coin purses remain on the server you leave.',
          desktop:
            'Chests, builds, and in-world coin purses remain on the server you leave. Plan accordingly before moving permanently.',
        },
        callout: {
          title: 'Tip',
          mobile:
            'Use /mail on supported servers to send items between your own characters via escrow.',
          desktop:
            'On supported servers, use /mail to send items between your own characters through the escrow system before you migrate.',
        },
      },
    ],
    related: ['server-differences', 'dashboard-guide', 'join'],
  },
  {
    slug: 'world-resets',
    lead: {
      mobile: 'Main survival worlds persist. Seasonal maps rotate on a schedule.',
      desktop:
        'Main survival worlds persist indefinitely. Seasonal maps and tournament arenas rotate on a published schedule.',
    },
    sections: [
      {
        title: 'Persistent worlds',
        lead: {
          mobile: 'LuckySurvival, MineWars, and CalmSky cores do not wipe on a calendar.',
          desktop:
            'LuckySurvival, MineWars, and CalmSky core maps do not wipe on a calendar. Your builds stay unless staff announce a migration.',
        },
        bullets: [
          'Claim snapshots backup nightly.',
          'Major updates may require chunk regeneration in unclaimed areas only.',
          'Migration notices post 30 days in advance when needed.',
        ],
      },
      {
        title: 'Seasonal resets',
        lead: {
          mobile: 'Event worlds and some tournament maps reset every season — roughly quarterly.',
          desktop:
            'Event worlds and some tournament maps reset every season — roughly quarterly — with export tools offered beforehand.',
        },
        bullets: [
          'Export schematics before the published cutoff date.',
          'Season trophies stay on your dashboard profile.',
          'Season summaries archive to the website after reset.',
        ],
      },
      {
        title: 'Notifications',
        lead: {
          mobile:
            'Subscribe to email alerts on Dashboard → Servers for maintenance and reset windows.',
          desktop:
            'Subscribe to email alerts on Dashboard → Servers for maintenance and reset windows. Discord #announcements mirrors the same schedule.',
        },
        callout: {
          title: 'Heads up',
          mobile: 'Unread mail and auction listings must be collected before seasonal wipes.',
          desktop:
            'Unread mail and auction listings must be collected before seasonal wipes — escrow returns items to sellers automatically afterward.',
        },
      },
    ],
    related: ['download-world', 'tournaments', 'server-status'],
  },
  {
    slug: 'download-world',
    lead: {
      mobile: 'Claim owners can export builds as schematics once per season.',
      desktop:
        'Claim owners can export builds as schematics once per season for personal backup — not for republishing on competing networks.',
    },
    sections: [
      {
        title: 'Request an export',
        lead: {
          mobile: 'Dashboard → Servers → select world → Export schematic.',
          desktop:
            'Dashboard → Servers → select world → Export schematic. Choose the claim you own or co-own.',
        },
        steps: [
          'Verify you are owner or trusted on the claim.',
          'Click Export schematic and confirm the region.',
          'Wait for the email with a download link.',
          'Links expire after 72 hours.',
        ],
      },
      {
        title: 'Limits',
        lead: {
          mobile: 'One export per claim per season; max volume 256×256×256 blocks.',
          desktop:
            'One export per claim per season; max volume 256×256×256 blocks. Larger bases require staff assistance.',
        },
        bullets: [
          'Exports exclude chest contents for economy safety.',
          'Entities and item frames may simplify on import elsewhere.',
          'Commercial resale of exports violates terms of service.',
        ],
      },
      {
        title: 'Using the file',
        lead: {
          mobile: 'Import with WorldEdit or Litematica on your own single-player world.',
          desktop:
            'Import with WorldEdit or Litematica on your own single-player world. We do not provide support for third-party editors.',
        },
        callout: {
          title: 'Tip',
          mobile: 'Take screenshots before seasonal resets even if you plan to export.',
          desktop:
            'Take screenshots before seasonal resets even if you plan to export — renders help if schematic conversion drops decorative blocks.',
        },
      },
    ],
    related: ['claims-protection', 'world-resets', 'dashboard-guide'],
  },
  {
    slug: 'server-status',
    lead: {
      mobile: 'Check live status before you troubleshoot your own connection.',
      desktop:
        'Check live status before you troubleshoot your own connection — scheduled maintenance shows here first.',
    },
    sections: [
      {
        title: 'Dashboard status',
        lead: {
          mobile: 'Green = online, yellow = degraded, red = offline or maintenance.',
          desktop:
            'Dashboard → Servers shows green for online, yellow for degraded performance, red for offline or maintenance.',
        },
        bullets: [
          'Hover a dot for the last heartbeat timestamp.',
          'Click a server row for patch notes and player count.',
          'Subscribe to email alerts with the bell icon.',
        ],
      },
      {
        title: 'Discord announcements',
        lead: {
          mobile: '#announcements posts maintenance windows and unexpected outages.',
          desktop:
            'Discord #announcements posts maintenance windows, unexpected outages, and estimated recovery times.',
        },
        bullets: [
          'Enable @announcement ping role for critical alerts.',
          'Status embeds update automatically every minute.',
          'Comment threads are disabled during active incidents.',
        ],
      },
      {
        title: 'When it is just you',
        lead: {
          mobile: 'If status shows online but you cannot join, see the connection lost article.',
          desktop:
            'If status shows online but you cannot join, the issue is likely local — see the connection lost article for firewall and VPN steps.',
        },
        callout: {
          title: 'Tip',
          mobile: 'Try another server in the list to confirm your client works.',
          desktop:
            'Try another server in the list to confirm your client works before reinstalling Minecraft.',
        },
      },
    ],
    related: ['connection-lost', 'switch-servers', 'join'],
  },
  {
    slug: 'rank-benefits',
    lead: {
      mobile: 'VIP ranks bundle cosmetics and convenience — never raw combat stats.',
      desktop:
        'VIP ranks bundle cosmetics and convenience perks. We publish the full perk list on each shop tile so you can audit balance before buying.',
    },
    sections: [
      {
        title: 'Common perks',
        lead: {
          mobile: 'Exact perks vary by tier — compare cards on the shop page.',
          desktop:
            'Exact perks vary by tier — compare cards on the shop page. All tiers share the fair-play rules below.',
        },
        bullets: [
          'Extra /home slots and /back cooldown reduction.',
          'Chat prefix colors and join/leave messages.',
          'Particle trails and emote animations.',
          'Priority login queue during peak hours.',
        ],
      },
      {
        title: 'Never included',
        lead: {
          mobile: 'Ranks do not sell weapons, armor, spawners, or unbalanced kits.',
          desktop:
            'Ranks do not sell weapons, armor, spawners, or unbalanced kits. Any perk that touched combat was removed in the 2025 balance pass.',
        },
        bullets: [
          'No pay-to-win crate keys on survival servers.',
          'No protected cheating or x-ray disguised as perks.',
          'No exclusive mob drops tied to rank alone.',
        ],
      },
      {
        title: 'Try before you buy',
        lead: {
          mobile: 'Ask in Discord #vip-showcase — players demo trails and chat styles live.',
          desktop:
            'Ask in Discord #vip-showcase — players demo trails and chat styles live every Saturday.',
        },
        callout: {
          title: 'Tip',
          mobile: 'Lower tiers upgrade pro-rata within seven days of purchase.',
          desktop:
            'Lower tiers upgrade pro-rata within seven days of purchase — contact support with your order ID if the upgrade button fails.',
        },
      },
    ],
    related: ['donations-privileges', 'rank-duration', 'gift-rank'],
  },
  {
    slug: 'rank-duration',
    lead: {
      mobile: 'Most ranks run 30 or 90 days. Lifetime tiers exist for long-term supporters.',
      desktop:
        'Most ranks run 30 or 90 days from activation. Lifetime tiers exist for long-term supporters and show a one-time purchase price.',
    },
    sections: [
      {
        title: 'Checking expiry',
        lead: {
          mobile: 'Dashboard → History lists active privileges and renewal dates.',
          desktop:
            'Dashboard → History lists active privileges, renewal dates, and a countdown badge on the profile header.',
        },
        bullets: [
          'Email reminders send seven days before expiry.',
          'Expired ranks remove cosmetics on next login.',
          'Lifetime tiers show "Permanent" in History.',
        ],
      },
      {
        title: 'Renewals',
        lead: {
          mobile: 'Enable auto-renew at checkout or renew manually from History.',
          desktop:
            'Enable auto-renew at checkout or renew manually from History. Auto-renew uses the same payment method as the original order.',
        },
        steps: [
          'Open History and locate the rank row.',
          'Click Renew or Manage auto-renew.',
          'Confirm payment — perks extend immediately.',
        ],
      },
      {
        title: 'Lapsed ranks',
        lead: {
          mobile: 'You keep season trophies but lose active cosmetics when time runs out.',
          desktop:
            'You keep season trophies and forum badges but lose active cosmetics and queue priority when time runs out.',
        },
        callout: {
          title: 'Tip',
          mobile: 'Grace period: 48 hours after expiry with reduced perks before full removal.',
          desktop:
            'There is a 48-hour grace period after expiry with reduced perks before full removal — renew during grace to avoid re-equipping cosmetics.',
        },
      },
    ],
    related: ['rank-benefits', 'gift-rank', 'refund-policy'],
  },
  {
    slug: 'gift-rank',
    lead: {
      mobile: 'Gift checkout delivers a rank to another username instantly after payment.',
      desktop:
        'Gift checkout delivers a rank to another username instantly after payment. The recipient gets an in-game notification and email if their address is public.',
    },
    sections: [
      {
        title: 'Send a gift',
        lead: {
          mobile: 'Select Gift on the shop tile and type the exact in-game username.',
          desktop:
            'Select Gift on the shop tile, type the exact in-game username, and add an optional message shown in the notification.',
        },
        steps: [
          'Pick the rank tier and duration.',
          'Toggle Gift and enter recipient username.',
          'Complete checkout with your payment method.',
          'Recipient syncs on next login or immediately if online.',
        ],
      },
      {
        title: 'Rules',
        lead: {
          mobile:
            'Gifts are non-refundable once claimed unless purchased in error within one hour.',
          desktop:
            'Gifts are non-refundable once claimed unless purchased in error within one hour and the recipient agrees to transfer back via ticket.',
        },
        bullets: [
          'Double-check spelling — staff cannot move ranks between wrong names.',
          'You cannot gift to yourself.',
          'Banned recipients still receive the gift but cannot use it until unbanned.',
        ],
      },
      {
        title: 'Surprise packages',
        lead: {
          mobile: 'Schedule delivery for a future date at checkout during holiday events.',
          desktop:
            'During holiday events you can schedule delivery for a future date at checkout — useful for birthdays and clan rewards.',
        },
        callout: {
          title: 'Tip',
          mobile: 'Clan leaders bulk-gift through support invoices for 10+ ranks.',
          desktop:
            'Clan leaders bulk-gift through support invoices for ten or more ranks — open a ticket for a quote and single payment link.',
        },
      },
    ],
    related: ['rank-benefits', 'donations-privileges', 'payment-methods'],
  },
  {
    slug: 'claims-protection',
    lead: {
      mobile: 'Claims protect blocks you place from other players. Trust friends explicitly.',
      desktop:
        'Claims protect blocks you place from other players. Trust friends explicitly — being friends in Discord does not auto-trust in-game.',
    },
    sections: [
      {
        title: 'Create a claim',
        lead: {
          mobile: 'Craft a golden shovel and right-click two opposite corners.',
          desktop:
            'Craft a golden shovel and right-click two opposite corners of the area you want to protect. Particles outline the border for you.',
        },
        steps: [
          'Stand at one corner and right-click with the shovel.',
          'Move to the opposite corner and right-click again.',
          'Check particles to confirm the boundary.',
          'Use /claim info to see size and remaining blocks.',
        ],
      },
      {
        title: 'Trust and permissions',
        lead: {
          mobile: '/trust <player> grants build access inside your claim.',
          desktop:
            '/trust <player> grants build access inside your claim. /untrust removes it instantly.',
        },
        bullets: [
          '/trustlist shows who can edit your land.',
          'Containers can be locked separately with /containertrust.',
          'Untrusted players cannot open doors or use buttons.',
        ],
      },
      {
        title: 'Grief reports',
        lead: {
          mobile:
            'If damage happens outside claims, staff roll back using logs when you report quickly.',
          desktop:
            'If damage happens outside claims, staff roll back using block logs when you report within 48 hours with coordinates.',
        },
        callout: {
          title: 'Tip',
          mobile: 'Claim your base before logging off the first night.',
          desktop:
            'Claim your base before logging off the first night — wilderness is not protected until you place a claim.',
        },
      },
    ],
    related: ['first-day-checklist', 'report-player', 'download-world'],
  },
  {
    slug: 'economy-basics',
    lead: {
      mobile: 'Coins are the server currency — earn from quests, trade, and events.',
      desktop:
        'Coins are the server currency. Earn them from quests, player trade, and events; spend at NPC shops and player chest markets.',
    },
    sections: [
      {
        title: 'Earning coins',
        lead: {
          mobile: 'Daily quests, /shop deliveries, and auction sales are the main sources.',
          desktop:
            'Daily quests, /shop deliveries, auction house sales, and tournament placements are the main coin sources for new players.',
        },
        bullets: [
          'Quest streaks bonus coins after day three.',
          'Player shops tax 2% on sales above 10,000 coins.',
          'AFK farms violating rules may be nerfed without notice.',
        ],
      },
      {
        title: 'Spending coins',
        lead: {
          mobile: 'NPC shops sell gear, claim blocks, and event tickets.',
          desktop:
            'NPC shops sell gear, claim blocks, and event tickets. Player chest shops set their own prices — compare before you buy.',
        },
        bullets: [
          '/balance shows your purse.',
          '/pay <player> <amount> sends coins directly.',
          'Coins do not transfer between servers.',
        ],
      },
      {
        title: 'Inflation controls',
        lead: {
          mobile: 'Staff adjust quest payouts seasonally based on economy dashboards.',
          desktop:
            'Staff adjust quest payouts seasonally based on economy dashboards published in Dev Blog posts.',
        },
        callout: {
          title: 'Tip',
          mobile: 'Bank excess coins in claim chests — death drops do not take banked items.',
          desktop:
            'Bank excess coins in claim chests or the NPC bank — death drops do not remove coins stored through /bank deposit.',
        },
      },
    ],
    related: ['first-day-checklist', 'tournaments', 'donations-privileges'],
  },
  {
    slug: 'tournaments',
    lead: {
      mobile: 'Weekly brackets run Friday through Sunday UTC with coin and cosmetic prizes.',
      desktop:
        'Weekly brackets run Friday 18:00 UTC through Sunday 23:59 UTC with coin pools, trophies, and exclusive cosmetics for top finishers.',
    },
    sections: [
      {
        title: 'Register',
        lead: {
          mobile: 'Dashboard → Tournaments or /tournament in-game during an open window.',
          desktop:
            'Register from Dashboard → Tournaments or type /tournament in-game while registration is open.',
        },
        steps: [
          'Confirm you meet the playtime requirement listed on the bracket.',
          'Click Register and pick your kit loadout if required.',
          'Check Discord #tournaments for seed times.',
          'Show up 10 minutes early for check-in.',
        ],
      },
      {
        title: 'Bracket rules',
        lead: {
          mobile: 'Single elimination by default; finals may be best-of-three.',
          desktop:
            'Single elimination by default; finals may be best-of-three. Match rules and banned items list publish with each season.',
        },
        bullets: [
          'No alt accounts to sandbag lower brackets.',
          'Disconnects: 5-minute rematch window if screenshot proof provided.',
          'Staff rulings are final during the event.',
        ],
      },
      {
        title: 'Rewards',
        lead: {
          mobile: 'Top eight receive coins; top three receive trophy items and dashboard badges.',
          desktop:
            'Top eight receive coin payouts; top three receive trophy items, dashboard badges, and sometimes exclusive skins.',
        },
        callout: {
          title: 'Tip',
          mobile: 'Practice kits on the PvP test shard linked from the bracket page.',
          desktop:
            'Practice kits on the PvP test shard linked from the bracket page — stats there do not affect seeding.',
        },
      },
    ],
    related: ['dashboard-guide', 'report-player', 'rank-benefits'],
  },
  {
    slug: 'report-player',
    lead: {
      mobile: 'Reports help staff act on harassment, cheating, and scam attempts.',
      desktop:
        'Reports help staff act on harassment, cheating, and scam attempts. False reports may result in mutes — use them in good faith.',
    },
    sections: [
      {
        title: 'In-game report',
        lead: {
          mobile: '/report <username> <reason> sends logs to moderators automatically.',
          desktop:
            '/report <username> <reason> sends chat and combat logs to moderators automatically with your current location attached.',
        },
        steps: [
          'Type /report followed by the username.',
          'Pick a category if the menu appears.',
          'Add one sentence of context.',
          'Avoid spamming duplicate reports.',
        ],
      },
      {
        title: 'Ticket with evidence',
        lead: {
          mobile: 'For scams or complex grief, open a dashboard ticket with screenshots.',
          desktop:
            'For scams or complex grief, open a dashboard ticket with screenshots, timestamps, and coordinates when possible.',
        },
        bullets: [
          'Upload images under 10 MB each.',
          'Include date and server name in the subject.',
          'Do not post evidence publicly — it can tip off offenders.',
        ],
      },
      {
        title: 'Response times',
        lead: {
          mobile: 'Most reports receive a first response within 24 hours.',
          desktop:
            'Most reports receive a first response within 24 hours. Urgent cheating reports during tournaments are prioritized.',
        },
        callout: {
          title: 'Privacy',
          mobile: 'Reporter identity is not shared with the accused player.',
          desktop:
            'Reporter identity is not shared with the accused player unless you opt in for a mediation session.',
        },
      },
    ],
    related: ['server-rules', 'ban-appeal', 'claims-protection'],
  },
  {
    slug: 'connection-lost',
    lead: {
      mobile:
        'Connection lost usually means network filtering, VPN issues, or version mismatch — not a ban.',
      desktop:
        'Connection lost usually means network filtering, VPN issues, or version mismatch — not a ban. Check status page before reinstalling.',
    },
    sections: [
      {
        title: 'Client and version',
        lead: {
          mobile: 'Confirm Java 1.20.4 or latest Bedrock before anything else.',
          desktop:
            'Confirm Java 1.20.4 or latest Bedrock before anything else. Mismatched versions fail within seconds of joining.',
        },
        bullets: [
          'Update Minecraft through the official launcher.',
          'Remove duplicate server entries with typos.',
          'Disable experimental packs that rewrite networking.',
        ],
      },
      {
        title: 'Network fixes',
        lead: {
          mobile: 'Allow Minecraft through Windows Firewall or router filtering.',
          desktop:
            'Allow Minecraft through Windows Firewall, macOS security, or router filtering. Java uses port 25565 by default.',
        },
        steps: [
          'Disable VPN or try a different server region.',
          'Switch from Wi-Fi to Ethernet if possible.',
          'Restart router if other games also drop.',
        ],
      },
      {
        title: 'Still failing',
        lead: {
          mobile: 'Run ping test to the IP from Dashboard → Servers → Diagnostics.',
          desktop:
            'Run the ping test to the IP from Dashboard → Servers → Diagnostics and attach results to a support ticket.',
        },
      },
    ],
    related: ['supported-versions', 'resource-pack-issues', 'server-status'],
  },
  {
    slug: 'resource-pack-issues',
    lead: {
      mobile: 'Our pack downloads automatically on first join — about 80 MB.',
      desktop:
        'Our pack downloads automatically on first join — about 80 MB. It removes itself when you disconnect from our servers.',
    },
    sections: [
      {
        title: 'Normal first join',
        lead: {
          mobile: 'Expect 20–40 seconds on a typical broadband connection.',
          desktop:
            'Expect 20–40 seconds on a typical broadband connection. Do not cancel — partial downloads cause repeat prompts.',
        },
        steps: [
          'Click the server and wait on "Downloading resource pack".',
          'Let the bar reach 100% once.',
          'Subsequent joins skip the full download.',
        ],
      },
      {
        title: 'Stuck at 0%',
        lead: {
          mobile:
            'Cancel, restart Minecraft, and rejoin. If still stuck, run /resourcepack reload after spawn.',
          desktop:
            'Cancel, restart Minecraft, and rejoin. If still stuck, run /resourcepack reload in chat after you spawn.',
        },
        bullets: [
          'Disable VPN — some block CDN hosts.',
          'Free disk space must exceed 200 MB.',
          'Bedrock: ensure storage permission is granted.',
        ],
      },
      {
        title: 'Manual override',
        lead: {
          mobile:
            'If automatic delivery fails twice, support can link a direct download for manual install.',
          desktop:
            'If automatic delivery fails twice, support can link a direct download for manual install — open a ticket with your client edition.',
        },
        callout: {
          title: 'Heads up',
          mobile: 'Third-party x-ray packs are banned and may trigger kicks.',
          desktop:
            'Third-party x-ray or low-fire PvP packs are banned and may trigger automatic kicks even on otherwise allowed clients.',
        },
      },
    ],
    related: ['connection-lost', 'lag-performance', 'join'],
  },
  {
    slug: 'lag-performance',
    lead: {
      mobile:
        'Lag can be client-side (FPS) or server-side (TPS). Diagnose which before you tweak settings.',
      desktop:
        'Lag can be client-side (FPS) or server-side (TPS). Diagnose which before you tweak settings — the fixes differ completely.',
    },
    sections: [
      {
        title: 'Client FPS',
        lead: {
          mobile: 'Lower render distance, disable shaders, and close background apps.',
          desktop:
            'Lower render distance to 12 chunks, disable heavy shaders, and close browser tabs eating RAM.',
        },
        bullets: [
          'Set graphics to Fast on older laptops.',
          'Turn off smooth lighting temporarily.',
          'Use sodium/optifine only if allowed for your edition.',
        ],
      },
      {
        title: 'Server TPS',
        lead: {
          mobile: 'If everyone lags at once, check Discord #announcements for TPS dips.',
          desktop:
            'If everyone lags at once, check Discord #announcements for TPS dips tied to redstone farms or events.',
        },
        bullets: [
          'Huge mob cram farms may be throttled by staff.',
          'Avoid loading thousands of item entities at once.',
          'Report recurring spikes with timestamps.',
        ],
      },
      {
        title: 'Network lag',
        lead: {
          mobile: 'High ping shows as delayed block breaking and chat.',
          desktop:
            'High ping shows as delayed block breaking and chat. Pick the server geographically closest if we offer regional proxies.',
        },
        callout: {
          title: 'Tip',
          mobile: 'Press F3 to view FPS and ping in Java edition.',
          desktop:
            'Press F3 to view FPS and ping in Java edition — screenshot it when opening performance tickets.',
        },
      },
    ],
    related: ['connection-lost', 'resource-pack-issues', 'server-status'],
  },
  {
    slug: 'server-rules',
    lead: {
      mobile: 'Rules keep our servers playable for builders, traders, and PvP players alike.',
      desktop:
        'Rules keep our servers playable for builders, traders, and PvP players alike. Ignorance is not an excuse — this summary covers the essentials.',
    },
    sections: [
      {
        title: 'Core rules',
        lead: {
          mobile: 'Breaking these may result in immediate bans.',
          desktop:
            'Breaking these may result in immediate bans without warning depending on severity.',
        },
        bullets: [
          'No hacked clients, x-ray, or automation macros.',
          'No harassment, hate speech, or doxing.',
          'No real-money trading of in-game items.',
          'No impersonating staff or submitting false reports.',
        ],
      },
      {
        title: 'Server-specific notes',
        lead: {
          mobile: 'MineWars allows TNT in wilderness; CalmSky forbids all PvP.',
          desktop:
            'MineWars allows TNT in unclaimed wilderness; CalmSky forbids all PvP. LuckySurvival sits in the middle — read signs at spawn.',
        },
        bullets: [
          'Claims must not trap players in nether portals.',
          'Advertising other servers is muted on first offense.',
          'English is required in global chat for moderation coverage.',
        ],
      },
      {
        title: 'Full policy',
        lead: {
          mobile: 'Complete legal text lives at /terms and /privacy-policy on the website.',
          desktop:
            'Complete legal text lives at /terms and /privacy-policy on the website. Major rule changes announce 7 days before enforcement.',
        },
        callout: {
          title: 'Tip',
          mobile: 'When in doubt, ask a moderator before pushing boundaries.',
          desktop:
            'When in doubt, ask a moderator before pushing boundaries — screenshots of staff answers can be attached to appeals.',
        },
      },
    ],
    related: ['ban-appeal', 'report-player', 'claims-protection'],
  },
  {
    slug: 'ban-appeal',
    lead: {
      mobile:
        'Appeals review punishments for mistakes or outdated context — not to retry the same behavior.',
      desktop:
        'Appeals review punishments for mistakes or outdated context — not to retry the same behavior. One appeal per case ID.',
    },
    sections: [
      {
        title: 'Submit an appeal',
        lead: {
          mobile: 'Dashboard → Support → Appeal and enter your case ID from the ban message.',
          desktop:
            'Dashboard → Support → Appeal and enter your case ID from the ban message or email notification.',
        },
        steps: [
          'Copy the case ID exactly.',
          'Explain what happened in your own words.',
          'Acknowledge the rule you broke if applicable.',
          'Wait up to 72 hours for a response.',
        ],
      },
      {
        title: 'What helps',
        lead: {
          mobile: 'Honest appeals with context get answered faster than copy-paste denials.',
          desktop:
            'Honest appeals with context get answered faster than copy-paste denials. Include proof if you believe the ban was wrong.',
        },
        bullets: [
          'First-time offenses often reduce to temp mutes on appeal.',
          'Repeat offenders within 90 days are usually denied.',
          'Chargeback-related bans require payment resolution first.',
        ],
      },
      {
        title: 'If denied',
        lead: {
          mobile: 'Decisions after a full review are final for that case ID.',
          desktop:
            'Decisions after a full review are final for that case ID. Wait until the listed expiry date for automatic unban when applicable.',
        },
        callout: {
          title: 'Heads up',
          mobile: 'Harassing staff about appeals can extend the ban.',
          desktop:
            'Harassing staff about appeals in Discord or alt accounts can extend the ban under the evasion rule.',
        },
      },
    ],
    related: ['server-rules', 'report-player', 'delete-account'],
  },
];

const SIMPLE_CONTENT = Object.fromEntries(
  SIMPLE_ARTICLES.map(article => [article.slug, buildSimpleArticle(article)])
) as Record<string, FaqArticleFullContent>;

const FAQ_ARTICLE_CONTENT: Record<string, FaqArticleFullContent> = {
  join: JOIN_CONTENT,
  ...SIMPLE_CONTENT,
};

export function getFaqArticleContent(slug: string): FaqArticleFullContent | undefined {
  return FAQ_ARTICLE_CONTENT[slug];
}
