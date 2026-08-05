export type FaqArticleContentBlock = {
  mobile: string;
  desktop: string;
};

export type FaqArticleListBlock = {
  mobile: readonly string[];
  desktop: readonly string[];
};

export const JOIN_LEAD: FaqArticleContentBlock = {
  mobile:
    'Joining one of our Minecraft servers takes about two minutes once you have Minecraft installed. This guide walks through every step.',
  desktop:
    'Joining one of our Minecraft servers takes about two minutes once you have Minecraft installed. This guide walks through every step, from sign-up to your first connection — plus what to do if something does not work.',
};

export const JOIN_BEFORE: {
  lead: FaqArticleContentBlock;
  bullets: FaqArticleListBlock;
  callout: FaqArticleContentBlock;
} = {
  lead: {
    mobile: 'Make sure you have these ready before you begin.',
    desktop:
      'Make sure you have the following ready before you begin. If anything is missing, links below take you to the right place.',
  },
  bullets: {
    mobile: [
      'Legal copy of Minecraft (Java 1.20.4 or latest Bedrock).',
      'Valid email address you can access now.',
      'A nickname for other players to see.',
      'Stable internet connection.',
    ],
    desktop: [
      'A legal copy of Minecraft (Java 1.20.4 or the latest Bedrock release).',
      'A valid email address you can access right now (for verification).',
      'A nickname you want other players to see — can be different from your Microsoft handle.',
      'A stable internet connection (any modern broadband works).',
    ],
  },
  callout: {
    mobile:
      'Both Java and Bedrock work. Java has a few extra cosmetics, but every core feature works on both.',
    desktop:
      'Both Java and Bedrock editions work on our servers. Java supports a few more cosmetic plugins, but every core feature — economy, claims, tournaments — works identically on both.',
  },
};

export const JOIN_CREATE_ACCOUNT = {
  lead: {
    mobile: 'Sign up with email and password. About 30 seconds total.',
    desktop:
      'Sign up on our website with email and password. The whole step takes about 30 seconds. Your in-game progress, purchases, and friends list are all tied to this account.',
  },
  steps: {
    mobile: [
      'Open Sign Up, enter email + password.',
      'Click "Create account" — we send a verification link.',
      'Open the email and click the link.',
      'Set an in-game nickname.',
    ],
    desktop: [
      'Open the Sign Up page and enter your email + password.',
      'Click "Create account". We will send a verification link.',
      'Open the email (check the spam folder if it does not arrive in 2 minutes) and click the link.',
      'You will land on the dashboard. Pick an in-game nickname when prompted.',
    ],
  },
  caption: 'Caption: The sign-up form — minimum fields, easy validation.',
};

export const JOIN_CHOOSE_SERVER = {
  lead: {
    mobile: 'Three servers, each tuned for a different playstyle. Switch any time.',
    desktop:
      'We run three servers in parallel, each tuned for a different playstyle. Pick the one that fits how you like to play — you can always switch later.',
  },
  bullets: {
    mobile: [
      'LuckySurvival — fair PvP, balanced economy, TNT off.',
      'MineWars — competitive PvP, TNT on, tournaments.',
      'CalmSky — peaceful building, no PvP, no TNT.',
    ],
    desktop: [
      'LuckySurvival — vanilla survival with fair PvP, balanced economy, and TNT disabled.',
      'MineWars — vanilla survival with PvP and TNT enabled, ranked matches and tournaments.',
      'CalmSky — peaceful vanilla server without PvP or TNT, focused on building and community.',
    ],
  },
  callout: {
    mobile: 'New players land on LuckySurvival by default. Start there if unsure.',
    desktop:
      'New players land on LuckySurvival by default. If you are not sure, start there — it is the safest place to learn the basics.',
  },
};

export const JOIN_ADD_SERVER = {
  title: {
    mobile: '3. Add the server',
    desktop: '3. Add the server in Minecraft',
  },
  lead: {
    mobile: 'Copy the IP from your dashboard and add it as a multiplayer server in Minecraft.',
    desktop:
      'Each server has a unique IP address. Copy it from the server card in your dashboard, then add it as a multiplayer server in Minecraft.',
  },
  steps: {
    mobile: [
      'Click "Copy IP" on the server card.',
      'Minecraft → Multiplayer.',
      'Click "Add Server".',
      'Paste the IP. Add any name.',
      'Click "Done".',
    ],
    desktop: [
      'On the Servers page, click the "Copy IP" button on the server card you picked.',
      'Open Minecraft and choose "Multiplayer" from the main menu.',
      'Click "Add Server" at the bottom of the screen.',
      'Paste the IP into the "Server Address" field. Add any name you like.',
      'Click "Done". The server appears in your list.',
    ],
  },
};

