import type { ClientInfoField } from '../CheckoutModal/clientInfo';

export const CLIENT_INFO_FIELDS: ClientInfoField[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'streetAddress',
  'city',
  'zipCode',
];

export const CLIENT_INFO_LABEL_KEYS: Record<ClientInfoField, string> = {
  firstName: 'clientFirstName',
  lastName: 'clientLastName',
  email: 'clientEmail',
  phone: 'clientPhone',
  streetAddress: 'clientStreetAddress',
  city: 'clientCity',
  zipCode: 'clientZipCode',
};

export const CLIENT_INFO_PLACEHOLDER_KEYS: Record<ClientInfoField, string> = {
  firstName: 'clientFirstNamePlaceholder',
  lastName: 'clientLastNamePlaceholder',
  email: 'clientEmailPlaceholder',
  phone: 'clientPhonePlaceholder',
  streetAddress: 'clientStreetAddressPlaceholder',
  city: 'clientCityPlaceholder',
  zipCode: 'clientZipCodePlaceholder',
};

export function isHalfWidthClientInfoField(field: ClientInfoField): boolean {
  return field !== 'streetAddress';
}

export function inputTypeForClientInfoField(field: ClientInfoField): string {
  if (field === 'email') return 'email';
  if (field === 'phone') return 'tel';
  return 'text';
}

export function autoCompleteForClientInfoField(field: ClientInfoField): string {
  switch (field) {
    case 'firstName':
      return 'given-name';
    case 'lastName':
      return 'family-name';
    case 'email':
      return 'email';
    case 'phone':
      return 'tel';
    case 'streetAddress':
      return 'street-address';
    case 'city':
      return 'address-level2';
    case 'zipCode':
      return 'postal-code';
    default:
      return 'off';
  }
}
