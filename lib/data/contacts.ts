export const SUPPORT_EMAIL = 'help@minecraftsgame.com';
export const PRIVACY_EMAIL = 'privacy@minecraftsgame.com';

export const LEGAL_COMPANY_DETAILS = {
  name: 'Dexervil LTD',
  companyNo: '17345695',
  registeredAddress:
    '2nd Floor College House, 17 King Edwards Road, Ruislip, London, United Kingdom, HA4 7AE',
  email: PRIVACY_EMAIL,
} as const;

export const CONTACT_TOPICS = [
  { value: 'general' },
  { value: 'account' },
  { value: 'billing' },
  { value: 'privacy' },
  { value: 'other' },
] as const;

export type ContactTopicValue = (typeof CONTACT_TOPICS)[number]['value'];

export const CONTACT_STATS = [
  { id: 'quick' },
  { id: 'direct' },
  { id: 'helpful' },
] as const;

export type ContactStatId = (typeof CONTACT_STATS)[number]['id'];

export type ContactChannel = {
  id: string;
  icon: string;
  href: string;
  type: 'mailto';
  meta?: string;
};

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: 'email',
    icon: '✉',
    meta: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
    type: 'mailto',
  },
];