export const JOIN_CONNECT = {
  lead: {
    mobile:
      'First connection downloads an ~80 MB resource pack (20-40 sec). After that, joining is instant.',
    desktop:
      'You are one click away. The first connection downloads our resource pack — about 80 MB — which takes 20-40 seconds on a normal connection. After that, joining is instant.',
  },
  steps: {
    mobile: [
      'Click the server card.',
      'Wait for "Downloading server resource pack".',
      'Land at spawn lobby.',
      'Type /tutorial for in-game tips.',
    ],
    desktop: [
      'Click the server card in your Minecraft multiplayer list.',
      'Wait for "Downloading server resource pack" — it appears once.',
      'You will land at the spawn lobby. Press / for chat commands.',
      'Type /tutorial to see in-game tips, or just start exploring.',
    ],
  },
  callout: {
    mobile: 'The pack downloads inside Minecraft and removes automatically when you leave.',
    desktop:
      'You do not need to install anything manually. The pack downloads inside Minecraft and is removed automatically when you disconnect from our server.',
  },
  successTitle: {
    mobile: 'Auto-installed',
    desktop: 'Resource pack is automatic',
  },
  caption: 'Caption: The spawn lobby — choose your starter kit or open the in-game menu.',
};

export const JOIN_TROUBLESHOOTING = {
  lead: {
    mobile: 'Most issues have a 30-second fix.',
    desktop: 'Most issues fall into one of four buckets. Each item below has a 30-second fix.',
  },
  items: {
    mobile: [
      {
        title: '"Outdated server / client"',
        text: 'Update Minecraft to 1.20.4 (Java) or the latest Bedrock build.',
      },
      {
        title: '"Connection lost"',
        text: 'Check firewall and disable VPNs blocking port 25565.',
      },
      {
        title: 'Resource pack stuck',
        text: 'Restart Minecraft. If still hanging — /resourcepack reload after spawn.',
      },
      {
        title: 'Server not visible',
        text: 'Re-check the IP — no leading/trailing spaces.',
      },
    ],
    desktop: [
      {
        title: '"Outdated server" or "Outdated client"',
        text: 'Your Minecraft version does not match the server. Update Minecraft to 1.20.4 (Java) or the latest Bedrock build, then reconnect.',
      },
      {
        title: '"Connection lost" right after joining',
        text: 'Check your firewall — Minecraft uses port 25565 (Java) by default. Disable VPNs that block game traffic, then try again.',
      },
      {
        title: 'Resource pack stuck at 0%',
        text: 'Cancel the connection, restart Minecraft, and rejoin. If it still hangs, type /resourcepack reload in chat after spawning.',
      },
      {
        title: 'Server not visible in the list',
        text: 'Make sure you pasted the IP exactly — no leading or trailing spaces. The address is case-insensitive.',
      },
    ],
  },
};

export const JOIN_WHATS_NEXT = {
  lead: {
    mobile: 'Three things to do in your first 10 minutes.',
    desktop:
      'Now that you are in, here are the three things every new player should do in the first 10 minutes.',
  },
  bullets: {
    mobile: [
      'Run /sethome — 3 free homes to teleport between.',
      '/shop to see daily quests.',
      'Join the community Discord.',
    ],
    desktop: [
      'Run /sethome at your first base — you get 3 free homes to teleport between.',
      'Open the in-game shop with /shop and check the daily quests.',
      'Join the community Discord — most builders, traders, and PvP players hang out there.',
    ],
  },
};

export const JOIN_FEEDBACK = {
  hint: {
    mobile: 'Your vote helps us improve.',
    desktop: 'Your vote helps us prioritise which answers to expand and re-write.',
  },
  yes: { mobile: 'Yes', desktop: 'Yes, helpful' },
  no: { mobile: 'Not really', desktop: 'Could be better' },
  stats: {
    mobile: '243 out of 258 (94%) found this helpful',
    desktop: '243 out of 258 players (94%) found this helpful',
  },
};
