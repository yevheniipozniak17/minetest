import type { ArticleCardProps } from '../CardList/Card/Card';
import type { BlogPostFull } from './types';

export const BLOG_POSTS: BlogPostFull[] = [
  {
    slug: 'survival-tips',
    image: '/blog/1.webp',
    genre: 'Guides',
    time: 4,
    title: 'Top 10 survival tips for absolute beginners',
    description:
      'Spawning in a fresh world is overwhelming. Here is the short list of things to do in your first hour.',
    descriptionDesktop:
      'Spawning in a fresh world is overwhelming — trees everywhere, mobs at dusk, and no map. Here is the short list of things to do in your first hour, plus the three mistakes that ruin most new runs before day two.',
    date: 'Apr 22, 2026',
    popularity: 920,
    heroTags: ['Guides', 'Survival'],
    sidebarTags: ['Guides', 'Survival', 'Beginners', 'Tips'],
    breadcrumbLabel: 'Survival tips',
    lead: {
      mobile:
        'Your first hour in a survival world sets the tone for everything that follows. These ten priorities come from hundreds of new-player sessions on our servers — ranked by what actually keeps you alive.',
      desktop:
        'Your first hour in a survival world sets the tone for everything that follows. These ten priorities come from hundreds of new-player sessions on our servers — ranked by what actually keeps you alive, not by what speedrunners do on YouTube. Follow them in order and you will reach day two with food, shelter, and real tools.',
    },
    sections: [
      {
        id: '01',
        tocLabel: 'First-hour checklist',
        title: 'First-hour checklist',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Before you explore, commit to a simple loop: punch wood, craft planks, make a crafting table, then tools. Everything else waits until you have stone.',
              desktop:
                'Before you explore, commit to a simple loop: punch wood, craft planks, make a crafting table, then basic tools. Everything else — caves, villages, fancy builds — waits until you have stone gear and a place to sleep through the night.',
            },
          },
          {
            type: 'bullets',
            items: [
              'Gather 16+ logs and convert to planks.',
              'Craft a crafting table and wooden pickaxe.',
              'Mine 11 cobblestone for stone tools.',
              'Find coal or burn logs for torches.',
              'Build a 3×3 dirt shelter before sunset.',
            ],
            desktopItems: [
              'Gather at least 16 logs and convert them to planks.',
              'Craft a crafting table, sticks, and a wooden pickaxe.',
              'Mine 11 cobblestone and upgrade to stone tools.',
              'Find coal or smelt charcoal for at least four torches.',
              'Build a small dirt or cobble shelter before the sun sets.',
            ],
          },
        ],
      },
      {
        id: '02',
        tocLabel: 'Shelter before sunset',
        title: 'Shelter before sunset',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Night one kills more new players than creepers. You do not need a house — you need four walls, a roof, and a door. A hole in the ground counts.',
              desktop:
                'Night one kills more new players than creepers ever will. You do not need a house with windows — you need four walls, a roof, and a door. A hole in the ground with a torch counts. Light level matters: one torch inside prevents most mob spawns.',
            },
          },
          {
            type: 'figure',
            src: '/blog/1.webp',
            alt: 'Starter survival shelter at dusk',
            caption: 'Caption: A minimal first-night shelter — dirt walls, wooden door, one torch.',
            dashed: true,
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'Heads up',
            text: {
              mobile:
                'On our servers, sleeping skips the night only if most online players in your chunk are in beds. Solo? Your shelter is your sleep button.',
              desktop:
                'On our servers, sleeping skips the night only if most online players in your chunk are in beds. Playing solo? Your shelter is your sleep button — do not wander outside until you craft a bed.',
            },
          },
        ],
      },
      {
        id: '03',
        tocLabel: 'Food and hunger',
        title: 'Food and hunger',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Hunger drains while you sprint, jump, and fight. On day one, kill animals for meat or break tall grass for seeds. Bread beats raw meat for safety.',
              desktop:
                'Hunger drains while you sprint, jump, and fight. On day one, kill passive animals for meat or break tall grass for wheat seeds. Cooked food restores more — and bread is safer than eating raw chicken before you have spare health.',
            },
          },
          {
            type: 'ordered',
            items: [
              'Break grass until you have seeds.',
              'Hoe dirt near water and plant.',
              'Kill cows for leather (future armor) and beef.',
              'Smelt meat in a furnace once you have coal.',
            ],
            desktopItems: [
              'Break grass blocks until you collect wheat seeds.',
              'Craft a hoe, till dirt near water, and plant seeds.',
              'Kill cows for leather (future armor) and raw beef.',
              'Smelt meat in a furnace once you have coal or charcoal.',
            ],
          },
        ],
      },
      {
        id: '04',
        tocLabel: 'Tools and progression',
        title: 'Tools and progression',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Upgrade tools in order: wood → stone → iron. Never mine diamond with a stone pickaxe. Keep a spare pick in your hotbar — nothing stalls a run like breaking your only tool underground.',
              desktop:
                'Upgrade tools in order: wood → stone → iron → diamond. Never mine diamond ore with a stone pickaxe — you will destroy the drop. Keep a spare pick in your hotbar; nothing stalls a run like breaking your only tool two hundred blocks underground.',
            },
          },
          {
            type: 'quote',
            text: {
              mobile:
                '"Stone tools by sunset, iron by day three — that is the pace that feels good on our survival worlds."',
              desktop:
                '"Stone tools by sunset, iron by day three — that is the pace that feels good on our survival worlds. Rush diamond on day one and you usually die with full inventory."',
            },
            author: 'Elena Voss, Community Guide Lead',
          },
        ],
      },
      {
        id: '05',
        tocLabel: 'Three mistakes to avoid',
        title: 'Three mistakes to avoid',
        blocks: [
          {
            type: 'bullets',
            items: [
              'Digging straight down — lava and caves end runs instantly.',
              'Carrying everything — leave backup gear at base.',
              'Ignoring light — mobs spawn where you cannot see.',
            ],
            desktopItems: [
              'Digging straight down — lava pools and surprise caves end runs instantly.',
              'Carrying your entire inventory on exploration — leave backup tools and food at base.',
              'Ignoring light levels — hostile mobs spawn in any unlit space, including your unfinished basement.',
            ],
          },
          {
            type: 'callout',
            variant: 'warn',
            title: 'Common trap',
            text: {
              mobile:
                'Inventory shulker runs feel exciting until one creeper erases two hours of progress. Bank valuables early.',
              desktop:
                'Inventory shulker runs feel exciting until one creeper in a dark tunnel erases two hours of progress. Bank valuables in chests at base before you push into new biomes.',
            },
          },
        ],
      },
      {
        id: '06',
        tocLabel: 'What to do next',
        title: 'What to do next',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Once you survive three nights, shift from panic mode to planning: iron armor, a proper farm, and a mapped base. Our redstone wheat guide is the natural next step.',
              desktop:
                'Once you survive three nights, shift from panic mode to planning: iron armor, a proper crop farm, and a mapped base location. Our Redstone 101 wheat farm guide is the natural next step if you want passive food without babysitting crops.',
            },
          },
          {
            type: 'cta',
            primary: 'Subscribe to guides',
            secondaryLabel: 'Browse all articles',
            secondaryHref: '/blog',
          },
        ],
      },
    ],
  },
  {
    slug: 'iron-farm',
    image: '/blog/2.webp',
    genre: 'Engineering',
    time: 6,
    title: 'How to build an efficient iron farm in 2026',
    description:
      'A compact, lag-friendly design that produces ~600 ingots per hour and works on all three of our servers.',
    descriptionDesktop:
      'A compact, lag-friendly iron farm design that produces around 600 ingots per hour and works on all three of our servers — no datapacks required, no chunk-busting entity cramming, and fully AFK-friendly once you finish the build.',
    date: 'Apr 18, 2026',
    popularity: 1240,
    heroTags: ['Engineering', 'Farms'],
    sidebarTags: ['Engineering', 'Iron', 'Farms', 'Redstone'],
    breadcrumbLabel: 'Iron farm guide',
    lead: {
      mobile:
        'Iron is the bottleneck for tools, rails, and anvils on every long-term world. This 2026 layout trades size for throughput — roughly 600 ingots per hour on our standard tick rate.',
      desktop:
        'Iron is the bottleneck for tools, rails, and anvils on every long-term world. This 2026 layout trades footprint for throughput — roughly 600 ingots per hour on our standard tick rate, with entity counts low enough that TPS stays stable even on busy evenings.',
    },
    sections: [
      {
        id: '01',
        tocLabel: 'Why this design',
        title: 'Why this design',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Older iron farms relied on massive villager halls and unreliable spawn rates. The 2026 compact uses three platform layers and a single kill chamber — fewer entities, same output.',
              desktop:
                'Older iron farms relied on massive villager halls and unreliable spawn rates at server scale. The 2026 compact uses three platform layers, a single water-stream kill chamber, and one collection hopper line — fewer entities, same hourly output, and easier to debug when something breaks.',
            },
          },
          {
            type: 'bullets',
            items: [
              '~600 iron ingots per hour at default tick rate.',
              'Fits in a 16×16 claim without crossing neighbors.',
              'No client-side mods or datapacks required.',
              'AFK-safe once lava and hopper lines are tested.',
            ],
            desktopItems: [
              'Roughly 600 iron ingots per hour at our default tick rate.',
              'Fits entirely inside a 16×16 land claim without crossing into neighbors.',
              'No client-side mods, schematic mods, or server datapacks required.',
              'AFK-safe once lava blade timing and hopper lines are tested once.',
            ],
          },
        ],
      },
      {
        id: '02',
        tocLabel: 'Materials list',
        title: 'Materials list',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Budget one full evening for gathering. Most cost is beds, workstations, and building blocks — not redstone.',
              desktop:
                'Budget one full evening for gathering and a second for construction. Most of the material cost is beds, workstations, and building blocks — not redstone. You can substitute cobble for any decorative block without changing mechanics.',
            },
          },
          {
            type: 'ordered',
            items: [
              '3 villagers (2 workers + 1 zombie scare)',
              '36 beds and matching workstation blocks',
              '2 water buckets, 1 lava bucket, 4 hoppers',
              '48 building blocks per platform layer',
              '1 chest, 1 hopper minecart (optional boost)',
            ],
            desktopItems: [
              '3 villagers — two workers plus one zombie for scare mechanics',
              '36 beds and matching workstation blocks (one per bed)',
              '2 water buckets, 1 lava bucket, 4 hoppers, 8 chests',
              '48 building blocks per platform layer (144 total minimum)',
              '1 collection chest and 1 hopper minecart if your kill chamber spans chunks',
            ],
          },
        ],
      },
      {
        id: '03',
        tocLabel: 'Build overview',
        title: 'Build overview',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Stack three spawning platforms 65 blocks above your AFK spot. Villagers panic at the zombie, golems spawn on platforms, drop through water into the lava blade.',
              desktop:
                'Stack three spawning platforms 65 blocks above your AFK spot — high enough that underground caves do not steal mob cap. Villagers panic at the zombie behind a fence, golems spawn on the platforms, then drop through water streams into a central lava blade and hopper collection line.',
            },
          },
          {
            type: 'figure',
            src: '/blog/2.webp',
            alt: 'Compact iron farm cross-section diagram',
            caption: 'Caption: Side view of the three-layer platform stack and central kill chamber.',
            dashed: true,
          },
        ],
      },
      {
        id: '04',
        tocLabel: 'Step-by-step build',
        title: 'Step-by-step build',
        blocks: [
          {
            type: 'ordered',
            items: [
              'Mark a 7×7 pad at Y=120 (adjust for your terrain).',
              'Place beds and workstations in a ring; trap the zombie 2 blocks away.',
              'Add three 7×7 platforms spaced 5 blocks vertically.',
              'Run water streams toward the center drop chute.',
              'Install lava blade at Y=55 with sign protection.',
              'Connect hoppers to a double chest at ground level.',
            ],
            desktopItems: [
              'Mark a 7×7 pad at Y=120 — adjust upward if caves are noisy below.',
              'Place beds and workstations in a ring; trap the zombie two blocks away behind a fence gate.',
              'Add three identical 7×7 platforms spaced five blocks vertically.',
              'Run water streams on each platform toward the center drop chute.',
              'Install the lava blade at Y=55 with sign protection and a collection hopper.',
              'Connect hoppers to a double chest at ground level and label it.',
            ],
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'Villager safety',
            text: {
              mobile:
                'Name-tag your zombie and both worker villagers. If the zombie despawns, golem rates drop to zero until you replace it.',
              desktop:
                'Name-tag your zombie and both worker villagers before activating the farm. If the zombie despawns or a villager gets pulled into the kill chamber, golem rates drop to zero until you replace and re-link workstations.',
            },
          },
        ],
      },
      {
        id: '05',
        tocLabel: 'Optimization and troubleshooting',
        title: 'Optimization and troubleshooting',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Rates low? Check mob cap elsewhere, verify villagers sleep at night, and stand at the AFK pad — not inside the farm.',
              desktop:
                'Rates lower than expected? Check mob cap usage elsewhere on the server, verify villagers actually sleep at night, and AFK at the designated pad 40 blocks below the platforms — standing inside the farm breaks spawn logic on some versions.',
            },
          },
          {
            type: 'bullets',
            items: [
              'Golems stuck on edges — widen water streams by one block.',
              'Hopper clog — add a secondary chest and hopper chain.',
              'TPS dips — reduce redundant entities near the claim.',
            ],
            desktopItems: [
              'Golems stuck on platform edges — widen water streams by one block on each side.',
              'Hopper clog during peak hours — add a secondary chest and parallel hopper chain.',
              'Server TPS dips — reduce redundant item entities and idle mobs near your claim.',
            ],
          },
        ],
      },
      {
        id: '06',
        tocLabel: 'Server compatibility',
        title: 'Server compatibility',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'This design is tested on LuckySurvival, MineWars, and CalmSky. Claims protect the build; ask staff before crossing into wilderness on MineWars.',
              desktop:
                'This design is tested on our LuckySurvival, MineWars, and CalmSky servers with no rule changes required. Land claims protect the build from griefing — on MineWars, ask staff before placing villager modules near unclaimed wilderness borders.',
            },
          },
          {
            type: 'cta',
            primary: 'Save this guide',
            secondaryLabel: 'More engineering posts',
            secondaryHref: '/blog',
          },
        ],
      },
    ],
  },
  {
    slug: 'pvp-loadouts',
    image: '/blog/3.webp',
    genre: 'PvP',
    time: 5,
    title: 'PvP loadouts that actually work on MineWars',
    description:
      'We tested 18 builds across two weeks of small-scale fights. Four loadouts keep winning — the rest, retire.',
    descriptionDesktop:
      'We tested 18 builds across two weeks of small-scale MineWars fights — duels, border skirmishes, and nether highway ambushes. Four loadouts keep winning at our current meta. The rest are fine for practice, but you can safely retire them from serious fights.',
    date: 'Apr 15, 2026',
    popularity: 1580,
    heroTags: ['PvP', 'MineWars'],
    sidebarTags: ['PvP', 'MineWars', 'Loadouts', 'Meta'],
    breadcrumbLabel: 'PvP loadouts',
    lead: {
      mobile:
        'MineWars PvP on our servers is not about perfect armor — it is about kit synergy, pearl discipline, and knowing when to disengage. These four loadouts survived two weeks of recorded fights.',
      desktop:
        'MineWars PvP on our servers is not about perfect armor enchants — it is about kit synergy, pearl discipline, and knowing when to disengage. These four loadouts survived two weeks of recorded fights across 180+ engagements. Everything else underperformed once opponents started running crystals and mace tech.',
    },
    sections: [
      {
        id: '01',
        tocLabel: 'Current meta snapshot',
        title: 'Current meta snapshot',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Spring 2026 favors burst damage and fast re-pearl. Tank builds still win long fights, but only if you force them — most fights end in under 15 seconds.',
              desktop:
                'Spring 2026 favors burst damage and fast re-pearl timing. Tank builds still win extended trades, but only if you force them — most recorded fights on our MineWars shard ended in under fifteen seconds once both players had full kits.',
            },
          },
          {
            type: 'bullets',
            items: [
              'Crystal + mace hybrids dominate open terrain.',
              'Totem tanks survive nether hub brawls.',
              'Speed hit-and-run kits counter over-geared players.',
              'Budget kits matter — not everyone runs max enchants.',
            ],
            desktopItems: [
              'Crystal and mace hybrids dominate open terrain and desert highways.',
              'Totem tanks survive nether hub brawls and portal traps.',
              'Speed hit-and-run kits counter over-geared players who miss first hit.',
              'Budget kits still win — not every fight involves max-enchant netherite.',
            ],
          },
        ],
      },
      {
        id: '02',
        tocLabel: 'Loadout #1 — Crystal burst',
        title: 'Loadout #1 — Crystal burst',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Armor: Protection IV netherite with Blast Protection leggings. Off-hand totem always. Hotbar: crystals, obsidian, ender pearls, golden apples, mace.',
              desktop:
                'Armor: Protection IV netherite with Blast Protection IV leggings and Feather Falling boots. Off-hand totem at all times. Hotbar: end crystals, obsidian, ender pearls, golden apples, mace with Density V, and one gapple stack for sustain.',
            },
          },
          {
            type: 'callout',
            variant: 'warn',
            title: 'Risk profile',
            text: {
              mobile:
                'High self-damage if you miss placements. Practice on our PvP test shard before bringing this to spawn fights.',
              desktop:
                'High self-damage if you miss crystal placements or eat your own burst. Practice on our PvP test shard before bringing this kit to spawn fights — staff reset the arena every six hours.',
            },
          },
        ],
      },
      {
        id: '03',
        tocLabel: 'Loadout #2 — Totem tank',
        title: 'Loadout #2 — Totem tank',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Built for portal fights and narrow tunnels. Max Protection, two totems (off-hand + hotbar), sword with Sharpness V, slow falling potions optional.',
              desktop:
                'Built for portal fights, nether tunnels, and anywhere you cannot kite. Max Protection netherite, two totems (off-hand plus hotbar swap), sword with Sharpness V, strength splash optional, and slow falling for pearl recovery off cliffs.',
            },
          },
          {
            type: 'figure',
            src: '/blog/3.webp',
            alt: 'Totem tank PvP loadout inventory layout',
            caption: 'Caption: Totem tank hotbar — sword, pearls, gaps, second totem, blocks.',
          },
        ],
      },
      {
        id: '04',
        tocLabel: 'Loadout #3 — Speed hit-and-run',
        title: 'Loadout #3 — Speed hit-and-run',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Light armor with Swift Sneak and Speed II pots. Mace for vertical bursts, pearls for exits. Win condition: first hit, then disengage — never trade.',
              desktop:
                'Light armor with Swift Sneak III leggings and Speed II splash pots. Mace for vertical burst damage, pearls for exits through roof gaps. Win condition: land first hit from elevation, then disengage — never stand and trade against tank kits.',
            },
          },
          {
            type: 'quote',
            text: {
              mobile:
                '"If you are still full-trading in open field, you are donating gear. Hit, pearl out, re-engage from height."',
              desktop:
                '"If you are still full-trading in open field against crystal kits, you are donating gear to the economy. Hit, pearl out, re-engage from height — that is the whole kit."',
            },
            author: 'NovaShift, MineWars tournament finalist',
          },
        ],
      },
      {
        id: '05',
        tocLabel: 'Loadout #4 — Budget starter',
        title: 'Loadout #4 — Budget starter',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Diamond Prot II–III, iron sword Sharp IV, 8 pearls, 3 gaps, blocks. Cheap enough to lose twice and still profit from one kill.',
              desktop:
                'Diamond Protection II–III, iron sword Sharpness IV, eight ender pearls, three golden apples, and a stack of cobble for quick towers. Cheap enough to lose twice and still profit from one successful kill plus loot.',
            },
          },
          {
            type: 'bullets',
            items: [
              'Skip enchants you cannot replace in one session.',
              'Carry fewer pearls — budget kits win on patience.',
              'Fight near terrain you can pillar on.',
            ],
            desktopItems: [
              'Skip enchants you cannot replace in a single farming session.',
              'Carry fewer pearls — budget kits win on patience and positioning, not chase.',
              'Fight only near terrain you can pillar on or dip into for cover.',
            ],
          },
        ],
      },
      {
        id: '06',
        tocLabel: 'What to retire',
        title: 'What to retire',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Full Protection-only sword builds, bow-primary kits without pearls, and unenchanted diamond in crystal range — all underperformed in our tests. Keep them for duels, not MineWars.',
              desktop:
                'Full Protection-only sword builds, bow-primary kits without pearl escape, and unenchanted diamond in crystal range — all underperformed in our two-week test window. Keep them for friendly duels, not serious MineWars roaming.',
            },
          },
          {
            type: 'cta',
            primary: 'Join PvP test shard',
            secondaryLabel: 'Browse PvP guides',
            secondaryHref: '/blog',
          },
        ],
      },
    ],
  },
  {
    slug: 'player-spotlight',
    image: '/blog/4.webp',
    genre: 'Community',
    time: 3,
    title: 'Player of the month: meet RedstoneKing',
    description:
      "A 13-month run, a 40-floor sky base, and an impressive tournament finish — the full story from this month's spotlight.",
    descriptionDesktop:
      "A thirteen-month survival run, a forty-floor sky base visible from three biomes away, and a top-four tournament finish — the full story behind this month's community spotlight player, RedstoneKing.",
    date: 'Apr 12, 2026',
    popularity: 760,
    heroTags: ['Community', 'Spotlight'],
    sidebarTags: ['Community', 'Spotlight', 'Builds', 'Tournaments'],
    breadcrumbLabel: 'Player spotlight',
    lead: {
      mobile:
        'Every month we feature one player who pushes the community forward — not always the richest or highest PvP rank, but someone who makes the server feel alive. April belongs to RedstoneKing.',
      desktop:
        'Every month we feature one player who pushes the community forward — not always the richest account or highest PvP rank, but someone who makes the server feel alive through builds, guides, or community events. April belongs to RedstoneKing, a survival main who turned redstone obsession into something everyone can visit.',
    },
    sections: [
      {
        id: '01',
        tocLabel: 'Who is RedstoneKing',
        title: 'Who is RedstoneKing',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'RedstoneKing joined in March 2025 on Survival. No staff rank, no content creator tag — just a player who documented every farm upgrade in public Discord threads.',
              desktop:
                'RedstoneKing joined in March 2025 on our primary Survival shard. No staff rank, no official content creator tag — just a player who documented every farm upgrade in public Discord threads and answered new-player redstone questions at 2 a.m. server time.',
            },
          },
          {
            type: 'bullets',
            items: [
              '13 months active, 1,400+ hours logged.',
              'Zero ban history, three mentorship awards.',
              'Known for open-door base tours every Saturday.',
            ],
            desktopItems: [
              'Thirteen months active with more than 1,400 hours logged.',
              'Zero ban history and three community mentorship awards from moderators.',
              'Known for open-door base tours every Saturday at 16:00 UTC.',
            ],
          },
        ],
      },
      {
        id: '02',
        tocLabel: 'The sky base project',
        title: 'The sky base project',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'The headline build is a 40-floor tower above Y=220 — storage, farms, and a public museum floor with working redstone demos anyone can trigger.',
              desktop:
                'The headline build is a forty-floor tower anchored above Y=220 — automated storage, crop and mob farms, living quarters, and a public museum floor with working redstone demos that anyone can trigger without griefing permissions.',
            },
          },
          {
            type: 'figure',
            src: '/blog/4.webp',
            alt: 'RedstoneKing sky base exterior at sunset',
            caption: 'Caption: The sky base at sunset — beacon visible from the main spawn hub.',
            dashed: true,
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'Visit in game',
            text: {
              mobile:
                'Warp: /warp rk-tower on Survival. Museum floor is floors 38–40; please do not break demo blocks.',
              desktop:
                'Visit on Survival with /warp rk-tower. Museum floors are 38 through 40; please do not break demo blocks — they reset hourly but interrupt tours for other visitors.',
            },
          },
        ],
      },
      {
        id: '03',
        tocLabel: 'Tournament run',
        title: 'Tournament run',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'RedstoneKing is not a PvP main — which made the Season 2 bracket surprise real. Top-four finish running a tank kit borrowed from a friend, zero crystal practice.',
              desktop:
                'RedstoneKing is not a PvP main — which made the Season 2 bracket surprise real. They placed top four running a borrowed tank kit with zero crystal practice, winning three rounds on positioning alone before losing to last season\'s champion in semifinals.',
            },
          },
          {
            type: 'quote',
            text: {
              mobile:
                '"I signed up to see the new bracket UI. Staying alive four rounds was the actual achievement."',
              desktop:
                '"I signed up to see the new bracket UI and report bugs. Staying alive four rounds against actual PvP mains was the actual achievement — I still cannot place crystals cleanly."',
            },
            author: 'RedstoneKing',
          },
        ],
      },
      {
        id: '04',
        tocLabel: 'Community impact',
        title: 'Community impact',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Beyond builds, RedstoneKing runs a weekly "Redstone Office Hours" thread — screenshot your circuit, get async feedback. Over 200 replies last month alone.',
              desktop:
                'Beyond builds, RedstoneKing runs a weekly "Redstone Office Hours" thread in Discord — post a screenshot of your circuit, get async feedback within a day. Moderators counted over 200 helpful replies last month alone, many directed at first-time farm builders.',
            },
          },
          {
            type: 'bullets',
            items: [
              'Published three guest tips in our Redstone 101 series.',
              'Donated duplicate shulker kits to the new-player chest at spawn.',
              'Voted "most helpful builder" in the community poll.',
            ],
            desktopItems: [
              'Published three guest tips cross-linked in our Redstone 101 article series.',
              'Donated duplicate shulker kits to the new-player chest at central spawn.',
              'Voted "most helpful builder" in the April community poll with 34% of votes.',
            ],
          },
        ],
      },
      {
        id: '05',
        tocLabel: 'Tips from the player',
        title: 'Tips from the player',
        blocks: [
          {
            type: 'ordered',
            items: [
              'Label every hopper line — future you is also tired.',
              'Build farms above Y=100 to reduce cave noise.',
              'Tour other bases before copying YouTube schematics.',
            ],
            desktopItems: [
              'Label every hopper line and chest — future you is also tired at 1 a.m.',
              'Build automated farms above Y=100 to reduce cave noise and mob cap bleed.',
              'Tour other player bases on the server before copying generic YouTube schematics.',
            ],
          },
        ],
      },
      {
        id: '06',
        tocLabel: 'Nominate next month',
        title: 'Nominate next month',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Think someone deserves May spotlight? Open a ticket in Discord #community-nominate with their username and a sentence why. Staff and players both vote.',
              desktop:
                'Think someone deserves the May spotlight? Open a ticket in Discord #community-nominate with their username, server, and one sentence why. Staff and players both vote — wins need both community pull and clean moderation history.',
            },
          },
          {
            type: 'cta',
            primary: 'Nominate a player',
            secondaryLabel: 'All community posts',
            secondaryHref: '/blog',
          },
        ],
      },
    ],
  },
  {
    slug: 'redstone-wheat-farm',
    image: '/blog/5.webp',
    genre: 'Tutorials',
    time: 5,
    title: 'Redstone 101: an automated wheat farm in 30 minutes',
    description:
      'No prior redstone knowledge needed. Every block, every comparator, and the trick that doubles your yield.',
    descriptionDesktop:
      'No prior redstone knowledge needed. Every block, every comparator setting, and the observer trick that doubles your yield without expanding the footprint — buildable in survival within thirty minutes if you already have iron.',
    date: 'Apr 8, 2026',
    popularity: 1100,
    heroTags: ['Tutorials', 'Redstone'],
    sidebarTags: ['Tutorials', 'Redstone', 'Farms', 'Automation'],
    breadcrumbLabel: 'Wheat farm tutorial',
    lead: {
      mobile:
        'Automated wheat is the first redstone project we recommend after stone tools. This layout fits in a 9×7 plot, uses nine hoppers, and runs while you mine.',
      desktop:
        'Automated wheat is the first redstone project we recommend after stone tools. This layout fits in a 9×7 plot, uses nine hoppers and two observers, and runs while you mine underground — no clock circuits, no slime blocks, no mods.',
    },
    sections: [
      {
        id: '01',
        tocLabel: 'What you need',
        title: 'What you need',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Gather before you build — running back for one observer kills the thirty-minute target.',
              desktop:
                'Gather everything before you lay the first block — running back for one observer or a missing hopper kills the thirty-minute target and tempts you to leave the farm half-wired.',
            },
          },
          {
            type: 'ordered',
            items: [
              '1 iron hoe, 1 bucket of water',
              '9 hoppers, 2 chests, 2 observers',
              '1 piston, 1 redstone dust, 32 building blocks',
              '32 wheat seeds (plant after wiring)',
            ],
            desktopItems: [
              '1 iron hoe, 1 water bucket, 1 solid block for water containment',
              '9 hoppers, 2 chests, 2 observers facing each other',
              '1 piston, 1 redstone dust, 32 building blocks (cobble is fine)',
              '32 wheat seeds — plant only after the wiring is tested',
            ],
          },
        ],
      },
      {
        id: '02',
        tocLabel: 'Farm layout',
        title: 'Farm layout',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Nine wheat rows in a 9×7 rectangle. Water source at the back center hydrates the whole field. Collection hoppers run under the front two rows.',
              desktop:
                'Nine wheat rows in a 9×7 rectangle. One water source at the back center hydrates the entire field. Collection hoppers run under the front two rows where broken items slide — the rest of the floor is solid blocks to keep items in range.',
            },
          },
          {
            type: 'figure',
            src: '/blog/5.webp',
            alt: 'Top-down view of automated wheat farm layout',
            caption: 'Caption: Top-down layout — water rear, hoppers front, observer line on the side.',
            dashed: true,
          },
        ],
      },
      {
        id: '03',
        tocLabel: 'Wiring the harvester',
        title: 'Wiring the harvester',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Place an observer watching the front wheat row. When growth updates, it pulses the piston behind the row, breaking mature wheat into the water stream.',
              desktop:
                'Place an observer watching the front wheat row with the output facing into a piston behind the row. When any wheat block updates to its final growth stage, the observer pulses the piston, breaking mature wheat and seeds into the water stream below.',
            },
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'Comparator trick',
            text: {
              mobile:
                'Add a comparator reading a hopper under the field — farm only fires when the front chest is not full. Saves piston spam and server tick cost.',
              desktop:
                'Add a comparator reading a side hopper under the field — the farm only fires when the front chest is not full. This saves piston spam, reduces server tick cost, and is the trick that lets you scale to double rows later without lag.',
            },
          },
        ],
      },
      {
        id: '04',
        tocLabel: 'Testing and AFK collection',
        title: 'Testing and AFK collection',
        blocks: [
          {
            type: 'ordered',
            items: [
              'Plant seeds and bonemeal one row to force growth.',
              'Confirm items reach the chest within 5 seconds.',
              'Break and replace one observer if pulses misfire.',
              'AFK at the chest chunk — no player input needed.',
            ],
            desktopItems: [
              'Plant seeds and bonemeal one row to force a growth update.',
              'Confirm items reach the chest within five seconds of the pulse.',
              'Break and replace one observer if pulses misfire — usually a facing error.',
              'AFK within the chest chunk — no player input needed once rows are mature.',
            ],
          },
        ],
      },
      {
        id: '05',
        tocLabel: 'Doubling yield',
        title: 'Doubling yield',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Mirror the observer line on the opposite row — same piston circuit, shared hopper chain. You double output without doubling water or collection chests.',
              desktop:
                'Mirror the observer line on the opposite row — same piston circuit, shared hopper chain down the middle. You double output without doubling water sources or collection chests, and the comparator lock still applies to the whole system.',
            },
          },
          {
            type: 'quote',
            text: {
              mobile:
                '"If your farm needs a tutorial video playing beside you, simplify the design. Wheat farms should be boring."',
              desktop:
                '"If your wheat farm needs a tutorial video playing beside you in real time, simplify the design. Wheat farms should be boring, reliable, and slightly ugly."',
            },
            author: 'RedstoneKing, guest contributor',
          },
        ],
      },
      {
        id: '06',
        tocLabel: 'What to build next',
        title: 'What to build next',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Once bread is passive, move to iron or a mob farm — same hopper logic, bigger scale. Our iron farm guide is the usual step two.',
              desktop:
                'Once bread is passive, move to iron or a compact mob farm — same hopper collection logic, bigger scale. Our iron farm engineering guide is the usual step two on long-term survival worlds.',
            },
          },
          {
            type: 'cta',
            primary: 'Subscribe to tutorials',
            secondaryLabel: 'Browse all guides',
            secondaryHref: '/blog',
          },
        ],
      },
    ],
  },
  {
    slug: 'resource-packs',
    image: '/blog/6.webp',
    genre: 'Updates',
    time: 4,
    title: 'The 7 best resource packs to try in 2026',
    description:
      'From minimal vanilla refreshes to painterly worlds — the packs our team is running on every server right now.',
    descriptionDesktop:
      'From minimal vanilla refreshes to painterly worlds with custom skies — the seven resource packs our team is running on every server right now, plus install notes and performance impact on low-end laptops.',
    date: 'Apr 4, 2026',
    popularity: 680,
    heroTags: ['Updates', 'Resource packs'],
    sidebarTags: ['Updates', 'Resource packs', 'Visuals', 'Performance'],
    breadcrumbLabel: 'Resource packs 2026',
    lead: {
      mobile:
        'Resource packs are allowed on all our servers as long as they do not give unfair advantages — no x-ray, no low-fire PvP cheats. These seven are staff-approved and look great in screenshots.',
      desktop:
        'Resource packs are allowed on all our servers as long as they do not give unfair advantages — no x-ray, no low-fire PvP cheats, no clear-water tunnel vision. These seven are staff-approved, tested on 1.21 clients, and look great in screenshots without melting low-end laptops.',
    },
    sections: [
      {
        id: '01',
        tocLabel: 'How we picked them',
        title: 'How we picked them',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'We filtered hundreds of packs down to seven using three rules: readable UI at 1080p, stable FPS on integrated graphics, and no blocked textures on our anti-cheat scan.',
              desktop:
                'We filtered hundreds of community packs down to seven using three rules: readable UI at 1080p, stable FPS on integrated graphics during busy spawn events, and a clean pass on our anti-cheat texture scan — no unfair ore highlights or removed particles.',
            },
          },
          {
            type: 'bullets',
            items: [
              'Must work on Java 1.21.x without OptiFine.',
              'Under 128 MB download preferred.',
              'Distinct look — not seven copies of the same vanilla tweak.',
            ],
            desktopItems: [
              'Must work on Java 1.21.x without requiring OptiFine.',
              'Under 128 MB download preferred for quick launcher swaps.',
              'Distinct art direction — not seven copies of the same vanilla contrast tweak.',
            ],
          },
        ],
      },
      {
        id: '02',
        tocLabel: 'The seven picks',
        title: 'The seven picks',
        blocks: [
          {
            type: 'subheading',
            text: 'Minimal and vanilla-plus',
          },
          {
            type: 'ordered',
            items: [
              'Fresh Vanilla+ — sharper blocks, same vibe.',
              'Soft Leaves — gentler trees, great for builders.',
              'Clean GUI Lite — larger tooltips, calmer inventory.',
            ],
            desktopItems: [
              'Fresh Vanilla+ — sharper block edges and cleaner glass, same overall vibe.',
              'Soft Leaves — gentler foliage and trunks, great for cinematic builders.',
              'Clean GUI Lite — larger tooltips and calmer inventory contrast for long sessions.',
            ],
          },
          {
            type: 'subheading',
            text: 'Painterly and atmospheric',
          },
          {
            type: 'ordered',
            items: [
              'Terralith Skies — custom clouds and sunset gradients.',
              'Canvas Folk — hand-painted stone and wood.',
              'Deep Dark UI — moody menus for horror builders.',
              'Neon Circuit — sci-fi redstone lab aesthetic.',
            ],
            desktopItems: [
              'Terralith Skies — custom clouds and sunset gradients that match our shader-less policy.',
              'Canvas Folk — hand-painted stone and wood textures for medieval districts.',
              'Deep Dark UI — moody menus and darker hotbar for horror and cave builders.',
              'Neon Circuit — sci-fi panels and glowing redstone accents for lab bases.',
            ],
          },
          {
            type: 'figure',
            src: '/blog/6.webp',
            alt: 'Side-by-side comparison of resource pack textures',
            caption: 'Caption: Fresh Vanilla+ vs Canvas Folk on the same oak staircase build.',
          },
        ],
      },
      {
        id: '03',
        tocLabel: 'Performance notes',
        title: 'Performance notes',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Painterly packs cost 5–15 FPS on integrated graphics. Minimal packs are usually free performance-wise. Disable custom skies if you stutter at spawn.',
              desktop:
                'Full painterly packs typically cost five to fifteen FPS on integrated graphics during spawn events. Minimal packs are usually free performance-wise. Disable custom skies and animated textures first if you stutter — most packs expose toggles in their options folder.',
            },
          },
          {
            type: 'callout',
            variant: 'warn',
            title: 'Fair play reminder',
            text: {
              mobile:
                'Packs that remove fire, change hitboxes visually, or highlight ores are banned. When in doubt, ask in #support before tournament day.',
              desktop:
                'Packs that remove fire overlays, change hitbox visuals, or highlight hidden ores are banned and may trigger automatic kicks. When in doubt, ask in #support before tournament day — staff can scan your pack list in minutes.',
            },
          },
        ],
      },
      {
        id: '04',
        tocLabel: 'How to install',
        title: 'How to install',
        blocks: [
          {
            type: 'ordered',
            items: [
              'Download the .zip from the official links in our Discord pin.',
              'Open Minecraft → Options → Resource Packs → Open Pack Folder.',
              'Drop the zip in the folder and enable it in the list.',
              'Reconnect to any server — no restart required on our launcher.',
            ],
            desktopItems: [
              'Download the .zip from the official links pinned in Discord #resource-packs.',
              'Open Minecraft → Options → Resource Packs → Open Pack Folder.',
              'Drop the zip in the folder and move it to the selected column.',
              'Reconnect to any server in our launcher — a full restart is usually not required.',
            ],
          },
        ],
      },
      {
        id: '05',
        tocLabel: 'Server-specific rules',
        title: 'Server-specific rules',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'LuckySurvival and CalmSky allow all seven. MineWars allows cosmetic packs only — no UI that hides totem pop animations. Tournament bracket requires default fire overlay.',
              desktop:
                'LuckySurvival and CalmSky allow all seven without restriction. MineWars allows cosmetic packs only — no UI mods that hide totem pop animations or shorten fire overlays. Official tournament brackets require default fire and totem visuals for fairness reviews.',
            },
          },
        ],
      },
      {
        id: '06',
        tocLabel: 'Submit your pack',
        title: 'Submit your pack',
        blocks: [
          {
            type: 'paragraph',
            text: {
              mobile:
                'Built a pack on our servers? Submit for the summer list in #resource-packs with a screenshot album and FPS notes. We feature two community packs each season.',
              desktop:
                'Built a pack while playing on our servers? Submit for the summer staff picks list in #resource-packs with a screenshot album, download link, and honest FPS notes on integrated graphics. We feature two community packs each season alongside internal favorites.',
            },
          },
          {
            type: 'cta',
            primary: 'Get pack links',
            secondaryLabel: 'Browse all updates',
            secondaryHref: '/blog',
          },
        ],
      },
    ],
  },
];

