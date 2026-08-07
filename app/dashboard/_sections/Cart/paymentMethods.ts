export type PaymentMethodId =
  | 'card'
  | 'openBanking'
  | 'volt'
  | 'payid'
  | 'interac'
  | 'blik';

export type PaymentMethod = {
  id: PaymentMethodId;
  icons: string[];
  labelKey: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    icons: ['/icons/payment/Visa.svg', '/icons/payment/Mastercard.svg'],
    labelKey: 'methodCard',
  },
  {
    id: 'openBanking',
    icons: ['/icons/payment/OpenBanking.svg'],
    labelKey: 'methodOpenBanking',
  },
  {
    id: 'volt',
    icons: ['/icons/payment/Volt.svg'],
    labelKey: 'methodVolt',
  },
  {
    id: 'payid',
    icons: ['/icons/payment/PayID.svg'],
    labelKey: 'methodPayid',
  },
  {
    id: 'interac',
    icons: ['/icons/payment/Interac.svg'],
    labelKey: 'methodInterac',
  },
  {
    id: 'blik',
    icons: ['/icons/payment/Blik.svg'],
    labelKey: 'methodBlik',
  },
];

export const DEFAULT_PAYMENT_METHOD: PaymentMethodId = 'card';

/** Flat list of all icon paths for compact sidebar strip. */
export const ALL_PAYMENT_ICONS = PAYMENT_METHODS.flatMap(method => method.icons);