const POSTS_BY_SLUG = new Map(BLOG_POSTS.map(post => [post.slug, post]));

export function getPostBySlug(slug: string): BlogPostFull | undefined {
  return POSTS_BY_SLUG.get(slug);
}

export function getAllPostSlugs(): string[] {
  return BLOG_POSTS.map(post => post.slug);
}

type RawGetter = (key: string) => unknown;

export function getTranslatedPost(slug: string, getRaw: RawGetter): BlogPostFull | undefined {
  const base = POSTS_BY_SLUG.get(slug);
  if (!base) return undefined;

  try {
    const pt = getRaw(`posts.${slug}`) as Partial<BlogPostFull> | null;
    if (!pt) return base;
    return {
      ...base,
      title: (pt.title as string) ?? base.title,
      description: (pt.description as string) ?? base.description,
      descriptionDesktop: (pt.descriptionDesktop as string | undefined) ?? base.descriptionDesktop,
      heroTags: (pt.heroTags as string[]) ?? base.heroTags,
      sidebarTags: (pt.sidebarTags as string[]) ?? base.sidebarTags,
      breadcrumbLabel: (pt.breadcrumbLabel as string) ?? base.breadcrumbLabel,
      lead: (pt.lead as BlogPostFull['lead']) ?? base.lead,
      sections: (pt.sections as BlogPostFull['sections']) ?? base.sections,
    };
  } catch {
    return base;
  }
}

function toCardProps(post: BlogPostFull): ArticleCardProps & { slug: string } {
  const { popularity: _popularity, slug, heroTags: _heroTags, sidebarTags: _sidebarTags, breadcrumbLabel: _breadcrumbLabel, descriptionDesktop: _descriptionDesktop, heroImageDesktop: _heroImageDesktop, lead: _lead, sections: _sections, ...card } = post;
  return { ...card, slug };
}

export function getRelatedArticles(currentSlug: string) {
  const others = BLOG_POSTS.filter(post => post.slug !== currentSlug);
  const picked = others.slice(0, 3);

  const mobile = picked.map(toCardProps);
  const desktop = picked.map(post => ({
    ...toCardProps(post),
    description: post.descriptionDesktop,
  }));

  return { mobile, desktop };
}
